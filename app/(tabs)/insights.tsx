/**
 * Insights — the longitudinal payoff. Everything here is computed from the
 * accumulated entries (the data that only exists because you kept writing):
 * a 30-day mood trend, headline stats, recurring themes, one free observation,
 * and the locked monthly report — the paid hero, surfaced as a teaser.
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useJournal, averageMood, moodByDay, themeFrequency, computeStreak } from '../../src/data/store';
import { usePremium } from '../../src/data/subscription';
import { monthLabel } from '../../src/lib/date';
import { moodMeta } from '../../src/lib/mood';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ScreenScrollView } from '../../src/components/ui/ScreenScrollView';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Surface';
import {
  SectionHeader,
  MoodTrendChart,
  InsightCard,
  MonthlyReportCard,
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

export default function InsightsScreen() {
  const t = useTheme();
  const router = useRouter();
  const isPremium = usePremium();
  const entries = useJournal((s) => s.entries);

  const month = useMemo(() => moodByDay(entries, 30), [entries]);
  const avg30 = useMemo(() => averageMood(entries, 30), [entries]);
  const streak = useMemo(() => computeStreak(entries), [entries]);
  const themes = useMemo(() => themeFrequency(entries, 30).slice(0, 5), [entries]);
  const writtenDays = useMemo(() => month.filter((d) => d.count > 0).length, [month]);

  const avgMeta = avg30 != null ? moodMeta(Math.round(avg30) as Mood) : null;
  const topTheme = themes[0]?.tag;

  return (
    <ScreenScrollView contentStyle={{ gap: t.space[6] }}>
      <View style={{ marginTop: t.space[2] }}>
        <SectionHeader eyebrow={monthLabel().toUpperCase()} title="Insights" />
      </View>

      {/* stat tiles */}
      <View style={{ flexDirection: 'row', gap: t.space[3] }}>
        <StatTile
          value={avg30 != null ? avg30.toFixed(1) : '—'}
          label={avgMeta ? `avg mood · ${avgMeta.label}` : 'avg mood · 30d'}
          tint={avgMeta?.color}
        />
        <StatTile value={`${writtenDays}`} label="days written · 30d" />
        <StatTile value={`${streak}`} label="day streak" tint={t.colors.accentText} />
      </View>

      {/* mood trend */}
      <Card elevation="sm" style={{ gap: t.space[4] }}>
        <SectionHeader eyebrow="Last 30 days" title="Mood over time" />
        <MoodTrendChart data={month} />
      </Card>

      {/* themes */}
      {themes.length > 0 ? (
        <Card elevation="sm" style={{ gap: t.space[4] }}>
          <SectionHeader eyebrow="What you write about" title="Recurring themes" />
          <ThemeBars entries={themes} />
        </Card>
      ) : null}

      {/* one free observation */}
      {topTheme && avgMeta ? (
        <InsightCard
          eyebrow="This week’s read"
          title={`“${topTheme}” keeps surfacing`}
          body={`It’s your most frequent theme lately, alongside an average mood of ${avgMeta.label.toLowerCase()}. Worth noticing what “${topTheme}” tends to bring with it.`}
        />
      ) : null}

      {/* monthly report — gated on Premium */}
      {isPremium ? (
        <MonthlyReportCard />
      ) : (
        <InsightCard
          locked
          eyebrow="Monthly report"
          title={`Your ${monthLabel().split(' ')[0]}, read closely`}
          body="A deep, longitudinal read of the month — patterns across mood and themes, what shifted, and the throughlines you can’t see day to day."
          bullets={[
            'Mood × theme correlations across the whole month',
            'What changed since last month',
            'The decisions and moments that defined it',
          ]}
          ctaLabel="Unlock the monthly report"
          onUnlock={() => router.push('/paywall')}
        />
      )}

      <Text variant="caption" color="textMuted" align="center">
        Observations are reflections, not advice.
      </Text>
    </ScreenScrollView>
  );
}
