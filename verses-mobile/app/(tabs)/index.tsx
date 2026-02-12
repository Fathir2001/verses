// HOME SCREEN — Premium glassmorphism design matching website aesthetic
//
// Features:
// - Gradient Islamic date banner with glow effects
// - Glass-style feeling cards with large emoji backgrounds
// - Smooth press interactions with scale animation
// - Search bar with glass effect
// - Section headers with badges

import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { formatIslamicDate, getFeelings, getIslamicDate } from "@/lib/api";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { Feeling } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 48 - CARD_GAP) / 2;

export default function HomeScreen() {
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [filtered, setFiltered] = useState<Feeling[]>([]);
  const [search, setSearch] = useState("");
  const [islamicDate, setIslamicDate] = useState<string>("");
  const [gregorianDate, setGregorianDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favSlugs, setFavSlugs] = useState<string[]>([]);

  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const loadFavs = useCallback(async () => {
    try {
      const slugs = await getFavorites();
      setFavSlugs(slugs);
    } catch {}
  }, []);

  const loadData = useCallback(async () => {
    try {
      const feelingsData = await getFeelings();
      setFeelings(feelingsData);
      setFiltered(feelingsData);

      const hijriDate = await getIslamicDate();
      setIslamicDate(formatIslamicDate(hijriDate));

      const now = new Date();
      setGregorianDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      );
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    loadFavs();
  }, [loadData, loadFavs]);

  // Reload favorites when tab regains focus
  useFocusEffect(
    useCallback(() => {
      loadFavs();
    }, [loadFavs]),
  );

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(feelings);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      feelings.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.preview.toLowerCase().includes(q),
      ),
    );
  }, [search, feelings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    loadFavs();
  }, [loadData, loadFavs]);

  const handleToggleFav = useCallback(
    async (slug: string) => {
      await toggleFavorite(slug);
      await loadFavs();
    },
    [loadFavs],
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View
          style={[styles.loadingIcon, { backgroundColor: colors.primaryGlow }]}
        >
          <Text style={{ fontSize: 32 }}>🌙</Text>
        </View>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  const renderFeelingCard = ({
    item,
    index,
  }: {
    item: Feeling;
    index: number;
  }) => (
    <Pressable
      onPress={() => router.push(`/feeling/${item.slug}`)}
      style={({ pressed }) => [
        styles.feelingCard,
        {
          borderColor: colors.glassBorder,
          transform: [{ scale: pressed ? 0.96 : 1 }],
          width: CARD_WIDTH,
          shadowColor: colorScheme === "dark" ? "#6366F1" : "#000",
          shadowOpacity: colorScheme === "dark" ? 0.3 : 0.12,
        },
      ]}
    >
      {/* Gradient background overlay for premium look */}
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["rgba(51, 65, 85, 0.6)", "rgba(30, 41, 59, 0.8)"]
            : ["rgba(255, 255, 255, 0.95)", "rgba(249, 250, 251, 0.95)"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Large emoji background with gradient glow */}
      <View style={styles.emojiBackground}>
        <LinearGradient
          colors={[colors.gradientStart + "15", colors.gradientEnd + "25"]}
          style={styles.emojiGlowBg}
        >
          <Text style={styles.emojiBg}>{item.emoji}</Text>
        </LinearGradient>
      </View>

      {/* Favorite heart button — matching website's FavoriteButton */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation?.();
          handleToggleFav(item.slug);
        }}
        hitSlop={8}
        style={[
          styles.heartBtn,
          { backgroundColor: colors.glassBg, borderColor: colors.glassBorder },
        ]}
      >
        <Ionicons
          name={favSlugs.includes(item.slug) ? "heart" : "heart-outline"}
          size={20}
          color={
            favSlugs.includes(item.slug) ? "#ef4444" : colors.textSecondary
          }
        />
      </Pressable>

      {/* Content */}
      <View style={styles.cardContent}>
        {/* Emoji with glow effect */}
        <View style={styles.emojiContainer}>
          <View
            style={[
              styles.emojiGlow,
              { backgroundColor: colors.primaryGlow, opacity: 0.3 },
            ]}
          />
          <Text style={styles.feelingEmoji}>{item.emoji}</Text>
        </View>

        <Text style={[styles.feelingTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text
          style={[styles.feelingPreview, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.preview}
        </Text>

        {/* Enhanced "Find comfort" button with gradient */}
        <LinearGradient
          colors={[colors.gradientStart + "20", colors.gradientEnd + "20"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.findComfortBg}
        >
          <View style={styles.findComfort}>
            <Text style={[styles.findComfortText, { color: colors.primary }]}>
              Find comfort
            </Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </View>
        </LinearGradient>
      </View>

      {/* Premium bottom glow accent */}
      <LinearGradient
        colors={[colors.gradientStart + "00", colors.gradientStart + "40"]}
        style={styles.cardGlow}
      />
    </Pressable>
  );

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
        data={filtered}
        keyExtractor={(item) => item.slug}
        renderItem={renderFeelingCard}
        numColumns={2}
        contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* ===== Islamic Date Banner — Gradient ===== */}
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dateBanner}
            >
              {/* Decorative moon */}
              <View style={styles.bannerMoonBg}>
                <Text style={styles.bannerMoonText}>🌙</Text>
              </View>

              <View style={styles.dateBannerContent}>
                <View style={styles.dateIconCircle}>
                  <Text style={{ fontSize: 28 }}>🌙</Text>
                </View>

                <View style={styles.dateTextWrap}>
                  <Text style={styles.islamicDateText}>
                    {islamicDate || "Loading..."}
                  </Text>
                  <Text style={styles.gregorianDateText}>{gregorianDate}</Text>
                </View>

                <View style={styles.dateStarsWrap}>
                  <Text style={{ fontSize: 18 }}>✨</Text>
                  <Text style={{ fontSize: 14 }}>⭐</Text>
                </View>
              </View>
            </LinearGradient>

            {/* ===== Title ===== */}
            <View style={styles.titleSection}>
              <Text style={[styles.headerTitle, { color: colors.primary }]}>
                How are you feeling?
              </Text>
              <Text
                style={[styles.headerSubtitle, { color: colors.textSecondary }]}
              >
                Select what resonates with you, and find comfort through Islamic
                teachings.
              </Text>
            </View>

            {/* ===== Search Box — Premium glass style ===== */}
            <View style={styles.searchWrapper}>
              <LinearGradient
                colors={
                  colorScheme === "dark"
                    ? ["rgba(99, 102, 241, 0.1)", "rgba(59, 130, 246, 0.1)"]
                    : ["rgba(99, 102, 241, 0.05)", "rgba(59, 130, 246, 0.05)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.searchGradientBg}
              >
                <View
                  style={[
                    styles.searchBox,
                    {
                      backgroundColor: colors.glassBg,
                      borderColor: colors.glassBorder,
                    },
                  ]}
                >
                  <View style={styles.searchIconContainer}>
                    <Ionicons
                      name="search"
                      size={18}
                      color={colors.primary}
                      style={{ marginRight: 10 }}
                    />
                  </View>
                  <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search feelings..."
                    placeholderTextColor={colors.textMuted}
                    value={search}
                    onChangeText={setSearch}
                  />
                  {search.length > 0 && (
                    <Pressable
                      onPress={() => setSearch("")}
                      hitSlop={10}
                      style={styles.clearButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={colors.textMuted}
                      />
                    </Pressable>
                  )}
                </View>
              </LinearGradient>
            </View>

            {/* ===== Section Header with gradient accent ===== */}
            <LinearGradient
              colors={
                colorScheme === "dark"
                  ? ["rgba(99, 102, 241, 0.15)", "rgba(59, 130, 246, 0.15)"]
                  : ["rgba(99, 102, 241, 0.1)", "rgba(59, 130, 246, 0.1)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionHeaderGradient}
            >
              <View
                style={[
                  styles.sectionHeader,
                  {
                    backgroundColor: colors.glassBg,
                    borderColor: colors.glassBorder,
                  },
                ]}
              >
                <Text style={{ fontSize: 24 }}>🎭</Text>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {search
                    ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
                    : "All Feelings"}
                </Text>
                <View style={styles.badgeDot} />
              </View>
            </LinearGradient>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIcon,
                { backgroundColor: colors.primaryGlow },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={36}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No feelings found
            </Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Try a different search term
            </Text>
            <Pressable
              onPress={() => setSearch("")}
              style={[
                styles.emptyButton,
                { backgroundColor: colors.primaryGlow },
              ]}
            >
              <Text style={[styles.emptyButtonText, { color: colors.primary }]}>
                Clear search
              </Text>
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
  row: {
    justifyContent: "space-between",
    gap: CARD_GAP,
  },

  // ===== HEADER =====
  headerSection: {
    marginBottom: 8,
  },

  // Banner
  dateBanner: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  bannerMoonBg: {
    position: "absolute",
    right: -20,
    top: -20,
    opacity: 0.1,
  },
  bannerMoonText: {
    fontSize: 120,
  },
  dateBannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    marginRight: 14,
  },
  dateTextWrap: {
    flex: 1,
    alignItems: "center",
  },
  islamicDateText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  gregorianDateText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    marginTop: 3,
  },
  dateStarsWrap: {
    alignItems: "center",
    gap: 4,
  },

  // Title
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 16,
  },

  // Search
  searchWrapper: {
    marginBottom: 20,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  searchGradientBg: {
    padding: 1.5,
    borderRadius: 18,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
  },
  searchIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  clearButton: {
    padding: 4,
  },

  // Section
  sectionHeaderGradient: {
    borderRadius: 16,
    padding: 1.5,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
    flex: 1,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },

  // ===== CARDS =====
  feelingCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    marginBottom: CARD_GAP,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
    minHeight: 200,
  },
  emojiBackground: {
    position: "absolute",
    bottom: -10,
    right: -10,
    opacity: 0.15,
  },
  emojiGlowBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  heartBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emojiBg: {
    fontSize: 80,
  },
  cardContent: {
    padding: 18,
    flex: 1,
    justifyContent: "space-between",
  },
  emojiContainer: {
    position: "relative",
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  emojiGlow: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  feelingEmoji: {
    fontSize: 42,
  },
  feelingTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  feelingPreview: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    marginBottom: 12,
  },
  findComfortBg: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
  },
  findComfort: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  findComfortText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  cardGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  // ===== EMPTY =====
  emptyState: {
    alignItems: "center",
    paddingTop: 48,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  emptyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
