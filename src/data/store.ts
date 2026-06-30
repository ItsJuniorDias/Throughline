/**
 * Journal store — Throughline
 * ---------------------------------------------------------------------------
 * Zustand + AsyncStorage persistence. Holds entries and exposes a few derived
 * selectors (streak, mood-by-day, theme frequency) used by the screens. Derived
 * values are plain functions so they can be memoized at the call site rather
 * than living in state.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DraftEntry, Entry, Mood } from './types';
import { buildSeedEntries } from './mock';
import { dayKey, daysAgo, daysBetween } from '../lib/date';

interface JournalState {
  entries: Entry[];
  hasSeeded: boolean;
  addEntry: (draft: DraftEntry) => Entry;
  deleteEntry: (id: string) => void;
  seedIfEmpty: () => void;
  clearAll: () => void;
}

function uid(): string {
  return `e-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useJournal = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      hasSeeded: false,

      addEntry: (draft) => {
        const entry: Entry = {
          id: uid(),
          createdAt: new Date().toISOString(),
          text: draft.text.trim(),
          mood: draft.mood,
          tags: draft.tags,
          promptId: draft.promptId,
          summary: { themes: draft.tags },
        };
        set((s) => ({
          entries: [entry, ...s.entries].sort(
            (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
          ),
        }));
        return entry;
      },

      deleteEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

      seedIfEmpty: () => {
        const { entries, hasSeeded } = get();
        if (entries.length === 0 && !hasSeeded) {
          set({ entries: buildSeedEntries(), hasSeeded: true });
        }
      },

      clearAll: () => set({ entries: [], hasSeeded: true }),
    }),
    {
      name: 'throughline.journal.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ entries: s.entries, hasSeeded: s.hasSeeded }),
    },
  ),
);

// ─── Derived selectors (pure helpers over the entry list) ─────────────────────

export function getEntryById(entries: Entry[], id: string): Entry | undefined {
  return entries.find((e) => e.id === id);
}

/** Consecutive days (ending today or yesterday) that have at least one entry. */
export function computeStreak(entries: Entry[]): number {
  if (entries.length === 0) return 0;
  const days = new Set(entries.map((e) => dayKey(e.createdAt)));
  let streak = 0;
  // allow the streak to "still be alive" if the last entry was yesterday
  const today = new Date();
  let cursorOffset = days.has(dayKey(today)) ? 0 : days.has(dayKey(daysAgo(1))) ? 1 : -1;
  if (cursorOffset === -1) return 0;
  while (days.has(dayKey(daysAgo(cursorOffset)))) {
    streak += 1;
    cursorOffset += 1;
  }
  return streak;
}

export interface DayMood {
  key: string;
  date: Date;
  /** average mood for the day, or null if no entry */
  mood: number | null;
  count: number;
}

/** Average mood per calendar day across the last `n` days (oldest → newest). */
export function moodByDay(entries: Entry[], n: number): DayMood[] {
  const buckets = new Map<string, { sum: number; count: number }>();
  for (const e of entries) {
    const k = dayKey(e.createdAt);
    const b = buckets.get(k) ?? { sum: 0, count: 0 };
    b.sum += e.mood;
    b.count += 1;
    buckets.set(k, b);
  }
  const out: DayMood[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = daysAgo(i);
    const k = dayKey(date);
    const b = buckets.get(k);
    out.push({ key: k, date, mood: b ? b.sum / b.count : null, count: b?.count ?? 0 });
  }
  return out;
}

export interface ThemeCount {
  tag: string;
  count: number;
}

/** Tag frequency across all (or windowed) entries, most common first. */
export function themeFrequency(entries: Entry[], withinDays?: number): ThemeCount[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (withinDays != null && daysBetween(new Date(), new Date(e.createdAt)) > withinDays) continue;
    for (const t of e.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/** Average mood over a trailing window, or null if no entries fall inside it. */
export function averageMood(entries: Entry[], withinDays: number): number | null {
  const inWindow = entries.filter(
    (e) => daysBetween(new Date(), new Date(e.createdAt)) <= withinDays,
  );
  if (inWindow.length === 0) return null;
  return inWindow.reduce((acc, e) => acc + e.mood, 0) / inWindow.length;
}

export type { Entry, Mood };
