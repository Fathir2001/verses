// Skeleton Loading Component with shimmer effect
// Provides polished loading placeholders for all screens

import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 48 - CARD_GAP) / 2;

function ShimmerBlock({
  width,
  height,
  borderRadius = 12,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(51,65,85,0.5)"
              : "rgba(226,232,240,0.7)",
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={
            colorScheme === "dark"
              ? ["transparent", "rgba(100,116,139,0.3)", "transparent"]
              : ["transparent", "rgba(255,255,255,0.6)", "transparent"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

// Home screen skeleton - date banner + search + feeling cards
export function HomeScreenSkeleton() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[skeletonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Date banner skeleton */}
      <ShimmerBlock
        width="100%"
        height={100}
        borderRadius={24}
        style={{ marginBottom: 24 }}
      />

      {/* Title area */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <ShimmerBlock
          width={220}
          height={28}
          borderRadius={8}
          style={{ marginBottom: 8 }}
        />
        <ShimmerBlock width={280} height={16} borderRadius={6} />
      </View>

      {/* Search bar skeleton */}
      <ShimmerBlock
        width="100%"
        height={48}
        borderRadius={18}
        style={{ marginBottom: 20 }}
      />

      {/* Section header */}
      <ShimmerBlock
        width="100%"
        height={44}
        borderRadius={14}
        style={{ marginBottom: 16 }}
      />

      {/* Feeling cards grid */}
      <View style={skeletonStyles.cardsRow}>
        <FeelingCardSkeleton />
        <FeelingCardSkeleton />
      </View>
      <View style={skeletonStyles.cardsRow}>
        <FeelingCardSkeleton />
        <FeelingCardSkeleton />
      </View>
      <View style={skeletonStyles.cardsRow}>
        <FeelingCardSkeleton />
        <FeelingCardSkeleton />
      </View>
    </View>
  );
}

function FeelingCardSkeleton() {
  return (
    <View style={[skeletonStyles.feelingCard, { width: CARD_WIDTH }]}>
      {/* Emoji */}
      <ShimmerBlock
        width={52}
        height={52}
        borderRadius={26}
        style={{ marginBottom: 8 }}
      />
      {/* Title */}
      <ShimmerBlock
        width="80%"
        height={18}
        borderRadius={6}
        style={{ marginBottom: 6 }}
      />
      {/* Preview lines */}
      <ShimmerBlock
        width="100%"
        height={12}
        borderRadius={4}
        style={{ marginBottom: 4 }}
      />
      <ShimmerBlock
        width="70%"
        height={12}
        borderRadius={4}
        style={{ marginBottom: 12 }}
      />
      {/* Button */}
      <ShimmerBlock width="60%" height={30} borderRadius={10} />
    </View>
  );
}

// Duas screen skeleton
export function DuasScreenSkeleton() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[skeletonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header banner */}
      <ShimmerBlock
        width="100%"
        height={80}
        borderRadius={20}
        style={{ marginBottom: 20 }}
      />

      {/* Dua cards */}
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <ShimmerBlock width="100%" height={72} borderRadius={18} />
        </View>
      ))}
    </View>
  );
}

// Calendar screen skeleton
export function CalendarScreenSkeleton() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[skeletonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Hero card */}
      <ShimmerBlock
        width="100%"
        height={180}
        borderRadius={28}
        style={{ marginBottom: 24 }}
      />

      {/* Section header */}
      <ShimmerBlock
        width="100%"
        height={40}
        borderRadius={14}
        style={{ marginBottom: 12 }}
      />

      {/* Month cards */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={{ marginBottom: 8 }}>
          <ShimmerBlock width="100%" height={68} borderRadius={18} />
        </View>
      ))}
    </View>
  );
}

// Favorites screen skeleton
export function FavoritesScreenSkeleton() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[skeletonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Header banner */}
      <ShimmerBlock
        width="100%"
        height={80}
        borderRadius={20}
        style={{ marginBottom: 20 }}
      />

      {/* Favorite cards */}
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ marginBottom: 12 }}>
          <ShimmerBlock width="100%" height={90} borderRadius={20} />
        </View>
      ))}
    </View>
  );
}

// Feeling detail skeleton
export function FeelingDetailSkeleton() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[skeletonStyles.container, { backgroundColor: colors.background }]}
    >
      {/* Hero */}
      <ShimmerBlock
        width="100%"
        height={250}
        borderRadius={0}
        style={{ marginBottom: 20 }}
      />

      {/* Section cards */}
      <View style={{ paddingHorizontal: 18 }}>
        <ShimmerBlock
          width="100%"
          height={100}
          borderRadius={22}
          style={{ marginBottom: 16 }}
        />
        <ShimmerBlock
          width="100%"
          height={200}
          borderRadius={22}
          style={{ marginBottom: 16 }}
        />
        <ShimmerBlock
          width="100%"
          height={200}
          borderRadius={22}
          style={{ marginBottom: 16 }}
        />
        <ShimmerBlock width="100%" height={120} borderRadius={22} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  feelingCard: {
    padding: 18,
    borderRadius: 24,
  },
});
