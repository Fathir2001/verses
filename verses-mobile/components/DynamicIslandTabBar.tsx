// Dynamic Island Tab Bar Component
// Mimics iPhone's Dynamic Island behavior - expands on tap

import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getFavorites } from "@/lib/favorites";
import { haptics } from "@/lib/haptics";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DynamicIslandTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  // Favorites count for badge
  const [favCount, setFavCount] = useState(0);
  const badgeScaleAnim = useRef(new Animated.Value(1)).current;

  // Glow pulse animation for active tab
  const glowAnim = useRef(new Animated.Value(0)).current;

  const loadFavCount = useCallback(async () => {
    try {
      const slugs = await getFavorites();
      setFavCount(slugs.length);
    } catch {}
  }, []);

  // Reload favorites count when tab changes (e.g., leaving favorites screen)
  useEffect(() => {
    loadFavCount();
  }, [state.index, loadFavCount]);

  // Animation values
  const widthAnim = useRef(new Animated.Value(0)).current;
  const iconSizeAnim = useRef(new Animated.Value(0)).current;

  // Expanded state tracking
  const isExpanded = useRef(false);
  const autoCollapseTimer = useRef<NodeJS.Timeout | null>(null);

  // Animate to compact state on mount + start glow pulse
  useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 100,
        friction: 10,
      }),
      Animated.spring(iconSizeAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 100,
        friction: 10,
      }),
    ]).start();

    // Continuous gentle glow pulse for active tab
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]),
    );
    glowLoop.start();

    return () => {
      glowLoop.stop();
      if (autoCollapseTimer.current) {
        clearTimeout(autoCollapseTimer.current);
      }
    };
  }, []);

  // Expand and auto-collapse
  const expandIsland = () => {
    // Clear any existing timer
    if (autoCollapseTimer.current) {
      clearTimeout(autoCollapseTimer.current);
    }

    // Expand
    isExpanded.current = true;
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 80,
        friction: 8,
      }),
      Animated.spring(iconSizeAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 80,
        friction: 8,
      }),
    ]).start();

    // Auto-collapse after 800ms
    autoCollapseTimer.current = setTimeout(() => {
      isExpanded.current = false;
      Animated.parallel([
        Animated.spring(widthAnim, {
          toValue: 0,
          useNativeDriver: false,
          tension: 80,
          friction: 8,
        }),
        Animated.spring(iconSizeAnim, {
          toValue: 0,
          useNativeDriver: false,
          tension: 80,
          friction: 8,
        }),
      ]).start();
    }, 800);
  };

  // Width interpolation: compact (180) to expanded (300)
  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [180, 300],
  });

  // Icon size interpolation: small (20) to larger (24)
  const animatedIconSize = iconSizeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 24],
  });

  // Icon container size
  const animatedIconContainerSize = iconSizeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [28, 40],
  });

  const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    index: "home",
    duas: "book",
    calendar: "calendar",
    favorites: "heart",
  };

  const iconOutlineMap: Record<string, keyof typeof Ionicons.glyphMap> = {
    index: "home-outline",
    duas: "book-outline",
    calendar: "calendar-outline",
    favorites: "heart-outline",
  };

  // Dynamic Island background - contrasts with theme background
  const islandBackground =
    colorScheme === "dark"
      ? "rgba(71, 85, 105, 1)" // Much lighter slate in dark theme for strong visibility
      : "rgba(0, 0, 0, 0.85)"; // Dark background in light theme

  const islandBorder =
    colorScheme === "dark"
      ? "rgba(148, 163, 184, 0.5)" // Stronger border in dark theme
      : "rgba(255, 255, 255, 0.1)";

  // Icon colors - white/light icons for better visibility
  const activeIconColor =
    colorScheme === "dark"
      ? "#FFFFFF" // White icon in dark island
      : "#FFFFFF"; // White icon in light theme too

  const inactiveIconColor =
    colorScheme === "dark"
      ? "rgba(255, 255, 255, 0.5)" // Subtle white in dark island
      : "rgba(255, 255, 255, 0.6)"; // Subtle white in light island

  const activeIconBg =
    colorScheme === "dark"
      ? "rgba(99, 102, 241, 0.4)" // Stronger indigo glow
      : "rgba(99, 102, 241, 0.25)"; // Glow in light theme

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.tabBar,
          {
            backgroundColor: islandBackground,
            borderColor: islandBorder,
            width: animatedWidth,
            // Enhanced shadow based on theme
            shadowColor: colorScheme === "dark" ? "#6366F1" : "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: colorScheme === "dark" ? 0.6 : 0.3,
            shadowRadius: 16,
            elevation: 16,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            // Haptic feedback on tab press
            haptics.selection();
            // Expand island on any tab press (auto-collapses after 800ms)
            expandIsland();

            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const iconName = isFocused
            ? iconMap[route.name]
            : iconOutlineMap[route.name];

          const glowOpacity = glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.7],
          });

          const glowScale = glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.35],
          });

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: "center" }}
            >
              {/* Glow ring behind active icon */}
              {isFocused && (
                <Animated.View
                  style={[
                    styles.glowRing,
                    {
                      opacity: glowOpacity,
                      transform: [{ scale: glowScale }],
                    },
                  ]}
                />
              )}
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    width: animatedIconContainerSize,
                    height: animatedIconContainerSize,
                    backgroundColor: isFocused ? activeIconBg : "transparent",
                  },
                ]}
              >
                <Ionicons
                  name={iconName}
                  size={20}
                  color={isFocused ? activeIconColor : inactiveIconColor}
                />
                {/* Favorites badge */}
                {route.name === "favorites" && favCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {favCount > 9 ? "9+" : favCount}
                    </Text>
                  </View>
                )}
              </Animated.View>
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 34 : 24,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "box-none",
  },
  tabBar: {
    flexDirection: "row",
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-around",
  },
  iconContainer: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.85)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    lineHeight: 12,
  },
  glowRing: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(99, 102, 241, 0.3)",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
});
