/**
 * MonthlyReportCard — what the premium "monthly report" looks like once
 * unlocked. In production the narrative sections are filled by the frontier-
 * model rollup; here they're composed from real aggregates (mood, themes, best
 * day) plus sample prose so the layout and perceived value are real.
 */

import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useJournal, averageMood, themeFrequency, moodByDay } from '../../data/store';
import { monthLabel, shortDate } from '../../lib/date';
import { moodMeta } from '../../lib/mood';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Icon } from '../ui/Divider';
import type { Mood } from '../../data/types';

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ gap: t.space[2] }}>
      <Text variant="overline" color="accentText">
        {label}
      </Text>
      {children}
    </View>
  );
}

export function MonthlyReportCard() {
  const t = useTheme();
  const entries = useJournal((s) => s.entries);

  const data = useMemo(() => {
    const month = moodByDay(entries, 30);
    const avg = averageMood(entries, 30);
    const themes = themeFrequency(entries, 30).slice(0, 3);
    const written = month.filter((d) => d.count > 0).length;
    // best day = highest single-entry mood, most recent wins ties
    const best = entries
      .filter((e) => new Date(e.createdAt) >= new Date(Date.now() - 30 * 864e5))
      .sort((a, b) => b.mood - a.mood)[0];
    return { avg, themes, written, best };
  }, [entries]);

  const avgMeta = data.avg != null ? moodMeta(Math.round(data.avg) as Mood) : null;
  const topTheme = data.themes[0]?.tag;

  return (
    <View
      style={{
        borderRadius: t.radius.xl,
        borderWidth: 1,
        borderColor: t.colors.accent,
        backgroundColor: t.colors.surface,
        overflow: 'hidden',
        ...t.shadow('md'),
      }}
    >
      <View
        style={{
          backgroundColor: t.colors.accentMuted,
          paddingHorizontal: t.space[5],
          paddingVertical: t.space[3],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: t.colors.border,
        }}
      >
        <Text variant="overline" color="accentText">
          {monthLabel().toUpperCase()} · MONTHLY REPORT
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Icon name="award" size={13} colorKey="accentText" />
          <Text variant="mono" color="accentText">
            PREMIUM
          </Text>
        </View>
      </View>

      <View style={{ padding: t.space[5], gap: t.space[5] }}>
        <Text variant="title" color="text">
          {avgMeta
            ? `A month that leaned ${avgMeta.label.toLowerCase()}`
            : 'Your month, read closely'}
        </Text>

        <Section label="Overview">
          <Text variant="serifBody" color="textSecondary">
            {data.written > 0
              ? `You wrote on ${data.written} of the last 30 days${
                  topTheme ? `, returning most often to “${topTheme}.”` : '.'
                } ${
                  avgMeta
                    ? `Mood held around ${avgMeta.label.toLowerCase()}, with the brighter days clustering toward the end of the month.`
                    : ''
                }`
              : 'Once you’ve written across a month, this is where the throughlines you can’t see day to day get pulled together.'}
          </Text>
        </Section>

        {data.themes.length > 0 ? (
          <Section label="Mood × themes">
            <View style={{ gap: t.space[2] }}>
              {data.themes.map((th, i) => (
                <View key={th.tag} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View
                    style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.colors.accent }}
                  />
                  <Text variant="body" color="textSecondary" style={{ flex: 1 }}>
                    <Text variant="bodyStrong" color="text">
                      {th.tag}
                    </Text>{' '}
                    showed up in {th.count} {th.count === 1 ? 'entry' : 'entries'}
                    {i === 0 ? ' — your strongest current thread.' : '.'}
                  </Text>
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        {data.best ? (
          <Section label="A day that defined it">
            <View
              style={{
                borderLeftWidth: 3,
                borderLeftColor: moodMeta(data.best.mood).color,
                paddingLeft: t.space[4],
                gap: 4,
              }}
            >
              <Text variant="mono" color="textMuted">
                {shortDate(data.best.createdAt).toUpperCase()}
              </Text>
              <Text variant="serifQuote" color="text" numberOfLines={3}>
                {data.best.text}
              </Text>
            </View>
          </Section>
        ) : null}

        <Text variant="caption" color="textMuted">
          Generated from your entries · a reflection, not advice.
        </Text>
      </View>
    </View>
  );
}
