/**
 * Surface / Card — themed containers. Surface is the low-level box (pick a level
 * + radius); Card is the opinionated content card used throughout the app.
 */

import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { Elevation } from '../../theme/theme';

type SurfaceLevel = 'bg' | 'surface' | 'surfaceMuted' | 'elevated';

export interface SurfaceProps extends ViewProps {
  level?: SurfaceLevel;
  elevation?: Elevation;
  radius?: number;
  bordered?: boolean;
  padded?: boolean | number;
}

export function Surface({
  level = 'surface',
  elevation = 'none',
  radius,
  bordered = false,
  padded = false,
  style,
  children,
  ...rest
}: SurfaceProps) {
  const t = useTheme();
  const padding = padded === true ? t.space[5] : typeof padded === 'number' ? padded : 0;

  const base: ViewStyle = {
    backgroundColor: t.colors[level],
    borderRadius: radius ?? t.radius.lg,
    padding,
    ...(bordered
      ? { borderWidth: 1, borderColor: t.colors.border }
      : null),
    ...t.shadow(elevation),
  };

  return (
    <View style={[base, style]} {...rest}>
      {children}
    </View>
  );
}

export interface CardProps extends ViewProps {
  elevation?: Elevation;
  padded?: boolean | number;
  /** subtle pressed/interactive look via a gold left accent rail */
  accentRail?: boolean;
}

export function Card({
  elevation = 'sm',
  padded = true,
  accentRail = false,
  style,
  children,
  ...rest
}: CardProps) {
  const t = useTheme();
  const padding = padded === true ? t.space[5] : typeof padded === 'number' ? padded : 0;

  return (
    <View
      style={[
        {
          backgroundColor: t.colors.surface,
          borderRadius: t.radius.xl,
          borderWidth: 1,
          borderColor: t.colors.border,
          padding,
          overflow: 'hidden',
          ...t.shadow(elevation),
        },
        style,
      ]}
      {...rest}
    >
      {accentRail ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: t.colors.accent,
          }}
        />
      ) : null}
      {children}
    </View>
  );
}
