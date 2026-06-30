/**
 * Lightweight date helpers. No external date lib — Intl + a few primitives keep
 * the bundle small and avoid timezone surprises for a journaling use case.
 */

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
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** e.g. "Tue, Jun 30" */
export function shortDate(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** e.g. "8:42 PM" */
export function clockTime(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** Human relative label: Today / Yesterday / Tue / Jun 12. */
export function relativeDay(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  const diff = daysBetween(new Date(), date);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return date.toLocaleDateString(undefined, { weekday: 'long' });
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Returns the Date for `n` days ago at start of day. */
export function daysAgo(n: number): Date {
  return startOfDay(new Date(Date.now() - n * DAY_MS));
}

/** Month label like "June 2026". */
export function monthLabel(d = new Date()): string {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
