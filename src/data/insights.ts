/**
 * Insights store — orchestrates and caches the AI-generated reads.
 *
 * Generation is keyed by a content "signature" (how many entries are in the
 * window + the newest entry id), so we only call the model when the journal
 * actually changed — not on every screen visit. Results are persisted so
 * reopening the app shows the last read instantly.
 *
 * Crisis guardrail: if the window contains self-harm language we never send it
 * to the model — we surface a supportive message instead.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Entry } from './types';
import { useJournal } from './store';
import { daysBetween } from '../lib/date';
import { containsCrisisLanguage, CRISIS_SUPPORT } from '../lib/safety';
import { isConfigured } from '../lib/openrouter';
import {
  generateWeeklyObservation,
  generateMonthlyReport,
  generateEntryInsight,
  type MonthlyReport,
} from '../lib/insights';

type Status = 'idle' | 'loading' | 'error';

export const WEEKLY_MIN = 3; // entries in the last 7 days
export const MONTHLY_MIN = 5; // entries in the last 30 days

interface WeeklyResult {
  text: string;
  crisis: boolean;
}
interface ReportResult {
  data: MonthlyReport;
  crisis: boolean;
}

interface InsightsState {
  weekly: WeeklyResult | null;
  weeklySig: string | null;
  weeklyStatus: Status;
  weeklyError: string | null;

  report: ReportResult | null;
  reportSig: string | null;
  reportStatus: Status;
  reportError: string | null;

  // per-entry insight generation status, keyed by entry id (content lives on
  // the entry's `summary` in the journal store)
  entryStatus: Record<string, Status | undefined>;
  entryError: Record<string, string | undefined>;

  generateWeekly: (entries: Entry[], force?: boolean) => Promise<void>;
  generateReport: (entries: Entry[], monthName: string, force?: boolean) => Promise<void>;
  generateEntry: (entry: Entry, force?: boolean) => Promise<void>;
  clear: () => void;
}

function windowed(entries: Entry[], days: number): Entry[] {
  const now = new Date();
  return entries.filter((e) => daysBetween(now, new Date(e.createdAt)) <= days);
}

function signature(win: Entry[], days: number): string {
  if (win.length === 0) return `empty:${days}`;
  return `${win.length}:${win[0].id}:${days}`;
}

const NO_KEY_MSG = 'Add your OpenRouter key to .env to generate insights.';

export const useInsights = create<InsightsState>()(
  persist(
    (set, get) => ({
      weekly: null,
      weeklySig: null,
      weeklyStatus: 'idle',
      weeklyError: null,

      report: null,
      reportSig: null,
      reportStatus: 'idle',
      reportError: null,

      entryStatus: {},
      entryError: {},

      generateWeekly: async (entries, force = false) => {
        const win = windowed(entries, 7);
        if (win.length < WEEKLY_MIN) return; // screen shows the "write more" state
        const sig = signature(win, 7);
        if (!force && get().weeklySig === sig && get().weekly) return; // cached & unchanged
        if (get().weeklyStatus === 'loading') return; // a request is already in flight

        if (containsCrisisLanguage(win.map((e) => e.text).join(' '))) {
          set({
            weekly: { text: CRISIS_SUPPORT.message, crisis: true },
            weeklySig: sig,
            weeklyStatus: 'idle',
            weeklyError: null,
          });
          return;
        }
        if (!isConfigured()) {
          set({ weeklyStatus: 'error', weeklyError: NO_KEY_MSG });
          return;
        }

        set({ weeklyStatus: 'loading', weeklyError: null });
        try {
          const text = await generateWeeklyObservation(win);
          set({ weekly: { text, crisis: false }, weeklySig: sig, weeklyStatus: 'idle' });
        } catch (e: any) {
          set({ weeklyStatus: 'error', weeklyError: e?.message ?? 'Could not generate the read.' });
        }
      },

      generateReport: async (entries, monthName, force = false) => {
        const win = windowed(entries, 30);
        if (win.length < MONTHLY_MIN) return;
        const sig = signature(win, 30);
        if (!force && get().reportSig === sig && get().report) return;
        if (get().reportStatus === 'loading') return; // a request is already in flight

        if (containsCrisisLanguage(win.map((e) => e.text).join(' '))) {
          set({
            report: {
              data: {
                title: 'A heavy month',
                overview: CRISIS_SUPPORT.message,
                themes: [],
                moodNarrative: '',
                closing: '',
              },
              crisis: true,
            },
            reportSig: sig,
            reportStatus: 'idle',
            reportError: null,
          });
          return;
        }
        if (!isConfigured()) {
          set({ reportStatus: 'error', reportError: NO_KEY_MSG });
          return;
        }

        set({ reportStatus: 'loading', reportError: null });
        try {
          const data = await generateMonthlyReport(win, monthName);
          set({ report: { data, crisis: false }, reportSig: sig, reportStatus: 'idle' });
        } catch (e: any) {
          set({ reportStatus: 'error', reportError: e?.message ?? 'Could not generate the report.' });
        }
      },

      generateEntry: async (entry, force = false) => {
        // read the freshest copy (it may already have a reflection)
        const current = useJournal.getState().entries.find((e) => e.id === entry.id) ?? entry;
        if (!force && current.summary?.reflection) return; // already generated
        if (get().entryStatus[entry.id] === 'loading') return; // in-flight

        // crisis guard — never send self-harm content to the model
        if (containsCrisisLanguage(entry.text)) {
          useJournal.getState().setSummary(entry.id, { reflection: CRISIS_SUPPORT.message });
          set((s) => ({
            entryStatus: { ...s.entryStatus, [entry.id]: 'idle' },
            entryError: { ...s.entryError, [entry.id]: undefined },
          }));
          return;
        }
        if (!isConfigured()) {
          set((s) => ({
            entryStatus: { ...s.entryStatus, [entry.id]: 'error' },
            entryError: { ...s.entryError, [entry.id]: NO_KEY_MSG },
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
          report: null,
          reportSig: null,
          reportStatus: 'idle',
          reportError: null,
          entryStatus: {},
          entryError: {},
        }),
    }),
    {
      name: 'throughline.insights.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        weekly: s.weekly,
        weeklySig: s.weeklySig,
        report: s.report,
        reportSig: s.reportSig,
      }),
    },
  ),
);

export type { MonthlyReport };
