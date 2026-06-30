/**
 * +not-found — fallback for unmatched routes. An empty screen is an invitation,
 * so we point back to Today rather than just apologizing.
 */

import React from 'react';
import { View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme/ThemeProvider';
import { useT } from '../src/i18n';
import { Text } from '../src/components/ui/Text';

export default function NotFound() {
  const t = useTheme();
  const tr = useT();
  const insets = useSafeAreaInsets();
  return (
    <>
      <Stack.Screen options={{ title: tr('notFound.stackTitle') }} />
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
          {tr('notFound.title')}
        </Text>
        <Text variant="body" color="textSecondary" align="center">
          {tr('notFound.body')}
        </Text>
        <Link href="/" style={{ marginTop: t.space[2] }}>
          <Text variant="label" color="accentText">
            {tr('notFound.back')}
          </Text>
        </Link>
      </View>
    </>
  );
}
