/**
 * Button — primary (high-contrast ink fill), secondary (the precious gold
 * outline, used sparingly for premium/affirmative moments), and ghost. Includes
 * a subtle press-scale via the built-in Animated API (no reanimated dependency)
 * plus a light haptic on press.
 */

import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  PressableProps,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { haptics } from '../../lib/haptics';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: ViewStyle;
}

const SIZES: Record<Size, { h: number; px: number; variant: 'label' | 'body' }> = {
  sm: { h: 38, px: 16, variant: 'label' },
  md: { h: 50, px: 20, variant: 'label' },
  lg: { h: 58, px: 24, variant: 'label' },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leading,
  trailing,
  disabled,
  onPress,
  style,
  ...rest
}: ButtonProps) {
  const t = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const dims = SIZES[size];

  const spring = (to: number) =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 6 }).start();

  const palette: Record<Variant, { bg: string; border: string; text: string }> = {
    primary: { bg: t.colors.inkButton, border: t.colors.inkButton, text: t.colors.inkButtonText },
    secondary: { bg: 'transparent', border: t.colors.accent, text: t.colors.accentText },
    ghost: { bg: 'transparent', border: 'transparent', text: t.colors.text },
    danger: { bg: 'transparent', border: t.colors.danger, text: t.colors.danger },
  };
  const p = palette[variant];
  const isDisabled = disabled || loading;

  return (
    <Animated.View
      style={[
        { transform: [{ scale }], opacity: isDisabled ? 0.5 : 1 },
        fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' },
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPressIn={() => spring(0.97)}
        onPressOut={() => spring(1)}
        onPress={(e) => {
          haptics.tap();
          onPress?.(e);
        }}
        style={{
          minHeight: dims.h,
          paddingHorizontal: dims.px,
          borderRadius: t.radius.md,
          borderWidth: variant === 'primary' || variant === 'ghost' ? 0 : 1.5,
          borderColor: p.border,
          backgroundColor: p.bg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={p.text} />
        ) : (
          <>
            {leading ? <View>{leading}</View> : null}
            <Text variant={dims.variant} tint={p.text}>
              {label}
            </Text>
            {trailing ? <View>{trailing}</View> : null}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}
