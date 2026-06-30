/**
 * StreakBadge — the current streak, set in mono (time/data role). Small, quiet,
 * gold flame mark. Streaks reward the habit loop without shouting.
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useT } from '../../i18n';
import { Text } from '../ui/Text';
import { Icon } from '../ui/Divider';

export function StreakBadge({ days }: { days: number }) {
  const t = useTheme();
  const tr = useT();
  if (days <= 0) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: t.radius.full,
          borderWidth: 1,
          borderColor: t.colors.border,
        }}
      >
        <Icon name="circle" size={12} colorKey="textMuted" />
        <Text variant="mono" color="textMuted">
          {tr('streak.startToday')}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: t.radius.full,
        backgroundColor: t.colors.accentMuted,
        borderWidth: 1,
        borderColor: t.colors.accent,
      }}
    >
      <Icon name="zap" size={13} colorKey="accentText" />
      <Text variant="mono" color="accentText">
        {tr('streak.days', { count: days })}
      </Text>
    </View>
  );
}
