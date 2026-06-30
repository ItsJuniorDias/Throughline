/**
 * Today — the home tab. The day's invitation to reflect: a greeting, the week
 * strand (your last seven days at a glance), the daily prompt, a quick mood
 * check-in that opens the composer pre-filled, and a peek at your latest entry.
 *
 * ScreenScrollView is the first child so the native tab bar can drive the
 * liquid-glass scroll behaviors.
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useJournal, computeStreak, moodByDay } from '../../src/data/store';
import { greeting, monthLabel, shortDate } from '../../src/lib/date';
import { promptOfTheDay } from '../../src/constants/prompts';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ScreenScrollView } from '../../src/components/ui/ScreenScrollView';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Surface';
import { Icon } from '../../src/components/ui/Divider';
import {
  WeekStrand,
  PromptCard,
  StreakBadge,
  MoodPicker,
  SectionHeader,
  EntryCard,
} from '../../src/components/journal';
import type { Mood } from '../../src/data/types';

export default function TodayScreen() {
  const t = useTheme();
  const router = useRouter();
  const entries = useJournal((s) => s.entries);

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const week = useMemo(() => moodByDay(entries, 7), [entries]);
  const prompt = useMemo(() => promptOfTheDay(), []);
  const latest = entries[0];

  const openComposer = (params?: { promptId?: string; mood?: Mood }) =>
    router.push({
      pathname: '/entry/new',
      params: {
        ...(params?.promptId ? { promptId: params.promptId } : {}),
        ...(params?.mood ? { mood: String(params.mood) } : {}),
      },
    });

  return (
    <ScreenScrollView contentStyle={{ gap: t.space[6] }}>
      {/* header */}
      <View style={{ gap: t.space[4], marginTop: t.space[2] }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ flex: 1, gap: 4 }}>
            <Text variant="overline" color="accentText">
              {monthLabel().toUpperCase()}
            </Text>
            <Text variant="display">{greeting()}</Text>
          </View>
          <View style={{ paddingTop: 6 }}>
            <StreakBadge days={streak} />
          </View>
        </View>

        {/* week strand */}
        <Card padded={false} elevation="sm" style={{ paddingVertical: t.space[4], paddingHorizontal: t.space[2] }}>
          <View style={{ paddingHorizontal: t.space[3], marginBottom: t.space[1] }}>
            <Text variant="caption" color="textMuted">
              YOUR THROUGHLINE · LAST 7 DAYS
            </Text>
          </View>
          <WeekStrand days={week} />
        </Card>
      </View>

      {/* daily prompt */}
      <PromptCard prompt={prompt.text} onPress={() => openComposer({ promptId: prompt.id })} />

      {/* quick mood check-in */}
      <Card elevation="sm" style={{ gap: t.space[4] }}>
        <Text variant="subheading">A quick check-in</Text>
        <MoodPicker value={null} onChange={(m) => openComposer({ mood: m })} />
      </Card>

      {/* write CTA */}
      <Button
        label="Write an entry"
        size="lg"
        fullWidth
        onPress={() => openComposer()}
        leading={<Icon name="edit-3" size={18} colorKey="inkButtonText" color={t.colors.inkButtonText} />}
      />

      {/* latest entry peek */}
      {latest ? (
        <View style={{ gap: t.space[4] }}>
          <SectionHeader
            eyebrow="Most recent"
            title="Latest entry"
            trailing={
              <Button
                label="Timeline"
                variant="ghost"
                size="sm"
                onPress={() => router.push('/timeline')}
                trailing={<Icon name="arrow-right" size={15} colorKey="text" />}
              />
            }
          />
          <EntryCard
            entry={latest}
            isFirst
            isLast
            onPress={() => router.push(`/entry/${latest.id}`)}
          />
        </View>
      ) : null}

      <Text variant="caption" color="textMuted" align="center" style={{ marginTop: t.space[2] }}>
        {shortDate(new Date())}
      </Text>
    </ScreenScrollView>
  );
}
