/**
 * Insights store — orchestrates and caches the AI-generated reads.
 *
 * Generation is keyed by a content "signature" so we only call the model when
 * the journal actually changed — not on every screen visit. Results are
 * persisted so reopening the app shows the last read instantly.
 *
 *   - weekly : signature = (entries in last 7d + newest id). Free.
 *   - daily  : signature = (target day + that day's entry count + newest id of
 *              the day). The target day is the most recent day that has any
 *              entries, so a brand-new subscriber sees a read immediately and it
 *              rolls forward to a fresh read each new day they write. Premium.
 *
 * Crisis guardrail: if a window contains self-harm language we never send it to
 * the model — we surface a supportive message instead.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Entry } from './types';
import { useJournal } from './store';
import { dayKey, daysBetween, relativeDay, shortDate } from '../lib/date';
import { containsCrisisLanguage, crisisSupport } from '../lib/safety';
import { isConfigured } from '../lib/openrouter';
import { translate } from '../i18n';
import {
  generateWeeklyObservation,
  generateDailyReport,
  generateEntryInsight,
  type DailyReport,
} from '../lib/insights';

type Status = 'idle' | 'loading' | 'error';

export const WEEKLY_MIN = 3; // entries in the last 7 days (free weekly read)
export const DAILY_MIN = 1; // a single entry unlocks the premium daily read

/** How many days of prior context the daily read draws its throughline from. */
const DAILY_CONTEXT_DAYS = 14;
const DAILY_CONTEXT_MAX_ENTRIES = 40;

interface WeeklyResult {
  text: string;
  crisis: boolean;
}
interface DailyResult {
  data: DailyReport;
  crisis: boolean;
  /** human label for the day this read covers, e.g. "Today" or "Jun 28" */
  dayLabel: string;
}

interface InsightsState {
  weekly: WeeklyResult | null;
  weeklySig: string | null;
  weeklyStatus: Status;
  weeklyError: string | null;

  daily: DailyResult | null;
  dailySig: string | null;
  dailyStatus: Status;
  dailyError: string | null;

  // per-entry insight generation status, keyed by entry id (content lives on
  // the entry's `summary` in the journal store)
  entryStatus: Record<string, Status | undefined>;
  entryError: Record<string, string | undefined>;

  generateWeekly: (entries: Entry[], force?: boolean) => Promise<void>;
  generateDaily: (entries: Entry[], force?: boolean) => Promise<void>;
  generateEntry: (entry: Entry, force?: boolean) => Promise<void>;
  clear: () => void;
}

function windowed(entries: Entry[], days: number): Entry[] {
  const now = new Date();
  return entries.filter((e) => daysBetween(now, new Date(e.createdAt)) <= days);
}

function weeklySignature(win: Entry[]): string {
  if (win.length === 0) return 'weekly:empty';
  return `weekly:${win.length}:${win[0].id}`;
}

/**
 * Resolve the day the daily read should cover: the most recent calendar day
 * that has entries. Returns the entries written that day (newest-first), the
 * prior context window, a stable signature, and a human label.
 */
function resolveDailyTarget(entries: Entry[]):
  | { day: Entry[]; context: Entry[]; sig: string; label: string }
  | null {
  if (entries.length === 0) return null;
  const newest = entries[0]; // store keeps entries newest-first
  const targetKey = dayKey(newest.createdAt);
  const day = entries.filter((e) => dayKey(e.createdAt) === targetKey);
  const target = new Date(newest.createdAt);
  const context = entries
    .filter((e) => {
      if (dayKey(e.createdAt) === targetKey) return false;
      return daysBetween(target, new Date(e.createdAt)) <= DAILY_CONTEXT_DAYS;
    })
    .slice(0, DAILY_CONTEXT_MAX_ENTRIES);
  const label = relativeDay(newest.createdAt); // "Today" | "Yesterday" | "Mon" | "Jun 28"
  return {
    day,
    context,
    sig: `daily:${targetKey}:${day.length}:${day[0].id}`,
    label,
  };
}

/** Localized 'add your key' message (resolved at call time). */
const noKeyMsg = () => translate('errors.noKey');

export const useInsights = create<InsightsState>()(
  persist(
    (set, get) => ({
      weekly: null,
      weeklySig: null,
      weeklyStatus: 'idle',
      weeklyError: null,

      daily: null,
      dailySig: null,
      dailyStatus: 'idle',
      dailyError: null,

      entryStatus: {},
      entryError: {},

      generateWeekly: async (entries, force = false) => {
        const win = windowed(entries, 7);
        if (win.length < WEEKLY_MIN) return; // screen shows the "write more" state
        const sig = weeklySignature(win);
        if (!force && get().weeklySig === sig && get().weekly) return; // cached & unchanged
        if (get().weeklyStatus === 'loading') return; // a request is already in flight

        if (containsCrisisLanguage(win.map((e) => e.text).join(' '))) {
          set({
            weekly: { text: crisisSupport().message, crisis: true },
            weeklySig: sig,
            weeklyStatus: 'idle',
            weeklyError: null,
          });
          return;
        }
        if (!isConfigured()) {
          set({ weeklyStatus: 'error', weeklyError: noKeyMsg() });
          return;
        }

        set({ weeklyStatus: 'loading', weeklyError: null });
        try {
          const text = await generateWeeklyObservation(win);
          set({ weekly: { text, crisis: false }, weeklySig: sig, weeklyStatus: 'idle' });
        } catch (e: any) {
          set({ weeklyStatus: 'error', weeklyError: e?.message ?? translate('errors.generateRead') });
        }
      },

      generateDaily: async (entries, force = false) => {
        const target = resolveDailyTarget(entries);
        if (!target || target.day.length < DAILY_MIN) return; // screen shows the empty state
        const { day, context, sig, label } = target;
        if (!force && get().dailySig === sig && get().daily) return; // cached & unchanged
        if (get().dailyStatus === 'loading') return; // a request is already in flight

        if (containsCrisisLanguage(day.map((e) => e.text).join(' '))) {
          set({
            daily: {
              data: {
                title: translate('crisis.heavyDay'),
                read: crisisSupport().message,
                closing: '',
              },
              crisis: true,
              dayLabel: label,
            },
            dailySig: sig,
            dailyStatus: 'idle',
            dailyError: null,
          });
          return;
        }
        if (!isConfigured()) {
          set({ dailyStatus: 'error', dailyError: noKeyMsg() });
          return;
        }

        // `label` is now localized, so compare day keys instead of an English literal.
        const isToday = dayKey(day[0].createdAt) === dayKey(new Date());
        const dateLabel = isToday ? translate('date.today') : shortDate(day[0].createdAt);
        set({ dailyStatus: 'loading', dailyError: null });
        try {
          const data = await generateDailyReport(day, context, dateLabel);
          set({ daily: { data, crisis: false, dayLabel: label }, dailySig: sig, dailyStatus: 'idle' });
        } catch (e: any) {
          set({ dailyStatus: 'error', dailyError: e?.message ?? translate('errors.generateRead') });
        }
      },

      generateEntry: async (entry, force = false) => {
        // read the freshest copy (it may already have a reflection)
        const current = useJournal.getState().entries.find((e) => e.id === entry.id) ?? entry;
        if (!force && current.summary?.reflection) return; // already generated
        if (get().entryStatus[entry.id] === 'loading') return; // in-flight

        // crisis guard — never send self-harm content to the model
        if (containsCrisisLanguage(entry.text)) {
          useJournal.getState().setSummary(entry.id, { reflection: crisisSupport().message });
          set((s) => ({
            entryStatus: { ...s.entryStatus, [entry.id]: 'idle' },
            entryError: { ...s.entryError, [entry.id]: undefined },
          }));
          return;
        }
        if (!isConfigured()) {
          set((s) => ({
            entryStatus: { ...s.entryStatus, [entry.id]: 'error' },
            entryError: { ...s.entryError, [entry.id]: noKeyMsg() },
          }));
          return;
        }

        set((s) => ({
          entryStatus: { ...s.entryStatus, [entry.id]: 'loading' },
          entryError: { ...s.entryError, [entry.id]: undefined },
        }));
        try {
          const ins = await generateEntryInsight(entry);
          useJournal.getState().setSummary(entry.id, {
            gist: ins.gist || undefined,
            themes: ins.themes.length ? ins.themes : current.summary?.themes ?? [],
            reflection: ins.reflection,
          });
          set((s) => ({ entryStatus: { ...s.entryStatus, [entry.id]: 'idle' } }));
        } catch (e: any) {
          set((s) => ({
            entryStatus: { ...s.entryStatus, [entry.id]: 'error' },
            entryError: { ...s.entryError, [entry.id]: e?.message ?? 'Could not generate the insight.' },
          }));
        }
      },

      clear: () =>
        set({
          weekly: null,
          weeklySig: null,
          weeklyStatus: 'idle',
          weeklyError: null,
          daily: null,
          dailySig: null,
          dailyStatus: 'idle',
          dailyError: null,
          entryStatus: {},
          entryError: {},
        }),
    }),
    {
      name: 'throughline.insights.v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        weekly: s.weekly,
        weeklySig: s.weeklySig,
        daily: s.daily,
        dailySig: s.dailySig,
      }),
    },
  ),
);

export type { DailyReport };
