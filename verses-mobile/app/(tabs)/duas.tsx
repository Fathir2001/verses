// DUAS SCREEN — Premium glassmorphism design
//
// Features:
// - Glass header with counter badge
// - Expandable dua cards with gradient accents
// - Arabic text display with English translation
// - Copy & share actions with glassmorphic buttons
// - Smooth expand/collapse animations

import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getDuas } from "@/lib/api";
import { Dua } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function DuasScreen() {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const colorScheme = useTheme().colorScheme;
  const colors = Colors[colorScheme];

  const loadDuas = useCallback(async () => {
    try {
      const data = await getDuas();
      setDuas(data);
    } catch (e) {
      console.error("Failed to load duas:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDuas();
  }, [loadDuas]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDuas();
  }, [loadDuas]);

  const handleCopy = async (dua: Dua) => {
    const text = `${dua.arabic}\n\n${dua.meaning}\n\n— ${dua.title}`;
    try {
      await Clipboard.setStringAsync(text);
      setCopiedId(dua._id ?? null);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Clipboard not available
    }
  };

  const handleShare = async (dua: Dua) => {
    try {
      await Share.share({
        message: `${dua.arabic}\n\n${dua.meaning}\n\n— ${dua.title}`,
      });
    } catch {
      // User cancelled
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View
          style={[styles.loadingIcon, { backgroundColor: colors.primaryGlow }]}
        >
          <Text style={{ fontSize: 32 }}>🤲</Text>
        </View>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading duas...
        </Text>
      </View>
    );
  }

  const renderDuaCard = ({ item, index }: { item: Dua; index: number }) => {
    const itemId = item._id || item.slug || item.title || "";
    const isExpanded = expandedId === itemId;
    const isCopied = copiedId === itemId;

    return (
      <Pressable
        onPress={() => setExpandedId(isExpanded ? null : itemId)}
        style={({ pressed }) => [
          styles.duaCard,
          {
            backgroundColor: colors.card,
            borderColor: isExpanded
              ? colors.primary + "40"
              : colors.glassBorder,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          },
        ]}
      >
        {/* Accent gradient top strip */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardAccent}
        />

        {/* Header row */}
        <View style={styles.duaHeader}>
          <View
            style={[
              styles.duaNumberBadge,
              { backgroundColor: colors.primaryGlow },
            ]}
          >
            <Text style={[styles.duaNumber, { color: colors.primary }]}>
              {index + 1}
            </Text>
          </View>
          <View style={styles.duaTitleWrap}>
            <Text
              style={[styles.duaTitle, { color: colors.text }]}
              numberOfLines={isExpanded ? 0 : 1}
            >
              {item.title}
            </Text>
            {item.category && (
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: colors.primaryGlow },
                ]}
              >
                <Text style={[styles.categoryText, { color: colors.primary }]}>
                  {item.category}
                </Text>
              </View>
            )}
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.textMuted}
          />
        </View>

        {/* Expanded content */}
        {isExpanded && (
          <View style={styles.duaBody}>
            {/* Arabic */}
            <View
              style={[
                styles.arabicBox,
                {
                  backgroundColor: colors.glassBg,
                  borderColor: colors.glassBorder,
                },
              ]}
            >
              <Text style={[styles.arabicText, { color: colors.text }]}>
                {item.arabic}
              </Text>
            </View>

            {/* Transliteration */}
            {item.transliteration && (
              <View style={styles.translitSection}>
                <Text
                  style={[styles.sectionLabel, { color: colors.textMuted }]}
                >
                  Transliteration
                </Text>
                <Text
                  style={[styles.translitText, { color: colors.textSecondary }]}
                >
                  {item.transliteration}
                </Text>
              </View>
            )}

            {/* Meaning / Translation */}
            <View style={styles.translationSection}>
              <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
                Meaning
              </Text>
              <Text style={[styles.translationText, { color: colors.text }]}>
                {item.meaning}
              </Text>
            </View>

            {/* Reference */}
            {item.reference && (
              <Text style={[styles.referenceText, { color: colors.textMuted }]}>
                📖 {item.reference}
              </Text>
            )}

            {/* Action buttons */}
            <View style={styles.actionRow}>
              <Pressable
                onPress={() => handleCopy(item)}
                style={[
                  styles.actionBtn,
                  { backgroundColor: colors.primaryGlow },
                ]}
              >
                <Ionicons
                  name={isCopied ? "checkmark" : "copy-outline"}
                  size={16}
                  color={colors.primary}
                />
                <Text style={[styles.actionBtnText, { color: colors.primary }]}>
                  {isCopied ? "Copied!" : "Copy"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleShare(item)}
                style={[
                  styles.actionBtn,
                  { backgroundColor: colors.primaryGlow },
                ]}
              >
                <Ionicons
                  name="share-outline"
                  size={16}
                  color={colors.primary}
                />
                <Text style={[styles.actionBtnText, { color: colors.primary }]}>
                  Share
                </Text>
              </Pressable>
            </View>
          </View>
        )}
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
        data={duas}
        keyExtractor={(item) => item._id || item.slug || item.title || ""}
        renderItem={renderDuaCard}
        contentContainerStyle={[styles.container, { paddingBottom: 100 }]}
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
            {/* Gradient banner */}
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              <View style={styles.bannerDecor}>
                <Text style={{ fontSize: 100, opacity: 0.1 }}>🤲</Text>
              </View>
              <View style={styles.bannerContent}>
                <Text style={{ fontSize: 40 }}>🤲</Text>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.bannerTitle}>Daily Duas</Text>
                  <Text style={styles.bannerSubtitle}>
                    Supplications for every occasion
                  </Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{duas.length}</Text>
                </View>
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
              <Ionicons name="book-outline" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No duas found
            </Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Pull down to refresh
            </Text>
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
    right: -20,
    top: -15,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 24,
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
  duaCard: {
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
  duaHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  duaNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  duaNumber: {
    fontSize: 15,
    fontWeight: "800",
  },
  duaTitleWrap: {
    flex: 1,
    gap: 4,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // Body
  duaBody: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    gap: 14,
  },
  arabicBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  arabicText: {
    fontSize: 22,
    lineHeight: 40,
    textAlign: "right",
    fontWeight: "600",
  },
  translitSection: {
    gap: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  translitText: {
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 22,
  },
  translationSection: {
    gap: 4,
  },
  translationText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
  },
  referenceText: {
    fontSize: 12,
    fontStyle: "italic",
  },

  // Actions
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "700",
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
  },
});
