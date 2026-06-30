/**
 * +not-found — fallback for unmatched routes. An empty screen is an invitation,
 * so we point back to Today rather than just apologizing.
 */

import React from 'react';
import { View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme/ThemeProvider';
import { Text } from '../src/components/ui/Text';

export default function NotFound() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View
        style={{
          flex: 1,
          backgroundColor: t.colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
          gap: t.space[4],
          paddingTop: insets.top,
          paddingHorizontal: t.gutter,
        }}
      >
        <Text variant="display" align="center">
          Lost the thread
        </Text>
        <Text variant="body" color="textSecondary" align="center">
          This page doesn’t exist.
        </Text>
        <Link href="/" style={{ marginTop: t.space[2] }}>
          <Text variant="label" color="accentText">
            Back to Today
          </Text>
        </Link>
      </View>
    </>
  );
}
