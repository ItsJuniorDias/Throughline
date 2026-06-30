/**
 * Tab bar — expo-router's NATIVE tabs (the explicit request).
 *
 * This renders a real UITabBarController on iOS, so on iOS 26 (built with
 * Xcode 26) it gets Apple's Liquid Glass for free: content flows behind the
 * translucent bar and the bar minimizes as you scroll. On Android it's a native
 * Material 3 tab bar; on older iOS, the classic tab bar.
 *
 * Icons: `sf` drives iOS (SF Symbols, with default/selected variants) and `md`
 * drives Android (Material Symbols), so one declaration covers both platforms
 * natively — no bundled icon assets.
 *
 * Caveats worth remembering:
 *   - Liquid glass does NOT appear in Expo Go (it's compiled with an older
 *     Xcode). Use a development build / an iOS 26 simulator under Xcode 26.
 *   - Never mix <Tabs> and <NativeTabs> in the same tree.
 *   - Each tab screen must keep its ScrollView as the first child (see
 *     ScreenScrollView) for the scroll-edge + minimize behaviors to work.
 */

import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Icon, Label } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function TabLayout() {
  const t = useTheme();

  return (
    <NativeTabs minimizeBehavior="onScrollDown" tintColor={t.colors.accent}>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'sun.max', selected: 'sun.max.fill' }} md="wb_sunny" />
        <Label>Today</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="timeline">
        <Icon sf={{ default: 'book.closed', selected: 'book.closed.fill' }} md="menu_book" />
        <Label>Timeline</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="insights">
        <Icon sf="chart.line.uptrend.xyaxis" md="insights" />
        <Label>Insights</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="you">
        <Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="account_circle"
        />
        <Label>You</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
