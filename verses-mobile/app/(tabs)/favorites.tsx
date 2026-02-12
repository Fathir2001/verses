// FAVORITES SCREEN — Premium glassmorphism design
//
// Features:
// - Beautiful empty state with illustration
// - Glass-style favorite cards with emoji + gradient accents
// - Remove from favorites with confirmation feedback
// - Auto-refresh on screen focus
// - Gradient header banner

import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getFeelings } from "@/lib/api";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { Feeling } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Feeling[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);

  const colorScheme = useTheme().colorScheme;
  const colors = Colors[colorScheme];

  const loadFavorites = useCallback(async () => {
    try {
      const favSlugs = await getFavorites();
      if (favSlugs.length === 0) {
        setFavorites([]);
        return;
      }
      const allFeelings = await getFeelings();
      const favFeelings = allFeelings.filter((f: Feeling) =>
        favSlugs.includes(f.slug),
      );
      setFavorites(favFeelings);
    } catch (e) {
      console.error("Failed to load favorites:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh when screen becomes focused
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFavorites();
  }, [loadFavorites]);

  const handleRemove = async (slug: string) => {
    setRemovingSlug(slug);
    await toggleFavorite(slug);
    // Animate out then remove
    setTimeout(() => {
      setFavorites((prev) => prev.filter((f) => f.slug !== slug));
      setRemovingSlug(null);
    }, 300);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View
          style={[styles.loadingIcon, { backgroundColor: colors.primaryGlow }]}
        >
          <Text style={{ fontSize: 32 }}>❤️</Text>
        </View>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading favorites...
        </Text>
      </View>
    );
  }

  const renderFavCard = ({ item, index }: { item: Feeling; index: number }) => {
    const isRemoving = removingSlug === item.slug;

    return (
      <Pressable
        onPress={() => router.push(`/feeling/${item.slug}`)}
        style={({ pressed }) => [
          styles.favCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.glassBorder,
            opacity: isRemoving ? 0.4 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        {/* Gradient accent */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.cardAccent}
        />

        {/* Emoji bg decoration */}
        <View style={styles.emojiBgWrap}>
          <Text style={styles.emojiBg}>{item.emoji}</Text>
        </View>

        <View style={styles.cardRow}>
          {/* Emoji */}
          <View
            style={[
              styles.emojiCircle,
              { backgroundColor: colors.primaryGlow },
            ]}
          >
            <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
          </View>

          {/* Info */}
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.title}
            </Text>
            <Text
              style={[styles.cardPreview, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {item.preview}
            </Text>
            <View style={styles.findComfort}>
              <Text style={[styles.findComfortText, { color: colors.primary }]}>
                Find comfort
              </Text>
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.primary}
              />
            </View>
          </View>

          {/* Remove button */}
          <Pressable
            onPress={() => handleRemove(item.slug)}
            hitSlop={12}
            style={({ pressed }) => [
              styles.removeBtn,
              {
                backgroundColor: pressed ? "#FEE2E2" : "transparent",
              },
            ]}
          >
            <Ionicons name="heart" size={22} color="#EF4444" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/background.jpeg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(15, 23, 42, 0.6)"
              : "rgba(255, 255, 255, 0.4)",
        }}
      />
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.slug}
        renderItem={renderFavCard}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: 100 },
          favorites.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          favorites.length > 0 ? (
            <View style={styles.headerSection}>
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.banner}
              >
                <View style={styles.bannerDecor}>
                  <Text style={{ fontSize: 90, opacity: 0.1 }}>❤️</Text>
                </View>
                <View style={styles.bannerContent}>
                  <Text style={{ fontSize: 36 }}>❤️</Text>
                  <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.bannerTitle}>Your Favorites</Text>
                    <Text style={styles.bannerSubtitle}>
                      Saved for quick comfort
                    </Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{favorites.length}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {/* Beautiful empty illustration */}
            <LinearGradient
              colors={[colors.gradientStart + "15", colors.gradientEnd + "15"]}
              style={styles.emptyIllustration}
            >
              <View style={styles.emptyHeart}>
                <Text style={{ fontSize: 56 }}>💚</Text>
              </View>
              <View style={styles.emptyStars}>
                <Text style={{ fontSize: 20 }}>✨</Text>
                <Text style={{ fontSize: 14 }}>⭐</Text>
                <Text style={{ fontSize: 18 }}>✨</Text>
              </View>
            </LinearGradient>

            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Tap the heart icon on any feeling{"\n"}to save it here for quick
              access
            </Text>

            <Pressable
              onPress={() => router.push("/(tabs)")}
              style={({ pressed }) => [
                styles.emptyButton,
                {
                  backgroundColor: colors.primary,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <Ionicons name="compass-outline" size={18} color="#fff" />
              <Text style={styles.emptyButtonText}>Explore Feelings</Text>
            </Pressable>
          </View>
        }
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 16,
  },
  container: {
    padding: 18,
    paddingBottom: Platform.OS === "ios" ? 110 : 100, // Space for Dynamic Island tab bar
  },

  // ===== HEADER =====
  headerSection: {
    marginBottom: 20,
  },
  banner: {
    borderRadius: 24,
    padding: 22,
    overflow: "hidden",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  bannerDecor: {
    position: "absolute",
    right: -15,
    top: -10,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  bannerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  countText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
  },

  // ===== CARDS =====
  favCard: {
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  cardAccent: {
    height: 3,
  },
  emojiBgWrap: {
    position: "absolute",
    right: -10,
    bottom: -10,
    opacity: 0.05,
  },
  emojiBg: {
    fontSize: 90,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  emojiCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  cardPreview: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
  findComfort: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 6,
  },
  findComfortText: {
    fontSize: 12,
    fontWeight: "700",
  },
  removeBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== EMPTY STATE =====
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyIllustration: {
    width: 140,
    height: 140,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  emptyHeart: {
    marginBottom: 6,
  },
  emptyStars: {
    flexDirection: "row",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 28,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
