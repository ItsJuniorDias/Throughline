/**
 * Divider — a hairline rule. Icon — a thin wrapper over @expo/vector-icons that
 * standardizes sizing and pulls color from the theme by default. (The native
 * tab bar uses SF Symbols directly; in-app we use a cross-platform icon set so
 * a single name works everywhere.)
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';

export function Divider({ style, inset = 0 }: { style?: ViewStyle; inset?: number }) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: t.colors.border,
          marginLeft: inset,
        },
        style,
      ]}
    />
  );
}

export type IconName = React.ComponentProps<typeof Feather>['name'];

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  /** semantic color key resolved from the theme */
  colorKey?: 'text' | 'textSecondary' | 'textMuted' | 'accent' | 'accentText' | 'danger';
}

export function Icon({ name, size = 20, color, colorKey = 'text' }: IconProps) {
  const t = useTheme();
  const resolved = color ?? (t.colors as Record<string, string>)[colorKey];
  return <Feather name={name} size={size} color={resolved} />;
}
