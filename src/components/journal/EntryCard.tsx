/**
 * EntryCard — one entry as it appears in the timeline. The throughline gutter
 * runs down the left, threading entries together; the content column carries the
 * date (mono), the prose (serif), and the tags. Tapping opens the full entry.
 */

import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { haptics } from '../../lib/haptics';
import { relativeDay, clockTime } from '../../lib/date';
import { moodMeta } from '../../lib/mood';
import { Text } from '../ui/Text';
import { Chip } from '../ui/Chip';
import { ThroughlineGutter } from './Throughline';
import type { Entry } from '../../data/types';

export interface EntryCardProps {
  entry: Entry;
  isFirst?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  /** show full text instead of truncating (used on the detail screen) */
  expanded?: boolean;
}

export function EntryCard({ entry, isFirst, isLast, onPress, expanded }: EntryCardProps) {
  const t = useTheme();
  const mood = moodMeta(entry.mood);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={
        onPress
          ? () => {
              haptics.select();
              onPress();
            }
          : undefined
      }
      style={({ pressed }) => ({ opacity: pressed && onPress ? 0.85 : 1, flexDirection: 'row' })}
    >
      <ThroughlineGutter mood={entry.mood} connectTop={!isFirst} connectBottom={!isLast} />

      <View style={{ flex: 1, paddingBottom: isLast ? 0 : t.space[6], paddingLeft: t.space[3] }}>
        {/* date + mood row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 22,
            gap: 8,
          }}
        >
          <Text variant="mono" color="textSecondary">
            {relativeDay(entry.createdAt).toUpperCase()} · {clockTime(entry.createdAt)}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View
              style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: mood.color }}
            />
            <Text variant="caption" color="textMuted">
              {mood.label}
            </Text>
          </View>
        </View>

        {/* prose */}
        <Text
          variant="serifBody"
          color="text"
          numberOfLines={expanded ? undefined : 4}
          style={{ marginTop: t.space[2] }}
        >
          {entry.text}
        </Text>

        {/* tags */}
        {entry.tags.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: t.space[3] }}>
            {entry.tags.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
