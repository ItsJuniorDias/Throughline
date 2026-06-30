/**
 * Text — the single typographic primitive. Pick a `variant` from the type scale
 * and (optionally) a semantic `color` key; never hardcode fontFamily/size in
 * screens. Defaults to UI body in primary ink.
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { TypeVariant } from '../../theme/typography';
import type { ColorScheme } from '../../theme/colors';

type ColorKey = keyof Pick<
  ColorScheme,
  | 'text'
  | 'textSecondary'
  | 'textMuted'
  | 'textOnAccent'
  | 'accent'
  | 'accentText'
  | 'accentBright'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'inkButtonText'
>;

export interface TextProps extends RNTextProps {
  variant?: TypeVariant;
  color?: ColorKey | string;
  align?: TextStyle['textAlign'];
  /** override just the color to a literal hex (e.g. a mood color) */
  tint?: string;
}

export function Text({
  variant = 'body',
  color = 'text',
  tint,
  align,
  style,
  ...rest
}: TextProps) {
  const t = useTheme();
  const resolved =
    tint ??
    (color in t.colors ? (t.colors as Record<string, string>)[color as string] : (color as string));

  return (
    <RNText
      style={[t.typography[variant], { color: resolved }, align ? { textAlign: align } : null, style]}
      {...rest}
    />
  );
}
