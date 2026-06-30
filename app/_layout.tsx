/**
 * Root layout.
 *
 * Responsibilities:
 *   - Load the three font families (and hold the splash until they're ready).
 *   - Wire expo-router's <ThemeProvider> with our ceramic-matched nav themes so
 *     there's no white flash on tab switches or appearance changes (this is the
 *     documented fix for liquid glass flicker on iOS 26).
 *   - Provide our own theme context, gesture root, and safe-area context.
 *   - Define the navigation Stack: the tab group plus the compose modal and the
 *     entry detail route.
 *   - Seed demo data after persistence has hydrated (so stored entries win).
 */

import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Newsreader_400Regular,
  Newsreader_500Medium,
  Newsreader_600SemiBold,
  Newsreader_400Regular_Italic,
} from '@expo-google-fonts/newsreader';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from '@expo-google-fonts/ibm-plex-mono';

import { ThemeProvider as AppThemeProvider } from '../src/theme/ThemeProvider';
import { navLightTheme, navDarkTheme } from '../src/theme/theme';
import { useJournal } from '../src/data/store';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const scheme = useColorScheme();

  const [loaded, error] = useFonts({
    Newsreader_400Regular,
    Newsreader_500Medium,
    Newsreader_600SemiBold,
    Newsreader_400Regular_Italic,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  // Seed demo data only after persisted state has hydrated, so real entries win.
  useEffect(() => {
    const seed = () => useJournal.getState().seedIfEmpty();
    if (useJournal.persist.hasHydrated()) seed();
    const unsub = useJournal.persist.onFinishHydration(seed);
    return unsub;
  }, []);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={scheme === 'dark' ? navDarkTheme : navLightTheme}>
          <AppThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="entry/new"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
              <Stack.Screen name="entry/[id]" options={{ presentation: 'card' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </AppThemeProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
