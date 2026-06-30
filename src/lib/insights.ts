/**
 * Insight generation — turns journal entries into longitudinal reads via
 * OpenRouter.
 *
 * Architecture note (layered summarization): we never send the raw corpus. We
 * build a COMPACT digest (one terse line per entry: date · mood · tags · gist).
 * For scale (many months), pre-summarize each entry once at write time into
 * `entry.summary.gist` and roll those up — `buildDigest` already prefers a
 * stored gist when present, so that upgrade is drop-in.
 *
 * The reads, by cadence:
 *   - per-entry  : a reflection on a single note, generated on save (free).
 *   - weekly     : one observation across the last 7 days (free).
 *   - DAILY      : the premium hero. A read of the day in the context of the
 *                  recent thread — the throughline you can't see one day at a
 *                  time. Generated from a single entry, so it's there the moment
 *                  someone subscribes (no month-long wait for data).
 *
 * Safety: prompts forbid diagnosis/advice; this is reflection, not therapy. The
 * crisis guardrail (skipping the model entirely) lives in the insights store.
 */

import type { Entry } from '../data/types';
import { MODELS, FREE_FALLBACKS, complete, completeJSON, type ChatMessage } from './openrouter';
import { shortDate } from './date';
import { moodLabel } from './mood';
import { translate, getActiveLanguage } from '../i18n';

// Model chains tried in order on rate-limit. Weekly is cheap → free chain;
// the daily read starts from MODELS.report (which may be a paid frontier model
// in production) then falls back to free ones if it's rate-limited.
const WEEKLY_MODELS = FREE_FALLBACKS;
const DAILY_MODELS = Array.from(new Set([MODELS.report, ...FREE_FALLBACKS]));

/**
 * System prompt, built per call so the model writes the read in the user's
 * chosen language (getActiveLanguage().ai resolves to e.g. "Brazilian
 * Portuguese"). The no-diagnosis / no-advice guardrails and the voice are
 * constant; only the target language changes.
 */
function buildSystem(): string {
  const language = getActiveLanguage().ai;
  return [
    'You are a reflective journaling companion for an app called Throughline.',
    "You write honest, specific, warm observations about patterns in someone's journal.",
    'You are NOT a therapist or doctor. Never diagnose. Never give medical, clinical, or',
    'prescriptive advice. Reflect and notice; do not instruct or tell them what to do.',
    `Write entirely in ${language}, in a calm, literary, concrete voice. Be specific to their`,
    'entries — no generic platitudes. Address the reader as "you". Keep it tight.',
    'If entries express thoughts of self-harm or crisis, do not analyze them — gently',
    'acknowledge it sounds heavy and suggest reaching out to someone they trust or a local',
    'crisis line.',
  ].join(' ');
}

/** One compact line per entry — the model input. */
export function buildDigest(entries: Entry[]): string {
  return entries
    .slice() // newest-first already; keep order
    .map((e) => {
      const date = shortDate(e.createdAt);
      const mood = moodLabel(e.mood);
      const tags = e.tags.length ? ` · ${e.tags.join(', ')}` : '';
      const gist = (e.summary?.gist ?? e.text).replace(/\s+/g, ' ').trim().slice(0, 240);
      return `- ${date} · ${mood}${tags}: ${gist}`;
    })
    .join('\n');
}

// ─── Weekly observation (free) ───────────────────────────────────────────────

export async function generateWeeklyObservation(
  entries: Entry[],
  signal?: AbortSignal,
): Promise<string> {
  const digest = buildDigest(entries);
  const messages: ChatMessage[] = [
    { role: 'system', content: buildSystem() },
    {
      role: 'user',
      content:
        `Here are my journal entries from the past week (newest first):\n\n${digest}\n\n` +
        'Write ONE short observation (2–3 sentences) about a pattern, tension, or throughline ' +
        'across this week. Notice something I might not have. No advice, no summary of each day, ' +
        'no preamble — just the observation.',
    },
  ];
  const text = await complete({ models: WEEKLY_MODELS, messages, maxTokens: 220, temperature: 0.7, signal });
  // guard against the model wrapping it in quotes/labels
  return text.replace(/^["“]|["”]$/g, '').replace(/^observation:\s*/i, '').trim();
}

// ─── Daily read (premium hero) ───────────────────────────────────────────────

export interface DailyReport {
  /** short, evocative title for the day */
  title: string;
  /** 2–3 sentences naming the shape of the day */
  read: string;
  /** 1–2 sentences connecting today to the recent thread — the longitudinal payoff */
  throughline?: string;
  /** 1 reflective sentence on what the day quietly surfaces (NOT advice) */
  focus?: string;
  /** 1 honest closing line */
  closing: string;
}

/**
 * Generate the day's read. `dayEntries` are the entries written on the target
 * day (newest-first); `context` is a short lookback over the preceding days so
 * the model can draw the line *through* them — that continuity is the whole
 * premium value. With no prior context (a first-ever day) the throughline is
 * simply omitted.
 */
export async function generateDailyReport(
  dayEntries: Entry[],
  context: Entry[],
  dateLabel: string,
  signal?: AbortSignal,
): Promise<DailyReport> {
  const today = buildDigest(dayEntries);
  const prior = context.length ? buildDigest(context) : '';

  const schema = `{
  "title": "a short, evocative title for the day (max ~6 words)",
  "read": "2-3 sentences naming the shape of ${dateLabel}",
  "throughline": "1-2 sentences connecting ${dateLabel} to the recent days — the pattern running through them (omit if there is no prior context)",
  "focus": "1 reflective sentence naming what ${dateLabel} quietly surfaces to sit with (a noticing, NOT advice)",
  "closing": "1 honest closing sentence"
}`;

  const priorBlock = prior
    ? `\n\nFor context, my recent days before ${dateLabel} (newest first):\n\n${prior}`
    : '';

  const messages: ChatMessage[] = [
    { role: 'system', content: buildSystem() },
    {
      role: 'user',
      content:
        `Here is what I wrote on ${dateLabel} (newest first):\n\n${today}${priorBlock}\n\n` +
        `Write my read for ${dateLabel}: the shape of the day, and — using the recent context — ` +
        `the throughline running from those days into this one that I can't see one day at a time. ` +
        `Be specific to my entries. No advice.\n\n` +
        `Respond with ONLY valid JSON in exactly this shape (no markdown, no extra text):\n${schema}`,
    },
  ];

  const report = await completeJSON<DailyReport>({
    models: DAILY_MODELS,
    messages,
    maxTokens: 700,
    temperature: 0.6,
    signal,
  });

  // light normalization so the UI never crashes on a malformed field
  return {
    title: report.title?.trim() || translate('ai.yourDay', { label: dateLabel }),
    read: report.read?.trim() || '',
    throughline: report.throughline?.trim() || undefined,
    focus: report.focus?.trim() || undefined,
    closing: report.closing?.trim() || '',
  };
}

// ─── Per-entry insight (generated on save, free) ─────────────────────────────

export interface EntryInsight {
  gist: string;
  themes: string[];
  reflection: string;
}

/**
 * Generate an insight for a SINGLE entry, right after it's written. Returns a
 * one-line gist + themes (which feed the weekly/daily rollups) and a short
 * reflection shown to the user. Uses the free fallback chain (cheap, frequent).
 */
export async function generateEntryInsight(
  entry: Entry,
  signal?: AbortSignal,
): Promise<EntryInsight> {
  const date = shortDate(entry.createdAt);
  const mood = moodLabel(entry.mood);
  const tags = entry.tags.length ? entry.tags.join(', ') : '—';
  const schema = `{
  "gist": "a 4-8 word distillation of this entry",
  "themes": ["1-3 short, lowercase theme tags"],
  "reflection": "2-3 sentences reflecting back a pattern, tension, or what this entry quietly reveals"
}`;
  const messages: ChatMessage[] = [
    { role: 'system', content: buildSystem() },
    {
      role: 'user',
      content:
        `A journal entry — ${date} · mood: ${mood} · tags: ${tags}\n\n"${entry.text}"\n\n` +
        `Reflect on THIS entry. Notice something honest and specific — don't just restate it, ` +
        `and don't give advice.\n\n` +
        `Respond with ONLY valid JSON in exactly this shape (no markdown, no extra text):\n${schema}`,
    },
  ];
  const out = await completeJSON<EntryInsight>({
    models: WEEKLY_MODELS,
    messages,
    maxTokens: 320,
    temperature: 0.7,
    signal,
  });
  return {
    gist: (out.gist ?? '').replace(/\s+/g, ' ').trim(),
    themes: Array.isArray(out.themes)
      ? out.themes.filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim().toLowerCase()).slice(0, 3)
      : [],
    reflection: (out.reflection ?? '').trim(),
  };
}
