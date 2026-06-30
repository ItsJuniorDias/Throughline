/**
 * MoodDot — a small filled circle in the mood's color. The atom the whole
 * throughline is built from. Optionally shows a thin ring (for "today" / empty).
 */

import React from 'react';
import { View } from 'react-native';
import { moodColor } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeProvider';
import type { Mood } from '../../data/types';

export interface MoodDotProps {
  mood?: Mood | null;
  size?: number;
  /** render as an outlined ring instead of a fill (e.g. a day with no entry) */
  hollow?: boolean;
}

export function MoodDot({ mood, size = 12, hollow = false }: MoodDotProps) {
  const t = useTheme();
  const color = moodColor(mood ?? undefined);

  if (hollow) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.5,
          borderColor: t.colors.borderStrong,
          backgroundColor: t.colors.bg,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
}
