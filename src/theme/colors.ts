/**
 * Semantic colors — Throughline
 * ---------------------------------------------------------------------------
 * Maps raw ramp values to roles. This is the contract every component reads.
 * Two schemes share one shape so `useTheme().colors.x` is always defined.
 *
 * Temperature concept: light is a cool porcelain "morning"; dark is a deep
 * ceramic-glaze "dusk". The gold seam is the one constant warmth across both.
 */

import { ceramic, gold, hue, moodRamp } from './tokens';

export interface ColorScheme {
  // surfaces, back to front
  bg: string; // app background
  surface: string; // cards, sheets
  surfaceMuted: string; // recessed wells, inputs
  elevated: string; // popovers, the highest layer

  // ink
  text: string; // primary text
  textSecondary: string; // supporting text
  textMuted: string; // captions, disabled
  textOnAccent: string; // text sitting on the gold fill

  // lines & strokes
  border: string; // hairline dividers
  borderStrong: string; // emphasized edges

  // the seam — brand accent
  accent: string; // primary gold (resting)
  accentBright: string; // luminous gold (active / on-dark glows)
  accentMuted: string; // gold wash for fills/backgrounds
  accentText: string; // gold used as a text color (AA-tuned per scheme)
  seamGradient: [string, string]; // start→end stops for the throughline stroke

  // a quiet inverted surface (used for the primary high-contrast button)
  inkButton: string;
  inkButtonText: string;

  // feedback
  success: string;
  warning: string;
  danger: string;
  info: string;
  successMuted: string; // soft success wash (e.g. "lifts you" rows)
  dangerMuted: string; // soft caution wash (e.g. "weighs on you" rows)

  // glass tint passed to expo-blur
  glassTint: 'light' | 'dark';
  glassOverlay: string; // semi-opaque scrim layered over blur for legibility
}

export const lightColors: ColorScheme = {
  bg: ceramic[100],
  surface: ceramic[50],
  surfaceMuted: ceramic[150],
  elevated: ceramic[0],

  text: ceramic[900],
  textSecondary: ceramic[600],
  textMuted: ceramic[500],
  textOnAccent: ceramic[950],

  border: ceramic[200],
  borderStrong: ceramic[300],

  accent: gold[600],
  accentBright: gold[500],
  accentMuted: gold[100],
  accentText: gold[700],
  seamGradient: [gold[400], gold[600]],

  inkButton: ceramic[900],
  inkButtonText: ceramic[50],

  success: hue.success,
  warning: hue.warning,
  danger: hue.danger,
  info: hue.info,
  successMuted: 'rgba(78, 140, 106, 0.14)',
  dangerMuted: 'rgba(180, 84, 62, 0.14)',

  glassTint: 'light',
  glassOverlay: 'rgba(247, 248, 247, 0.55)',
};

export const darkColors: ColorScheme = {
  bg: ceramic[900],
  surface: ceramic[850],
  surfaceMuted: ceramic[800],
  elevated: ceramic[800],

  text: '#ECEDEF',
  textSecondary: ceramic[400],
  textMuted: ceramic[500],
  textOnAccent: ceramic[950],

  border: ceramic[800],
  borderStrong: ceramic[700],

  accent: gold[400],
  accentBright: gold[300],
  accentMuted: 'rgba(205, 163, 74, 0.16)',
  accentText: gold[300],
  seamGradient: [gold[300], gold[500]],

  inkButton: ceramic[50],
  inkButtonText: ceramic[950],

  success: '#5FA37E',
  warning: '#D5934A',
  danger: '#CC6A53',
  info: '#7A92C0',
  successMuted: 'rgba(95, 163, 126, 0.18)',
  dangerMuted: 'rgba(204, 106, 83, 0.18)',

  glassTint: 'dark',
  glassOverlay: 'rgba(21, 23, 27, 0.45)',
};

/** Resolve a 1..5 mood to its hue. Falls back to the neutral middle. */
export function moodColor(mood: 1 | 2 | 3 | 4 | 5 | undefined | null): string {
  if (!mood) return moodRamp[3];
  return moodRamp[mood];
}

export const moodScale = moodRamp;
