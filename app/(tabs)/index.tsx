/**
 * Today — the home tab. The day's invitation to reflect: a greeting, the week
 * strand (your last seven days at a glance), the daily prompt, a quick mood
 * check-in that opens the composer pre-filled, a peek at today's read (premium)
 * or an invitation to unlock it (free), and your latest entry.
 *
 * ScreenScrollView is the first child so the native tab bar can drive the
 * liquid-glass scroll behaviors.
 */

import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useJournal, computeStreak, moodByDay } from '../../src/data/store';
import { usePremium } from '../../src/data/subscription';
import { useInsights } from '../../src/data/insights';
import { greeting, monthLabel, shortDate } from '../../src/lib/date';
import { promptOfTheDay } from '../../src/constants/prompts';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useT } from '../../src/i18n';
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

/** Premium: a peek at the day's read, linking into Insights. */
function TodayReadPeek({
  title,
  line,
  loading,
  onOpen,
}: {
  title?: string;
  line?: string;
  loading: boolean;
  onOpen: () => void;
}) {
  const t = useTheme();
  const tr = useT();
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        borderRadius: t.radius.xl,
        borderWidth: 1,
        borderColor: t.colors.accent,
        backgroundColor: t.colors.surface,
        padding: t.space[5],
        gap: t.space[3],
        ...t.shadow('sm'),
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="overline" color="accentText">
          {tr('today.readEyebrow')}
        </Text>
        <Icon name="arrow-right" size={16} colorKey="accentText" />
      </View>
      {loading && !title ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.space[3] }}>
          <ActivityIndicator color={t.colors.accent} />
          <Text variant="body" color="textMuted">
            {tr('today.readingDay')}
          </Text>
        </View>
      ) : (
        <>
          {title ? (
            <Text variant="title" color="text">
              {title}
            </Text>
          ) : null}
          {line ? (
            <Text variant="serifBody" color="textSecondary" numberOfLines={2}>
              {line}
            </Text>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

/** Free: an invitation to unlock the day's read. */
function TodayReadLocked({ onUnlock }: { onUnlock: () => void }) {
  const t = useTheme();
  const tr = useT();
  return (
    <Pressable
      onPress={onUnlock}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        borderRadius: t.radius.xl,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.surface,
        padding: t.space[5],
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.space[3],
        ...t.shadow('sm'),
      })}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: t.radius.md,
          backgroundColor: t.colors.accentMuted,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="lock" size={17} colorKey="accentText" />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyStrong" color="text">
          {tr('today.unlockTitle')}
        </Text>
        <Text variant="callout" color="textSecondary">
          {tr('today.unlockBody')}
        </Text>
      </View>
      <Icon name="chevron-right" size={18} colorKey="textMuted" />
    </Pressable>
  );
}

export default function TodayScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const entries = useJournal((s) => s.entries);
  const isPremium = usePremium();
  const daily = useInsights((s) => s.daily);
  const dailyStatus = useInsights((s) => s.dailyStatus);
  const generateDaily = useInsights((s) => s.generateDaily);

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const week = useMemo(() => moodByDay(entries, 7), [entries]);
  const promptId = useMemo(() => promptOfTheDay(), []);
  const latest = entries[0];

  // warm the day's read so it's ready when they open Insights
  useEffect(() => {
    if (isPremium) generateDaily(entries);
  }, [entries, isPremium, generateDaily]);

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
              {tr('today.weekStrand')}
            </Text>
          </View>
          <WeekStrand days={week} />
        </Card>
      </View>

      {/* daily prompt */}
      <PromptCard
        prompt={tr(`prompt.items.${promptId}`)}
        onPress={() => openComposer({ promptId })}
      />

      {/* quick mood check-in */}
      <Card elevation="sm" style={{ gap: t.space[4] }}>
        <Text variant="subheading">{tr('today.quickCheckIn')}</Text>
        <MoodPicker value={null} onChange={(m) => openComposer({ mood: m })} />
      </Card>

      {/* write CTA */}
      <Button
        label={tr('today.write')}
        size="lg"
        fullWidth
        onPress={() => openComposer()}
        leading={<Icon name="edit-3" size={18} color={t.colors.inkButtonText} />}
      />

      {/* today's read — premium peek or free invitation (only once there's material) */}
      {entries.length > 0 ? (
        isPremium ? (
          <TodayReadPeek
            title={daily?.data.title}
            line={daily?.data.read}
            loading={dailyStatus === 'loading'}
            onOpen={() => router.push('/insights')}
          />
        ) : (
          <TodayReadLocked onUnlock={() => router.push('/paywall')} />
        )
      ) : null}

      {/* latest entry peek */}
      {latest ? (
        <View style={{ gap: t.space[4] }}>
          <SectionHeader
eyebrow={tr('today.recentEyebrow')}
            title={tr('today.recentTitle')}
            trailing={
              <Button
                label={tr('tabs.timeline')}
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
