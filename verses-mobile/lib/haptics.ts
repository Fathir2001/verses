// Haptic feedback utility
// Provides subtle vibration feedback for premium feel

import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";

const isNative = Platform.OS === "android" || Platform.OS === "ios";

/**
 * Try expo-haptics first; if it fails (e.g. missing native module)
 * fall back to the built-in Vibration API on Android.
 */
async function safeHaptic(fn: () => Promise<void>) {
  if (!isNative) return;
  try {
    await fn();
  } catch {
    // Fallback: short vibration on Android if expo-haptics isn't linked
    if (Platform.OS === "android") {
      try {
        Vibration.vibrate(10);
      } catch {
        // silently ignore
      }
    }
  }
}

export const haptics = {
  /** Light tap - for toggles, selections */
  light: () =>
    safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),

  /** Medium tap - for button presses, favorites */
  medium: () =>
    safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),

  /** Heavy tap - for important actions */
  heavy: () =>
    safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),

  /** Success - for completed actions like copy, save */
  success: () =>
    safeHaptic(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    ),

  /** Selection change - for tab switches, option picks */
  selection: () => safeHaptic(() => Haptics.selectionAsync()),
};
