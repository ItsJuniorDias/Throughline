/**
 * The throughline — the app's signature element.
 *
 * The product's whole promise is the line *through* your entries over time, so
 * we render it literally: a continuous gold seam (kintsugi) threading down the
 * timeline, with a mood-tinted node at each entry. Composed per-row so it scrolls
 * naturally and needs no measured total height.
 *
 * Two pieces:
 *   - ThroughlineGutter: the left rail used inside each EntryCard row. Built from
 *     absolutely-positioned Views so it auto-fills the row height (the content
 *     column defines the height; the gutter stretches to match) — no measuring.
 *   - WeekStrand: a horizontal 7-node hero ("your last week") for the Today tab,
 *     drawn with SVG since its height is fixed.
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import { moodColor } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import type { Mood } from '../../data/types';
import type { DayMood } from '../../data/store';

const GUTTER_WIDTH = 30;
const NODE_CY = 22; // vertical center of the node, aligned with the entry date row

export interface ThroughlineGutterProps {
  mood: Mood;
  /** draw the line above the node (false for the first/top row) */
  connectTop?: boolean;
  /** draw the line below the node (false for the last/bottom row) */
  connectBottom?: boolean;
}

/** The left rail: a vertical gold seam with a mood node centered on it. */
export function ThroughlineGutter({
  mood,
  connectTop = true,
  connectBottom = true,
}: ThroughlineGutterProps) {
  const t = useTheme();
  const cx = GUTTER_WIDTH / 2;
  const node = moodColor(mood);

  return (
    <View style={{ width: GUTTER_WIDTH, alignSelf: 'stretch' }}>
      {connectTop ? (
        <View
          style={{
            position: 'absolute',
            left: cx - 1,
            top: 0,
            height: NODE_CY,
            width: 2,
            backgroundColor: t.colors.accent,
          }}
        />
      ) : null}
      {connectBottom ? (
        <View
          style={{
            position: 'absolute',
            left: cx - 1,
            top: NODE_CY,
            bottom: 0,
            width: 2,
            backgroundColor: t.colors.accent,
          }}
        />
      ) : null}
      {/* node: a mood dot haloed by the background so the seam reads behind it */}
      <View
        style={{
          position: 'absolute',
          left: cx - 8,
          top: NODE_CY - 8,
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: t.colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 11,
            height: 11,
            borderRadius: 6,
            backgroundColor: node,
            borderWidth: 1,
            borderColor: t.colors.accent,
          }}
        />
      </View>
    </View>
  );
}

export interface WeekStrandProps {
  /** exactly 7 days, oldest → newest */
  days: DayMood[];
}

/** Horizontal hero: 7 nodes on a gold strand, one per day of the past week. */
export function WeekStrand({ days }: WeekStrandProps) {
  const t = useTheme();
  const [g0, g1] = t.colors.seamGradient;
  const H = 64;
  const padX = 16;
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View>
      <Svg width="100%" height={H}>
        <Defs>
          <LinearGradient id="strand" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={g0} />
            <Stop offset="1" stopColor={g1} />
          </LinearGradient>
        </Defs>
        <Line
          x1={padX}
          y1={H / 2}
          x2="100%"
          y2={H / 2}
          stroke="url(#strand)"
          strokeWidth={2}
          opacity={0.9}
        />
      </Svg>

      {/* node + label overlay, evenly distributed inside the padded track */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: padX,
          right: padX,
          height: H,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        pointerEvents="none"
      >
        {days.map((d, i) => {
          const has = d.mood != null;
          const color = moodColor(has ? (Math.round(d.mood as number) as Mood) : undefined);
          const today = i === days.length - 1;
          const r = today ? 8 : 6;
          return (
            <View key={d.key} style={{ alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: r * 2,
                  height: r * 2,
                  borderRadius: r,
                  backgroundColor: has ? color : t.colors.surface,
                  borderWidth: has ? (today ? 2 : 0) : 1.5,
                  borderColor: today ? g1 : t.colors.borderStrong,
                }}
              />
              <Text variant="mono" color={today ? 'accentText' : 'textMuted'}>
                {labels[(d.date.getDay() + 6) % 7]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export { GUTTER_WIDTH };
