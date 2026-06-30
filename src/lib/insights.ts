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
 * Safety: prompts forbid diagnosis/advice; this is reflection, not therapy. The
 * crisis guardrail (skipping the model entirely) lives in the insights store.
 */

import type { Entry } from '../data/types';
import { MODELS, FREE_FALLBACKS, complete, completeJSON, type ChatMessage } from './openrouter';
import { shortDate } from './date';
import { moodMeta } from './mood';

// Model chains tried in order on rate-limit. Weekly is cheap → free chain;
// report starts from MODELS.report (which may be a paid model in production)
// then falls back to free ones if it's rate-limited.
const WEEKLY_MODELS = FREE_FALLBACKS;
const REPORT_MODELS = Array.from(new Set([MODELS.report, ...FREE_FALLBACKS]));

const SYSTEM = [
  'You are a reflective journaling companion for an app called Throughline.',
  'You write honest, specific, warm observations about patterns in someone\'s journal.',
  'You are NOT a therapist or doctor. Never diagnose. Never give medical, clinical, or',
  'prescriptive advice. Reflect and notice; do not instruct or tell them what to do.',
  'Write in English, in a calm, literary, concrete voice. Be specific to their entries —',
  'no generic platitudes. Address the reader as "you". Keep it tight.',
  'If entries express thoughts of self-harm or crisis, do not analyze them — gently',
  'acknowledge it sounds heavy and suggest reaching out to someone they trust or a local',
  'crisis line.',
].join(' ');

/** One compact line per entry — the model input. */
export function buildDigest(entries: Entry[]): string {
  return entries
    .slice() // newest-first already; keep order
    .map((e) => {
      const date = shortDate(e.createdAt);
      const mood = moodMeta(e.mood).label;
      const tags = e.tags.length ? ` · ${e.tags.join(', ')}` : '';
      const gist = (e.summary?.gist ?? e.text).replace(/\s+/g, ' ').trim().slice(0, 240);
      return `- ${date} · ${mood}${tags}: ${gist}`;
    })
    .join('\n');
}

// ─── Weekly observation ──────────────────────────────────────────────────────

export async function generateWeeklyObservation(
  entries: Entry[],
  signal?: AbortSignal,
): Promise<string> {
  const digest = buildDigest(entries);
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM },
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

// ─── Monthly report (premium) ────────────────────────────────────────────────

export interface MonthlyReport {
  title: string;
  overview: string;
  themes: { tag: string; note: string }[];
  moodNarrative: string;
  definingMoment?: { date: string; note: string };
  closing: string;
}

export async function generateMonthlyReport(
  entries: Entry[],
  monthName: string,
  signal?: AbortSignal,
): Promise<MonthlyReport> {
  const digest = buildDigest(entries);
  const schema = `{
  "title": "a short, evocative title for the month (max ~6 words)",
  "overview": "2-4 sentences naming the shape of the month",
  "themes": [{ "tag": "a recurring theme", "note": "1 sentence on what it carried" }],
  "moodNarrative": "1-2 sentences on how mood moved across the month",
  "definingMoment": { "date": "Mon D", "note": "1 sentence on a moment that defined it" },
  "closing": "1 honest closing sentence"
}`;
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM },
    {
      role: 'user',
      content:
        `Here are my journal entries from ${monthName} (newest first):\n\n${digest}\n\n` +
        `Write my monthly report as a longitudinal read — patterns across mood and themes, ` +
        `what shifted, and the throughlines I can't see day to day. Include 2–4 themes.\n\n` +
        `Respond with ONLY valid JSON in exactly this shape (no markdown, no extra text):\n${schema}`,
    },
  ];
  const report = await completeJSON<MonthlyReport>({
    models: REPORT_MODELS,
    messages,
    maxTokens: 900,
    temperature: 0.6,
    signal,
  });
  // light normalization so the UI never crashes on a malformed field
  return {
    title: report.title?.trim() || `Your ${monthName}`,
    overview: report.overview?.trim() || '',
    themes: Array.isArray(report.themes) ? report.themes.filter((t) => t?.tag && t?.note).slice(0, 4) : [],
    moodNarrative: report.moodNarrative?.trim() || '',
    definingMoment:
      report.definingMoment?.date && report.definingMoment?.note ? report.definingMoment : undefined,
    closing: report.closing?.trim() || '',
  };
}
