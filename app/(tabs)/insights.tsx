/**
 * Insights — the longitudinal payoff.
 *
 * Free: headline stats, a 30-day mood trend, recurring themes, and one weekly
 * observation (OpenRouter, cached).
 *
 * Premium: the day's read (generated from a single entry, so it's there the
 * moment you subscribe), pattern analytics (which themes lift vs. weigh on your
 * mood), and all-time analytics across your whole history.
 */

import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  useJournal,
  averageMood,
  moodByDay,
  themeFrequency,
  computeStreak,
  computeLongestStreak,
  daysWritten,
  spanDays,
  moodCorrelations,
} from '../../src/data/store';
import { usePremium } from '../../src/data/subscription';
import { useInsights, WEEKLY_MIN, DAILY_MIN } from '../../src/data/insights';
import { monthLabel, daysBetween, dayKey, relativeDay } from '../../src/lib/date';
import { moodMeta, moodLabel } from '../../src/lib/mood';
import { useT } from '../../src/i18n';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ScreenScrollView } from '../../src/components/ui/ScreenScrollView';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Surface';
import {
  SectionHeader,
  MoodTrendChart,
  InsightCard,
  DailyReportCard,
  CorrelationsCard,
} from '../../src/components/journal';
import type { Mood } from '../../src/data/types';

function StatTile({ value, label, tint }: { value: string; label: string; tint?: string }) {
  const t = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: t.colors.surface,
        borderRadius: t.radius.lg,
        borderWidth: 1,
        borderColor: t.colors.border,
        paddingVertical: t.space[4],
        paddingHorizontal: t.space[4],
        gap: 4,
      }}
    >
      <Text variant="monoLarge" tint={tint ?? t.colors.text}>
        {value}
      </Text>
      <Text variant="caption" color="textMuted">
        {label}
      </Text>
    </View>
  );
}

function ThemeBars({ entries }: { entries: ReturnType<typeof themeFrequency> }) {
  const t = useTheme();
  const max = entries[0]?.count ?? 1;
  return (
    <View style={{ gap: t.space[3] }}>
      {entries.map((row) => (
        <View key={row.tag} style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="body" color="textSecondary">
              {row.tag}
            </Text>
            <Text variant="mono" color="textMuted">
              {row.count}
            </Text>
          </View>
          <View
            style={{
              height: 6,
              borderRadius: 3,
              backgroundColor: t.colors.surfaceMuted,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${Math.max(8, (row.count / max) * 100)}%`,
                height: '100%',
                borderRadius: 3,
                backgroundColor: t.colors.accent,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

/** The free weekly observation — generated, with loading / error / empty states. */
function WeeklyRead({
  status,
  error,
  text,
  enough,
  onRetry,
}: {
  status: 'idle' | 'loading' | 'error';
  error?: string | null;
  text?: string;
  enough: boolean;
  onRetry: () => void;
}) {
  const t = useTheme();
  const tr = useT();
  const showSpinner = !text && (status === 'loading' || (enough && status !== 'error'));

  return (
    <View
      style={{
        borderRadius: t.radius.xl,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.surface,
        padding: t.space[5],
        gap: t.space[3],
        ...t.shadow('sm'),
      }}
    >
      <Text variant="overline" color="accentText">
        {tr('insights.weeklyEyebrow')}
      </Text>

      {!enough ? (
        <Text variant="serifBody" color="textSecondary">
          {tr('insights.weeklyEmpty')}
        </Text>
      ) : showSpinner ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.space[3] }}>
          <ActivityIndicator color={t.colors.accent} />
          <Text variant="body" color="textMuted">
            {tr('insights.weeklyReading')}
          </Text>
        </View>
      ) : text ? (
        <>
          <Text variant="serifBody" color="text">
            {text}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button label={tr('common.refresh')} variant="ghost" size="sm" onPress={onRetry} />
          </View>
        </>
      ) : status === 'error' ? (
        <View style={{ gap: t.space[2] }}>
          <Text variant="body" color="textSecondary">
            {tr('insights.weeklyError')}
          </Text>
          {error ? (
            <Text variant="caption" color="textMuted">
              {error}
            </Text>
          ) : null}
          <Button label={tr('common.tryAgain')} variant="secondary" size="sm" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

/** Premium all-time analytics: lifetime tiles + a trend across your whole history. */
function LifetimeCard({
  total,
  days,
  longest,
  avg,
  trend,
}: {
  total: number;
  days: number;
  longest: number;
  avg: number | null;
  trend: ReturnType<typeof moodByDay>;
}) {
  const t = useTheme();
  const tr = useT();
  const avgMeta = avg != null ? moodMeta(Math.round(avg) as Mood) : null;
  return (
    <Card elevation="sm" style={{ gap: t.space[4] }}>
      <SectionHeader eyebrow={tr('insights.lifetimeEyebrow')} title={tr('insights.lifetimeTitle')} />
      <View style={{ flexDirection: 'row', gap: t.space[3] }}>
        <StatTile value={`${total}`} label={tr('insights.lifetimeEntries')} />
        <StatTile value={`${days}`} label={tr('insights.lifetimeDays')} />
        <StatTile value={`${longest}`} label={tr('insights.lifetimeLongest')} tint={t.colors.accentText} />
      </View>
      <View style={{ gap: t.space[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Text variant="overline" color="accentText">
            {tr('insights.lifetimeMood')}
          </Text>
          {avgMeta ? (
            <Text variant="mono" tint={avgMeta.color}>
              {tr('insights.lifetimeAvg', {
                value: avg!.toFixed(1),
                mood: tr(`mood.${avgMeta.key}`).toLowerCase(),
              })}
            </Text>
          ) : null}
        </View>
        <MoodTrendChart data={trend} />
      </View>
    </Card>
  );
}

export default function InsightsScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const isPremium = usePremium();
  const entries = useJournal((s) => s.entries);

  const {
    weekly,
    weeklyStatus,
    weeklyError,
    generateWeekly,
    daily,
    dailyStatus,
    dailyError,
    generateDaily,
  } = useInsights();

  // 30-day (free) analytics
  const month = useMemo(() => moodByDay(entries, 30), [entries]);
  const avg30 = useMemo(() => averageMood(entries, 30), [entries]);
  const streak = useMemo(() => computeStreak(entries), [entries]);
  const themes = useMemo(() => themeFrequency(entries, 30).slice(0, 5), [entries]);
  const writtenDays30 = useMemo(() => month.filter((d) => d.count > 0).length, [month]);
  const avgMeta = avg30 != null ? moodMeta(Math.round(avg30) as Mood) : null;

  const weekCount = useMemo(
    () => entries.filter((e) => daysBetween(new Date(), new Date(e.createdAt)) <= 7).length,
    [entries],
  );

  // daily read target (the most recent active day) — drives the card's strip
  const dailyMeta = useMemo(() => {
    if (entries.length === 0) return null;
    const newest = entries[0];
    const key = dayKey(newest.createdAt);
    const dayEntries = entries.filter((e) => dayKey(e.createdAt) === key);
    const avg = dayEntries.reduce((a, e) => a + e.mood, 0) / dayEntries.length;
    return {
      count: dayEntries.length,
      label: relativeDay(newest.createdAt),
      avgLabel: moodLabel(Math.round(avg) as Mood),
      avgColor: moodMeta(Math.round(avg) as Mood).color,
    };
    // `tr` in deps so the localized label/avgLabel refresh on a language switch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, tr]);

  // premium pattern analytics (local, instant)
  const { lifts, drains } = useMemo(() => {
    const corr = moodCorrelations(entries, { minCount: 2 });
    return {
      lifts: corr.filter((c) => c.delta >= 0.1).slice(0, 4),
      drains: corr.filter((c) => c.delta <= -0.1).slice(0, 4),
    };
  }, [entries]);

  // premium all-time analytics (local, instant)
  const lifetime = useMemo(() => {
    const span = Math.min(180, Math.max(1, spanDays(entries)));
    return {
      total: entries.length,
      days: daysWritten(entries),
      longest: computeLongestStreak(entries),
      avg: averageMood(entries, 100000),
      trend: moodByDay(entries, span),
    };
  }, [entries]);

  // generate (no-ops when cached & unchanged, or below the entry minimum)
  useEffect(() => {
    generateWeekly(entries);
  }, [entries, generateWeekly]);

  useEffect(() => {
    if (isPremium) generateDaily(entries);
  }, [entries, isPremium, generateDaily]);

  return (
    <ScreenScrollView contentStyle={{ gap: t.space[6] }}>
      <View style={{ marginTop: t.space[2] }}>
        <SectionHeader eyebrow={monthLabel().toUpperCase()} title={tr('insights.title')} />
      </View>

      {/* premium hero: the day's read (or the locked teaser for free) */}
      {isPremium ? (
        <DailyReportCard
          report={daily?.data ?? null}
          status={dailyStatus}
          error={dailyError}
          onRetry={() => generateDaily(entries, true)}
          dayLabel={daily?.dayLabel ?? dailyMeta?.label ?? tr('date.today')}
          entriesToday={dailyMeta?.count ?? 0}
          avgLabel={dailyMeta?.avgLabel}
          avgColor={dailyMeta?.avgColor}
          enoughData={entries.length >= DAILY_MIN}
        />
      ) : null}

      {/* stat tiles (30d) */}
      <View style={{ flexDirection: 'row', gap: t.space[3] }}>
        <StatTile
          value={avg30 != null ? avg30.toFixed(1) : '—'}
          label={
            avgMeta
              ? tr('insights.avgMoodWith', { mood: tr(`mood.${avgMeta.key}`) })
              : tr('insights.avgMood30')
          }
          tint={avgMeta?.color}
        />
        <StatTile value={`${writtenDays30}`} label={tr('insights.daysWritten30')} />
        <StatTile value={`${streak}`} label={tr('insights.dayStreak')} tint={t.colors.accentText} />
      </View>

      {/* mood trend (30d) */}
      <Card elevation="sm" style={{ gap: t.space[4] }}>
        <SectionHeader eyebrow={tr('insights.trendEyebrow')} title={tr('insights.trendTitle')} />
        <MoodTrendChart data={month} />
      </Card>

      {/* recurring themes (30d) */}
      {themes.length > 0 ? (
        <Card elevation="sm" style={{ gap: t.space[4] }}>
          <SectionHeader eyebrow={tr('insights.themesEyebrow')} title={tr('insights.themesTitle')} />
          <ThemeBars entries={themes} />
        </Card>
      ) : null}

      {/* premium analytics */}
      {isPremium ? (
        <>
          <CorrelationsCard lifts={lifts} drains={drains} />
          {entries.length > 0 ? (
            <LifetimeCard
              total={lifetime.total}
              days={lifetime.days}
              longest={lifetime.longest}
              avg={lifetime.avg}
              trend={lifetime.trend}
            />
          ) : null}
        </>
      ) : null}

      {/* the free weekly read */}
      <WeeklyRead
        status={weeklyStatus}
        error={weeklyError}
        text={weekly?.text}
        enough={weekCount >= WEEKLY_MIN}
        onRetry={() => generateWeekly(entries, true)}
      />

      {/* upsell for free users */}
      {!isPremium ? (
        <InsightCard
          locked
          eyebrow={tr('upsell.eyebrow')}
          title={tr('upsell.title')}
          body={tr('upsell.body')}
          bullets={[
            tr('upsell.bullet1'),
            tr('upsell.bullet2'),
            tr('upsell.bullet3'),
            tr('upsell.bullet4'),
          ]}
          ctaLabel={tr('upsell.cta')}
          onUnlock={() => router.push('/paywall')}
        />
      ) : null}

      <Text variant="caption" color="textMuted" align="center">
        {tr('insights.disclaimer')}
      </Text>
    </ScreenScrollView>
  );
}
