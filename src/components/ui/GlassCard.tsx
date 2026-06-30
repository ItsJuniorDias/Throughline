/**
 * GlassCard — a translucent blurred surface, echoing iOS 26 liquid glass onto
 * in-app content (the native tab bar gives us glass for free; this lets a few
 * hero moments share the language). A semi-opaque scrim is layered over the
 * blur so text stays legible on busy backgrounds.
 *
 * On Android/web the BlurView degrades gracefully; we add a solid-ish fallback
 * tint so it never looks broken.
 */

import React from 'react';
import { Platform, View, ViewProps, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../theme/ThemeProvider';

export interface GlassCardProps extends ViewProps {
  intensity?: number;
  radius?: number;
  padded?: boolean | number;
  bordered?: boolean;
}

export function GlassCard({
  intensity = 40,
  radius,
  padded = true,
  bordered = true,
  style,
  children,
  ...rest
}: GlassCardProps) {
  const t = useTheme();
  const r = radius ?? t.radius.xl;
  const padding = padded === true ? t.space[5] : typeof padded === 'number' ? padded : 0;

  const container: ViewStyle = {
    borderRadius: r,
    overflow: 'hidden',
    ...(bordered ? { borderWidth: 1, borderColor: t.colors.border } : null),
  };

  const supportsBlur = Platform.OS === 'ios' || Platform.OS === 'android';

  return (
    <View style={[container, style]} {...rest}>
      {supportsBlur ? (
        <BlurView
          intensity={intensity}
          tint={t.colors.glassTint}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      ) : null}
      {/* scrim for contrast (and the only background on web) */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: supportsBlur ? t.colors.glassOverlay : t.colors.surface,
        }}
      />
      <View style={{ padding }}>{children}</View>
    </View>
  );
}
