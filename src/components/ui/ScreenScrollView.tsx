/**
 * ScreenScrollView — the standard screen scroll container.
 *
 * Liquid glass details that matter here:
 *   1. This must be the FIRST child of a tab screen so expo-router's native
 *      tabs can detect it and drive scroll-edge transparency + minimize-on-
 *      scroll. Screens render <ScreenScrollView> at their root.
 *   2. The ScrollView itself runs full-height *behind* the translucent tab bar;
 *      we only pad the CONTENT (top for the status bar, bottom to clear the bar)
 *      so nothing is permanently obscured while content still passes under glass.
 *   3. contentInsetAdjustmentBehavior is "never" so our manual insets are the
 *      single source of truth (no double-padding fights with the system).
 */

import React from 'react';
import { ScrollView, ScrollViewProps, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';

/** Approx native tab bar height; content clears it by this + bottom safe area. */
const TAB_BAR_CLEARANCE = 64;

export interface ScreenScrollViewProps extends ScrollViewProps {
  /** apply the default horizontal screen gutter to content */
  gutter?: boolean;
  contentStyle?: ViewStyle;
  /** extra bottom space beyond the tab-bar clearance (e.g. for a footer CTA) */
  bottomSpace?: number;
}

export function ScreenScrollView({
  gutter = true,
  contentStyle,
  bottomSpace = 0,
  children,
  style,
  ...rest
}: ScreenScrollViewProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[{ backgroundColor: t.colors.bg }, style]}
      contentInsetAdjustmentBehavior="never"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      scrollIndicatorInsets={{ bottom: insets.bottom + TAB_BAR_CLEARANCE }}
      contentContainerStyle={[
        {
          paddingTop: insets.top + t.space[2],
          paddingBottom: insets.bottom + TAB_BAR_CLEARANCE + bottomSpace,
          paddingHorizontal: gutter ? t.gutter : 0,
        },
        contentStyle,
      ]}
      {...rest}
    >
      {children}
      <View />
    </ScrollView>
  );
}
