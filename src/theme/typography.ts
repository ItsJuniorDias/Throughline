/**
 * Typography presets — Throughline
 * ---------------------------------------------------------------------------
 * A closed set of named text styles. Components reference these by name via the
 * <Text variant="..."> primitive, so type stays consistent and the scale is the
 * single source of truth. Colors are applied separately (variants are color-
 * agnostic) so the same style works in light and dark.
 */

import { TextStyle } from 'react-native';
import { family, fontSize } from './tokens';

export type TypeVariant =
  | 'display' // big serif moments — the daily prompt, hero numbers
  | 'displaySmall'
  | 'title' // screen titles
  | 'heading' // section headings (serif)
  | 'subheading' // sans, smaller section labels
  | 'serifBody' // entry prose, the reading voice
  | 'serifQuote' // italic pull-quotes / prompts
  | 'body' // default UI body (sans)
  | 'bodyStrong'
  | 'callout' // slightly smaller body
  | 'label' // buttons, form labels
  | 'caption' // meta, helper text
  | 'overline' // eyebrows — uppercase, tracked
  | 'mono' // timestamps, data
  | 'monoLarge'; // streak counts, big figures

export const typography: Record<TypeVariant, TextStyle> = {
  display: {
    fontFamily: family.serif.semibold,
    fontSize: fontSize['4xl'],
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontFamily: family.serif.semibold,
    fontSize: fontSize['3xl'],
    lineHeight: 36,
    letterSpacing: -0.4,
  },
  title: {
    fontFamily: family.serif.semibold,
    fontSize: fontSize['2xl'],
    lineHeight: 31,
    letterSpacing: -0.3,
  },
  heading: {
    fontFamily: family.serif.medium,
    fontSize: fontSize.xl,
    lineHeight: 27,
    letterSpacing: -0.2,
  },
  subheading: {
    fontFamily: family.sans.semibold,
    fontSize: fontSize.md,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  serifBody: {
    fontFamily: family.serif.regular,
    fontSize: fontSize.lg,
    lineHeight: 29,
    letterSpacing: 0,
  },
  serifQuote: {
    fontFamily: family.serif.italic,
    fontSize: fontSize.xl,
    lineHeight: 30,
    letterSpacing: 0,
  },
  body: {
    fontFamily: family.sans.regular,
    fontSize: fontSize.base,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyStrong: {
    fontFamily: family.sans.semibold,
    fontSize: fontSize.base,
    lineHeight: 22,
    letterSpacing: 0,
  },
  callout: {
    fontFamily: family.sans.regular,
    fontSize: fontSize.sm,
    lineHeight: 19,
    letterSpacing: 0,
  },
  label: {
    fontFamily: family.sans.semibold,
    fontSize: fontSize.base,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  caption: {
    fontFamily: family.sans.medium,
    fontSize: fontSize.xs,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
  overline: {
    fontFamily: family.sans.semibold,
    fontSize: fontSize['2xs'],
    lineHeight: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  mono: {
    fontFamily: family.mono.regular,
    fontSize: fontSize.xs,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  monoLarge: {
    fontFamily: family.mono.medium,
    fontSize: fontSize['3xl'],
    lineHeight: 34,
    letterSpacing: -0.5,
  },
};
