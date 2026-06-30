/**
 * Design tokens — Throughline
 * ---------------------------------------------------------------------------
 * The raw, theme-agnostic primitives. Nothing in here knows about light/dark.
 * Semantic meaning is assigned in `colors.ts`. Components should almost never
 * import from this file directly — they read resolved values from `useTheme()`.
 *
 * Concept: "Kintsugi / Dusk Index".
 *   - Neutrals are a cool ceramic glaze (NOT cream), so the app reads calm and
 *     a little nocturnal rather than warm-and-papery.
 *   - The single precious accent is a gold seam — the throughline of your life,
 *     the golden thread running through accumulated days. Used sparingly so it
 *     stays precious.
 *   - Mood is a perceptual arc from a deep dusty indigo (rough) up to that same
 *     gold (great): good days literally trend toward the thread.
 */

// ─── Color ramps ───────────────────────────────────────────────────────────

/** Cool ceramic neutral. The ground everything sits on. */
export const ceramic = {
  0: '#FFFFFF',
  50: '#F7F8F7',
  100: '#ECEDEB',
  150: '#E2E4E2',
  200: '#D6D9D8',
  300: '#BCC1C1',
  400: '#99A0A1',
  500: '#787F81',
  600: '#5A6163',
  700: '#3E4548',
  800: '#262B2E',
  850: '#1D2024',
  900: '#15171B',
  950: '#0E1013',
} as const;

/** The kintsugi gold seam — the brand accent. */
export const gold = {
  50: '#FBF4E2',
  100: '#F4E6C2',
  200: '#E9D198',
  300: '#DCB968',
  400: '#CDA34A',
  500: '#B98A2A',
  600: '#9A7324',
  700: '#7C5C20',
  800: '#5C441B',
  900: '#3E2E15',
} as const;

/**
 * Mood spectrum — five perceptual stops, cool → warm, resolving in gold.
 * Indexed 1..5 to match the Mood type.
 */
export const moodRamp = {
  1: '#5E6F92', // rough  — dusty indigo
  2: '#789AA6', // low    — slate teal
  3: '#A9A89A', // okay   — neutral taupe
  4: '#D0A95C', // good   — warm amber
  5: '#C58A2E', // great  — deep gold
} as const;

/** Muted semantic hues, tuned to sit quietly next to the palette. */
export const hue = {
  success: '#4E8C6A',
  warning: '#C97E3A',
  danger: '#B4543E',
  info: '#5E78A6',
} as const;

// ─── Spacing ────────────────────────────────────────────────────────────────
// 4pt base grid. Keys are step counts, values are px.

export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 56,
  11: 64,
  12: 80,
  13: 96,
} as const;

// ─── Radii ──────────────────────────────────────────────────────────────────

export const radius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 32,
  full: 999,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
// Three roles, each earning its place:
//   serif  (Newsreader)    — the voice. Prompts, entry prose, insight headlines.
//   sans   (Manrope)       — the interface. Buttons, labels, navigation, meta.
//   mono   (IBM Plex Mono) — time & data. Timestamps, streaks, the index.
//
// Family values are the exact keys loaded via @expo-google-fonts in app/_layout.
// When using a per-weight font file you set `fontFamily` and never `fontWeight`.

export const family = {
  serif: {
    regular: 'Newsreader_400Regular',
    medium: 'Newsreader_500Medium',
    semibold: 'Newsreader_600SemiBold',
    italic: 'Newsreader_400Regular_Italic',
  },
  sans: {
    regular: 'Manrope_400Regular',
    medium: 'Manrope_500Medium',
    semibold: 'Manrope_600SemiBold',
    bold: 'Manrope_700Bold',
  },
  mono: {
    regular: 'IBMPlexMono_400Regular',
    medium: 'IBMPlexMono_500Medium',
  },
} as const;

export const fontSize = {
  '2xs': 11,
  xs: 12,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 21,
  '2xl': 25,
  '3xl': 30,
  '4xl': 36,
  '5xl': 44,
} as const;

// ─── Motion ─────────────────────────────────────────────────────────────────

export const duration = {
  fast: 140,
  base: 220,
  slow: 360,
  slower: 560,
} as const;

/** Cubic-bezier control points, for Easing.bezier(...). */
export const easing = {
  standard: [0.2, 0, 0, 1] as const,
  decelerate: [0, 0, 0, 1] as const,
  accelerate: [0.3, 0, 1, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const, // gentle overshoot
} as const;

// ─── Hairline ───────────────────────────────────────────────────────────────

export const hairlineWidth = 1;

export type Ceramic = typeof ceramic;
export type Gold = typeof gold;
