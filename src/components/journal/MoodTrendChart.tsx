/**
 * MoodTrendChart — average mood across a trailing window, as a gold area+line.
 * Days without an entry are skipped and the line bridges them, reading as a
 * continuous trend. Each plotted day gets a node in its own mood color, tying
 * the chart back to the mood spectrum used everywhere else.
 *
 * Width is measured via onLayout so the SVG draws in real coordinates (no
 * aspect-ratio stretching of strokes/dots).
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle, Line } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';
import { moodColor } from '../../theme/colors';
import { Text } from '../ui/Text';
import type { Mood } from '../../data/types';
import type { DayMood } from '../../data/store';

export interface MoodTrendChartProps {
  data: DayMood[];
  height?: number;
}

export function MoodTrendChart({ data, height = 140 }: MoodTrendChartProps) {
  const t = useTheme();
  const [w, setW] = useState(0);
  const [g0, g1] = t.colors.seamGradient;

  const padT = 12;
  const padB = 14;
  const innerH = height - padT - padB;

  // map mood 1..5 to y (5 at top)
  const yFor = (m: number) => padT + (1 - (m - 1) / 4) * innerH;
  const xFor = (i: number) => (data.length <= 1 ? w / 2 : (i / (data.length - 1)) * w);

  const points = data
    .map((d, i) => (d.mood != null ? { x: xFor(i), y: yFor(d.mood), mood: d.mood, i } : null))
    .filter((p): p is { x: number; y: number; mood: number; i: number } => p !== null);

  let linePath = '';
  let areaPath = '';
  if (points.length > 0 && w > 0) {
    linePath = points
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
    const first = points[0];
    const last = points[points.length - 1];
    areaPath = `${linePath} L ${last.x.toFixed(1)} ${height - padB} L ${first.x.toFixed(1)} ${
      height - padB
    } Z`;
  }

  const neutralY = yFor(3);

  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={{ height }}>
      {w > 0 ? (
        <Svg width={w} height={height}>
          <Defs>
            <LinearGradient id="moodArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={g0} stopOpacity={0.28} />
              <Stop offset="1" stopColor={g0} stopOpacity={0.02} />
            </LinearGradient>
          </Defs>

          {/* neutral baseline (mood = Okay) */}
          <Line
            x1={0}
            y1={neutralY}
            x2={w}
            y2={neutralY}
            stroke={t.colors.border}
            strokeWidth={1}
            strokeDasharray="2 5"
          />

          {areaPath ? <Path d={areaPath} fill="url(#moodArea)" /> : null}
          {linePath ? (
            <Path
              d={linePath}
              fill="none"
              stroke={g1}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}

          {points.map((p) => (
            <React.Fragment key={p.i}>
              <Circle cx={p.x} cy={p.y} r={4.5} fill={t.colors.bg} />
              <Circle cx={p.x} cy={p.y} r={3.5} fill={moodColor(Math.round(p.mood) as Mood)} />
            </React.Fragment>
          ))}
        </Svg>
      ) : null}

      {points.length === 0 ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text variant="callout" color="textMuted">
            Not enough entries yet
          </Text>
        </View>
      ) : null}
    </View>
  );
}
