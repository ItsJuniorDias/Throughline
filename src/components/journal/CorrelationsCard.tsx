/**
 * CorrelationsCard — premium pattern analytics. For each recurring theme we
 * compare its entries' average mood to your overall average, then surface the
 * two ends: themes that consistently lift you, and themes that quietly weigh on
 * you. Bars are scaled to the strongest effect on screen, so the relative pull
 * of each theme reads at a glance. Local + instant — no model call.
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Icon } from '../ui/Divider';
import type { MoodCorrelation } from '../../data/store';
import { useT } from '../../i18n';

function Row({ row, max, kind }: { row: MoodCorrelation; max: number; kind: 'lift' | 'drain' }) {
  const t = useTheme();
  const tint = kind === 'lift' ? t.colors.success : t.colors.danger;
  const wash = kind === 'lift' ? t.colors.successMuted : t.colors.dangerMuted;
  const pct = Math.max(10, (Math.abs(row.delta) / max) * 100);
  const sign = row.delta >= 0 ? '+' : '−';

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="body" color="textSecondary">
          {row.tag}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text variant="mono" tint={tint}>
            {sign}
            {Math.abs(row.delta).toFixed(1)}
          </Text>
          <Text variant="mono" color="textMuted">
            ·{row.count}
          </Text>
        </View>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: wash, overflow: 'hidden' }}>
        <View
          style={{ width: `${pct}%`, height: '100%', borderRadius: 3, backgroundColor: tint }}
        />
      </View>
    </View>
  );
}

function Group({
  icon,
  title,
  rows,
  max,
  kind,
}: {
  icon: 'trending-up' | 'trending-down';
  title: string;
  rows: MoodCorrelation[];
  max: number;
  kind: 'lift' | 'drain';
}) {
  const t = useTheme();
  if (rows.length === 0) return null;
  return (
    <View style={{ gap: t.space[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name={icon} size={15} colorKey={kind === 'lift' ? 'textSecondary' : 'textSecondary'} />
        <Text variant="overline" color="accentText">
          {title}
        </Text>
      </View>
      <View style={{ gap: t.space[3] }}>
        {rows.map((r) => (
          <Row key={r.tag} row={r} max={max} kind={kind} />
        ))}
      </View>
    </View>
  );
}

export interface CorrelationsCardProps {
  lifts: MoodCorrelation[];
  drains: MoodCorrelation[];
}

export function CorrelationsCard({ lifts, drains }: CorrelationsCardProps) {
  const t = useTheme();
  const tr = useT();
  const max = Math.max(0.1, ...[...lifts, ...drains].map((r) => Math.abs(r.delta)));

  return (
    <View
      style={{
        borderRadius: t.radius.xl,
        borderWidth: 1,
        borderColor: t.colors.border,
        backgroundColor: t.colors.surface,
        padding: t.space[5],
        gap: t.space[5],
        ...t.shadow('sm'),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: 4, flex: 1 }}>
          <Text variant="overline" color="accentText">
            {tr('correlations.eyebrow')}
          </Text>
          <Text variant="heading" color="text">
            {tr('correlations.title')}
          </Text>
        </View>
        <Icon name="git-merge" size={18} colorKey="accentText" />
      </View>

      {lifts.length === 0 && drains.length === 0 ? (
        <Text variant="serifBody" color="textSecondary">
          {tr('correlations.empty')}
        </Text>
      ) : (
        <>
          <Group icon="trending-up" title={tr('correlations.lifts')} rows={lifts} max={max} kind="lift" />
          <Group icon="trending-down" title={tr('correlations.weighs')} rows={drains} max={max} kind="drain" />
          <Text variant="caption" color="textMuted">
            {tr('correlations.note')}
          </Text>
        </>
      )}
    </View>
  );
}
