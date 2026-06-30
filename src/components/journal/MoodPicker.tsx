/**
 * MoodPicker — the 5-point mood selector. A row of mood-colored nodes; the
 * selected one lifts (Animated scale) and gains a ring, and its label resolves
 * below. This is the primary mood input on the compose screen and the quick
 * check-in on Today.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { haptics } from '../../lib/haptics';
import { MOODS } from '../../lib/mood';
import { useT } from '../../i18n';
import { Text } from '../ui/Text';
import type { Mood } from '../../data/types';

export interface MoodPickerProps {
  value: Mood | null;
  onChange: (m: Mood) => void;
  /** compact hides the resolved label line */
  compact?: boolean;
}

function MoodNode({
  selected,
  color,
  onPress,
  accessibilityLabel,
}: {
  selected: boolean;
  color: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const t = useTheme();
  const scale = useRef(new Animated.Value(selected ? 1 : 0.82)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1 : 0.82,
      useNativeDriver: true,
      speed: 30,
      bounciness: 10,
    }).start();
  }, [selected, scale]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      onPress={onPress}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: color,
          opacity: selected ? 1 : 0.55,
          borderWidth: selected ? 3 : 0,
          borderColor: t.colors.bg,
          ...(selected ? t.shadow('sm') : null),
        }}
      />
      {selected ? (
        <View
          style={{
            position: 'absolute',
            top: -3,
            left: -3,
            width: 46,
            height: 46,
            borderRadius: 23,
            borderWidth: 1.5,
            borderColor: color,
          }}
        />
      ) : null}
    </Pressable>
  );
}

export function MoodPicker({ value, onChange, compact = false }: MoodPickerProps) {
  const tr = useT();
  const selected = MOODS.find((m) => m.value === value);

  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {MOODS.map((m) => (
          <MoodNode
            key={m.value}
            selected={value === m.value}
            color={m.color}
            accessibilityLabel={tr(`mood.${m.key}`)}
            onPress={() => {
              haptics.select();
              onChange(m.value);
            }}
          />
        ))}
      </View>
      {!compact ? (
        <View style={{ height: 22, alignItems: 'center', justifyContent: 'center' }}>
          {selected ? (
            <Text variant="bodyStrong" tint={selected.color}>
              {tr(`mood.${selected.key}`)}
            </Text>
          ) : (
            <Text variant="callout" color="textMuted">
              {tr('mood.question')}
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}
