/**
 * Haptics — thin, intention-named wrappers over expo-haptics. Safe on web
 * (expo-haptics is a no-op there, but we guard anyway).
 */

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const enabled = Platform.OS !== 'web';

export const haptics = {
  /** light tick — selection moved (mood picker, chips) */
  select() {
    if (enabled) Haptics.selectionAsync().catch(() => {});
  },
  /** soft tap — a primary button press */
  tap() {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  /** firmer tap — committing something (saving an entry) */
  commit() {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  },
  success() {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  warning() {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },
};
