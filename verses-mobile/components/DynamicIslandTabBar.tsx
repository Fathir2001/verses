// Dynamic Island Tab Bar Component
// Mimics iPhone's Dynamic Island behavior - expands on tap

import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef } from "react";
import { Animated, Platform, Pressable, StyleSheet, View } from "react-native";

export default function DynamicIslandTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  // Animation values
  const widthAnim = useRef(new Animated.Value(0)).current;
  const iconSizeAnim = useRef(new Animated.Value(0)).current;

  // Expanded state tracking
  const isExpanded = useRef(false);
  const autoCollapseTimer = useRef<NodeJS.Timeout | null>(null);

  // Animate to compact state on mount
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

    return () => {
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
      ? "rgba(51, 65, 85, 0.95)" // Lighter slate in dark theme for visibility
      : "rgba(0, 0, 0, 0.85)"; // Dark background in light theme

  const islandBorder =
    colorScheme === "dark"
      ? "rgba(148, 163, 184, 0.3)" // Lighter border in dark theme
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
      ? "rgba(99, 102, 241, 0.3)" // Brighter indigo glow
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
            shadowOpacity: colorScheme === "dark" ? 0.4 : 0.3,
            shadowRadius: 12,
            elevation: 12,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
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

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: "center" }}
            >
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
    bottom: Platform.OS === "ios" ? 34 : 20,
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
    borderWidth: 1,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-around",
  },
  iconContainer: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.3s ease",
  },
});
