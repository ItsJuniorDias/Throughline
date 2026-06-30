/**
 * Chip — a small tag/filter pill. Used for entry tags and theme filters. The
 * selected state uses the gold accent wash; resting is a quiet ceramic well.
 */

import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { haptics } from '../../lib/haptics';
import { Text } from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** a small leading dot, e.g. a mood color */
  dotColor?: string;
  style?: ViewStyle;
}

export function Chip({ label, selected = false, onPress, dotColor, style }: ChipProps) {
  const t = useTheme();
  const interactive = !!onPress;

  const body = (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 7,
          borderRadius: t.radius.full,
          borderWidth: 1,
          borderColor: selected ? t.colors.accent : t.colors.border,
          backgroundColor: selected ? t.colors.accentMuted : t.colors.surfaceMuted,
        },
        style,
      ]}
    >
      {dotColor ? (
        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: dotColor }} />
      ) : null}
      <Text variant="caption" color={selected ? 'accentText' : 'textSecondary'}>
        {label}
      </Text>
    </View>
  );

  if (!interactive) return body;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => {
        haptics.select();
        onPress?.();
      }}
    >
      {body}
    </Pressable>
  );
}
