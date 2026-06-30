/**
 * Lightweight date helpers. No external date lib — Intl + a few primitives keep
 * the bundle small and avoid timezone surprises for a journaling use case.
 *
 * Word labels (greeting, Today/Yesterday) come from i18n, and every Intl call is
 * handed the active locale so dates format in the chosen language. Components
 * that render these must subscribe to the language (use `useT()`) so they
 * re-render on a language switch.
 */

import { translate, getActiveLocale } from '../i18n';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local YYYY-MM-DD key, used to bucket entries by calendar day. */
export function dayKey(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / DAY_MS);
}

export function isSameDay(a: Date | string, b: Date | string): boolean {
  return dayKey(a) === dayKey(b);
}

/** "Good morning" | "Good afternoon" | "Good evening" by local hour. */
export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 12) return translate('date.morning');
  if (h < 18) return translate('date.afternoon');
  return translate('date.evening');
}

/** e.g. "Tue, Jun 30" */
export function shortDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString(getActiveLocale(), {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** e.g. "8:42 PM" */
export function clockTime(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleTimeString(getActiveLocale(), { hour: 'numeric', minute: '2-digit' });
}

/** Human relative label: Today / Yesterday / Tue / Jun 12. */
export function relativeDay(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  const diff = daysBetween(new Date(), date);
  if (diff === 0) return translate('date.today');
  if (diff === 1) return translate('date.yesterday');
  if (diff < 7) return date.toLocaleDateString(getActiveLocale(), { weekday: 'long' });
  return date.toLocaleDateString(getActiveLocale(), { month: 'short', day: 'numeric' });
}

/** Returns the Date for `n` days ago at start of day. */
export function daysAgo(n: number): Date {
  return startOfDay(new Date(Date.now() - n * DAY_MS));
}

/** Month label like "June 2026". */
export function monthLabel(d = new Date()): string {
  return d.toLocaleDateString(getActiveLocale(), { month: 'long', year: 'numeric' });
}
