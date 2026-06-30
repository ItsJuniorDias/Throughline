/**
 * DailyReportCard — the premium hero: a read of the day, written in the context
 * of the recent thread. Presentational only; the screen owns generation and
 * caching and passes the result + status in. A small locally-computed stats
 * strip (entries today, today's mood) grounds the AI narrative in real numbers.
 *
 * The signature element lives here: a gold seam gradient runs across the card's
 * head, and the "throughline" — the line connecting this day to the days before
 * it — gets its own gold-railed callout. That continuity is the whole premium.
 */

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Divider';
import type { DailyReport } from '../../data/insights';
import { useT } from '../../i18n';

function Seam() {
  const t = useTheme();
  const [g0, g1] = t.colors.seamGradient;
  return (
    <Svg width="100%" height={2} style={{ marginTop: -1 }}>
      <Defs>
        <LinearGradient id="dailySeam" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={g0} />
          <Stop offset="1" stopColor={g1} />
        </LinearGradient>
      </Defs>
      <Line x1="0" y1="1" x2="100%" y2="1" stroke="url(#dailySeam)" strokeWidth={2} />
    </Svg>
  );
}

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

export interface DailyReportCardProps {
  report: DailyReport | null;
  status: 'idle' | 'loading' | 'error';
  error?: string | null;
  onRetry: () => void;
  /** human label for the day this read covers, e.g. "Today" or "Jun 28" */
  dayLabel: string;
  entriesToday: number;
  avgLabel?: string;
  avgColor?: string;
  enoughData: boolean;
}

export function DailyReportCard({
  report,
  status,
  error,
  onRetry,
  dayLabel,
  entriesToday,
  avgLabel,
  avgColor,
  enoughData,
}: DailyReportCardProps) {
  const t = useTheme();
  const tr = useT();
  // spinner only while there's nothing to show yet (keep an existing read
  // visible during a forced regenerate)
  const showSpinner = !report && (status === 'loading' || (enoughData && status !== 'error'));

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
      {/* gold header band + seam */}
      <View
        style={{
          backgroundColor: t.colors.accentMuted,
          paddingHorizontal: t.space[5],
          paddingVertical: t.space[3],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="overline" color="accentText">
          {`${dayLabel.toUpperCase()} · ${tr('daily.headerSuffix')}`}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Icon name="award" size={13} colorKey="accentText" />
          <Text variant="mono" color="accentText">
            {tr('daily.premium')}
          </Text>
        </View>
      </View>
      <Seam />

      <View style={{ padding: t.space[5], gap: t.space[5] }}>
        {/* stats strip — real numbers under the narrative */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text variant="mono" color="textMuted">
            {`${tr('daily.statsEntries', { count: entriesToday })} · ${dayLabel.toLowerCase()}`}
          </Text>
          {avgLabel ? (
            <Text variant="mono" tint={avgColor ?? t.colors.textMuted}>
              · {avgLabel.toLowerCase()}
            </Text>
          ) : null}
        </View>

        {!enoughData ? (
          <Text variant="serifBody" color="textSecondary">
            {tr('daily.empty')}
          </Text>
        ) : showSpinner ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: t.space[3],
              paddingVertical: t.space[3],
            }}
          >
            <ActivityIndicator color={t.colors.accent} />
            <Text variant="body" color="textMuted">
              {tr('daily.reading')}
            </Text>
          </View>
        ) : report ? (
          <>
            <Text variant="title" color="text">
              {report.title}
            </Text>

            {report.read ? (
              <Text variant="serifBody" color="textSecondary">
                {report.read}
              </Text>
            ) : null}

            {report.throughline ? (
              <Section label={tr('daily.throughline')}>
                <View
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor: t.colors.accent,
                    paddingLeft: t.space[4],
                  }}
                >
                  <Text variant="serifQuote" color="text">
                    {report.throughline}
                  </Text>
                </View>
              </Section>
            ) : null}

            {report.focus ? (
              <Section label={tr('daily.focus')}>
                <Text variant="body" color="textSecondary">
                  {report.focus}
                </Text>
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
                {tr('daily.generated')}
              </Text>
              <Button label={tr('common.regenerate')} variant="ghost" size="sm" onPress={onRetry} />
            </View>
          </>
        ) : status === 'error' ? (
          <View style={{ gap: t.space[3] }}>
            <Text variant="body" color="textSecondary">
              {tr('daily.error')}
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
    </View>
  );
}
