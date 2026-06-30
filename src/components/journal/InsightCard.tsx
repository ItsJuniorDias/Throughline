/**
 * InsightCard — two shapes:
 *   - default: a single longitudinal observation (free, cheap-model territory):
 *     eyebrow + serif headline + supporting line, optionally a mono stat.
 *   - locked: the premium monthly-report teaser. The deep report is the paid
 *     hero, surfaced exactly when the first month of data is ready, so the card
 *     describes the value and invites the unlock rather than nagging.
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Divider';

interface BaseProps {
  eyebrow: string;
  title: string;
  body?: string;
}

interface ObservationProps extends BaseProps {
  locked?: false;
  stat?: string;
  statLabel?: string;
}

interface LockedProps extends BaseProps {
  locked: true;
  ctaLabel?: string;
  onUnlock?: () => void;
  bullets?: string[];
}

export type InsightCardProps = ObservationProps | LockedProps;

export function InsightCard(props: InsightCardProps) {
  const t = useTheme();

  if (props.locked) {
    const { eyebrow, title, body, bullets = [], ctaLabel = 'Unlock the monthly report', onUnlock } =
      props;
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
        {/* gold header band */}
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
            {eyebrow}
          </Text>
          <Icon name="lock" size={15} colorKey="accentText" />
        </View>

        <View style={{ padding: t.space[5], gap: t.space[4] }}>
          <Text variant="title" color="text">
            {title}
          </Text>
          {body ? (
            <Text variant="body" color="textSecondary">
              {body}
            </Text>
          ) : null}

          {bullets.length > 0 ? (
            <View style={{ gap: t.space[2] }}>
              {bullets.map((b) => (
                <View key={b} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Icon name="check" size={15} colorKey="accentText" />
                  <Text variant="callout" color="textSecondary" style={{ flex: 1 }}>
                    {b}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <Button label={ctaLabel} variant="secondary" fullWidth onPress={onUnlock} />
        </View>
      </View>
    );
  }

  const { eyebrow, title, body, stat, statLabel } = props;
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
        {eyebrow}
      </Text>
      <Text variant="heading" color="text">
        {title}
      </Text>
      {body ? (
        <Text variant="body" color="textSecondary">
          {body}
        </Text>
      ) : null}
      {stat ? (
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: t.space[1] }}>
          <Text variant="monoLarge" color="accentText">
            {stat}
          </Text>
          {statLabel ? (
            <Text variant="caption" color="textMuted">
              {statLabel}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
