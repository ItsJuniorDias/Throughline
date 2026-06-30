/**
 * ThemeProvider — Throughline
 * ---------------------------------------------------------------------------
 * Exposes the resolved `Theme` (light/dark) to the tree via context, following
 * the system appearance. Components consume it with `useTheme()`. We keep this
 * separate from expo-router's navigation <ThemeProvider> (set up in _layout)
 * which only colors the navigator chrome.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, lightTheme, darkTheme } from './theme';

const ThemeContext = createContext<Theme>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = useMemo(() => (scheme === 'dark' ? darkTheme : lightTheme), [scheme]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/**
 * Helper for building themed StyleSheets without repeating the hook wiring.
 *   const useStyles = makeStyles((t) => ({ box: { backgroundColor: t.colors.surface }}));
 *   ... const styles = useStyles();
 */
export function makeStyles<T extends Record<string, object>>(factory: (theme: Theme) => T) {
  return function useStyles(): T {
    const theme = useTheme();
    return useMemo(() => factory(theme), [theme]);
  };
}
