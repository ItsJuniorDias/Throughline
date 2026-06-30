/**
 * Theme assembly — Throughline
 * ---------------------------------------------------------------------------
 * Bundles the semantic colors with the shared tokens and a scheme-aware shadow
 * helper into a single `Theme` object, and derives the navigation themes that
 * expo-router needs (so the navigator background matches and there's no flash
 * when switching tabs / toggling appearance).
 */

import { Platform, ViewStyle } from 'react-native';
import { DefaultTheme, DarkTheme as NavDarkTheme } from 'expo-router';
import { ColorScheme, lightColors, darkColors } from './colors';
import { duration, easing, fontSize, family, radius, space } from './tokens';
import { typography } from './typography';

export type Elevation = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/** Soft, cool-tinted shadows. Returns a style fragment incl. Android elevation. */
function makeShadow(scheme: 'light' | 'dark') {
  // Dark surfaces get near-invisible shadows; we lean on borders there instead.
  const color = scheme === 'dark' ? '#000000' : '#1B2A33';
  const o = (light: number, dark: number) => (scheme === 'dark' ? dark : light);

  const presets: Record<Elevation, ViewStyle> = {
    none: {},
    sm: {
      shadowColor: color,
      shadowOpacity: o(0.06, 0.4),
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 1,
    },
    md: {
      shadowColor: color,
      shadowOpacity: o(0.09, 0.5),
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    lg: {
      shadowColor: color,
      shadowOpacity: o(0.12, 0.55),
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 12 },
      elevation: 10,
    },
    xl: {
      shadowColor: color,
      shadowOpacity: o(0.16, 0.6),
      shadowRadius: 44,
      shadowOffset: { width: 0, height: 20 },
      elevation: 18,
    },
  };

  return (level: Elevation): ViewStyle => presets[level];
}

export interface Theme {
  scheme: 'light' | 'dark';
  colors: ColorScheme;
  space: typeof space;
  radius: typeof radius;
  fontSize: typeof fontSize;
  family: typeof family;
  typography: typeof typography;
  duration: typeof duration;
  easing: typeof easing;
  shadow: (level: Elevation) => ViewStyle;
  // a comfortable default screen gutter
  gutter: number;
}

export const lightTheme: Theme = {
  scheme: 'light',
  colors: lightColors,
  space,
  radius,
  fontSize,
  family,
  typography,
  duration,
  easing,
  shadow: makeShadow('light'),
  gutter: space[5],
};

export const darkTheme: Theme = {
  scheme: 'dark',
  colors: darkColors,
  space,
  radius,
  fontSize,
  family,
  typography,
  duration,
  easing,
  shadow: makeShadow('dark'),
  gutter: space[5],
};

/**
 * Navigation themes for expo-router's <ThemeProvider>. Overriding `background`
 * + `card` with our ceramic values is what removes the white flash on tab
 * switches and during light/dark transitions on iOS 26 liquid glass.
 */
export const navLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.accent,
    background: lightColors.bg,
    card: lightColors.surface,
    text: lightColors.text,
    border: lightColors.border,
    notification: lightColors.danger,
  },
};

export const navDarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: darkColors.accent,
    background: darkColors.bg,
    card: darkColors.surface,
    text: darkColors.text,
    border: darkColors.border,
    notification: darkColors.danger,
  },
};

export { Platform };
