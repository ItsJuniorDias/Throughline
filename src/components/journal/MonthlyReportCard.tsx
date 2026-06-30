/**
 * MonthlyReportCard — the premium monthly report, now filled by the OpenRouter
 * rollup. It's a presentational card: the screen owns generation/caching and
 * passes the result + status in. A small locally-computed stats strip (days
 * written, avg mood) grounds the AI narrative in real numbers.
 */

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { monthLabel } from '../../lib/date';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Divider';
import type { MonthlyReport } from '../../data/insights';

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

export interface MonthlyReportCardProps {
  report: MonthlyReport | null;
  status: 'idle' | 'loading' | 'error';
  error?: string | null;
  onRetry: () => void;
  written: number;
  avgLabel?: string;
  avgColor?: string;
  enoughData: boolean;
}

export function MonthlyReportCard({
  report,
  status,
  error,
  onRetry,
  written,
  avgLabel,
  avgColor,
  enoughData,
}: MonthlyReportCardProps) {
  const t = useTheme();
  // spinner only while there's nothing to show yet (keep an existing report
  // visible during a forced regenerate)
  const showSpinner =
    !report && (status === 'loading' || (enoughData && status !== 'error'));

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
        {/* stats strip — real numbers under the narrative */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text variant="mono" color="textMuted">
            {written} {written === 1 ? 'day' : 'days'} written · 30d
          </Text>
          {avgLabel ? (
            <Text variant="mono" tint={avgColor ?? t.colors.textMuted}>
              · avg {avgLabel.toLowerCase()}
            </Text>
          ) : null}
        </View>

        {!enoughData ? (
          <Text variant="serifBody" color="textSecondary">
            Write a few more entries this month and your report will appear here — the throughlines
            you can’t see day to day, pulled together.
          </Text>
        ) : showSpinner ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.space[3], paddingVertical: t.space[3] }}>
            <ActivityIndicator color={t.colors.accent} />
            <Text variant="body" color="textMuted">
              Reading your month…
            </Text>
          </View>
        ) : report ? (
          <>
            <Text variant="title" color="text">
              {report.title}
            </Text>

            {report.overview ? (
              <Section label="Overview">
                <Text variant="serifBody" color="textSecondary">
                  {report.overview}
                </Text>
              </Section>
            ) : null}

            {report.themes.length > 0 ? (
              <Section label="Mood × themes">
                <View style={{ gap: t.space[2] }}>
                  {report.themes.map((th) => (
                    <View key={th.tag} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: t.colors.accent,
                          marginTop: 7,
                        }}
                      />
                      <Text variant="body" color="textSecondary" style={{ flex: 1 }}>
                        <Text variant="bodyStrong" color="text">
                          {th.tag}
                        </Text>{' '}
                        — {th.note}
                      </Text>
                    </View>
                  ))}
                </View>
              </Section>
            ) : null}

            {report.moodNarrative ? (
              <Section label="Mood">
                <Text variant="body" color="textSecondary">
                  {report.moodNarrative}
                </Text>
              </Section>
            ) : null}

            {report.definingMoment ? (
              <Section label="A moment that defined it">
                <View
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor: t.colors.accent,
                    paddingLeft: t.space[4],
                    gap: 4,
                  }}
                >
                  <Text variant="mono" color="textMuted">
                    {report.definingMoment.date.toUpperCase()}
                  </Text>
                  <Text variant="serifQuote" color="text">
                    {report.definingMoment.note}
                  </Text>
                </View>
              </Section>
            ) : null}

            {report.closing ? (
              <Text variant="serifBody" color="text">
                {report.closing}
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: t.space[1],
              }}
            >
              <Text variant="caption" color="textMuted" style={{ flex: 1 }}>
                Generated from your entries · a reflection, not advice.
              </Text>
              <Button label="Regenerate" variant="ghost" size="sm" onPress={onRetry} />
            </View>
          </>
        ) : status === 'error' ? (
          <View style={{ gap: t.space[3] }}>
            <Text variant="body" color="textSecondary">
              Couldn’t generate the report.
            </Text>
            {error ? (
              <Text variant="caption" color="textMuted">
                {error}
              </Text>
            ) : null}
            <Button label="Try again" variant="secondary" size="sm" onPress={onRetry} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
