/**
 * Mood metadata. The mood scale is core product data (it drives the seam color,
 * the trend chart, and insights), so its labels and ordering live in one place.
 */

import { moodColor, moodScale } from '../theme/colors';
import type { Mood } from '../data/types';

export interface MoodMeta {
  value: Mood;
  label: string;
  short: string;
  color: string;
}

export const MOODS: MoodMeta[] = [
  { value: 1, label: 'Rough', short: 'Rough', color: moodScale[1] },
  { value: 2, label: 'Low', short: 'Low', color: moodScale[2] },
  { value: 3, label: 'Okay', short: 'Okay', color: moodScale[3] },
  { value: 4, label: 'Good', short: 'Good', color: moodScale[4] },
  { value: 5, label: 'Great', short: 'Great', color: moodScale[5] },
];

export function moodMeta(mood: Mood | undefined | null): MoodMeta {
  return MOODS.find((m) => m.value === mood) ?? MOODS[2];
}

export { moodColor };
