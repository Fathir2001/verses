// FEELING DETAIL SCREEN — Premium glassmorphism design
//
// Features:
// - Gradient hero header with large emoji & decorations
// - Glass section cards (Reminder, Verse, Dua, Actions)
// - Arabic text with RTL support
// - Verse/Dua navigation for multiple items
// - Copy, Share, Favorite actions with glass buttons
// - Smooth press interactions

import { WallpaperGenerator } from "@/components/WallpaperGenerator";
import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { getFeelingBySlug } from "@/lib/api";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { Feeling } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function FeelingDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [verseIdx, setVerseIdx] = useState(0);
  const [duaIdx, setDuaIdx] = useState(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const colorScheme = useTheme().colorScheme;
  const colors = Colors[colorScheme];

  const loadData = useCallback(async () => {
    if (!slug) return;
    try {
      const data = await getFeelingBySlug(slug);
      setFeeling(data);
      const favStatus = await isFavorite(slug);
      setIsFav(favStatus);
    } catch (e) {
      console.error("Failed to load feeling:", e);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFavorite = async () => {
    if (!slug) return;
    const newStatus = await toggleFavorite(slug);
    setIsFav(newStatus);
  };

  const handleCopy = async (text: string, section: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      // Not available
    }
  };

  const handleShare = async () => {
    if (!feeling) return;
    try {
      await Share.share({
        message: `${feeling.emoji} Feeling ${feeling.title}\n\n${feeling.preview}\n\nFrom Verses App`,
      });
    } catch {
      // Cancelled
    }
  };

  // ----- Loading -----
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View
          style={[styles.loadingIcon, { backgroundColor: colors.primaryGlow }]}
        >
          <Text style={{ fontSize: 36 }}>🌙</Text>
        </View>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  // ----- Not found -----
  if (!feeling) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <View
          style={[styles.loadingIcon, { backgroundColor: colors.primaryGlow }]}
        >
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={colors.primary}
          />
        </View>
        <Text style={[styles.notFoundTitle, { color: colors.text }]}>
          Not Found
        </Text>
        <Text style={[styles.notFoundText, { color: colors.textMuted }]}>
          This feeling doesn't exist
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="arrow-back" size={18} color="#fff" />
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  // ----- Data -----
  const verses = feeling.verses?.length
    ? feeling.verses
    : feeling.quran
      ? [feeling.quran]
      : [];
  const duas = feeling.duas?.length
    ? feeling.duas
    : feeling.dua
      ? [feeling.dua]
      : [];

  const currentVerse = verses[verseIdx] || null;
  const currentDua = duas[duaIdx] || null;

  const hasMultipleVerses = verses.length > 1;
  const hasMultipleDuas = duas.length > 1;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ===== HERO HEADER ===== */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        {/* Decorations */}
        <View style={styles.heroDecor1}>
          <Text style={{ fontSize: 160, opacity: 0.06 }}>{feeling.emoji}</Text>
        </View>
        <View style={styles.heroDecor2}>
          <Text style={{ fontSize: 40, opacity: 0.15 }}>✨</Text>
        </View>

        {/* Back + Actions */}
        <View style={styles.heroTopRow}>
          <Pressable onPress={() => router.back()} style={styles.heroBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>

          <View style={styles.heroActions}>
            <Pressable onPress={handleFavorite} style={styles.heroBtn}>
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={22}
                color={isFav ? "#F87171" : "#fff"}
              />
            </Pressable>
            <Pressable onPress={handleShare} style={styles.heroBtn}>
              <Ionicons name="share-outline" size={22} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Emoji & Title */}
        <View style={styles.heroCenter}>
          <View style={styles.heroEmojiCircle}>
            <Text style={{ fontSize: 52 }}>{feeling.emoji}</Text>
          </View>
          <Text style={styles.heroTitle}>Feeling {feeling.title}</Text>
          <Text style={styles.heroPreview}>{feeling.preview}</Text>

          {/* Fav badge */}
          {isFav && (
            <View style={styles.favBadge}>
              <Ionicons name="heart" size={12} color="#F87171" />
              <Text style={styles.favBadgeText}>Saved to favorites</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* ===== SECTIONS ===== */}
      <View style={styles.sections}>
        {/* ----- Gentle Reminder ----- */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card, borderColor: colors.glassBorder },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <View
              style={[
                styles.sectionIcon,
                { backgroundColor: colors.primaryGlow },
              ]}
            >
              <Text style={{ fontSize: 20 }}>💝</Text>
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Gentle Reminder
            </Text>
          </View>
          <Text style={[styles.reminderText, { color: colors.textSecondary }]}>
            {feeling.reminder}
          </Text>
        </View>

        {/* ----- Qur'anic Comfort ----- */}
        {verses.length > 0 && (
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.card, borderColor: colors.glassBorder },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <View
                style={[
                  styles.sectionIcon,
                  { backgroundColor: colors.primaryGlow },
                ]}
              >
                <Text style={{ fontSize: 20 }}>📖</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Qur'anic Comfort
              </Text>
            </View>

            {/* Navigation for multiple verses */}
            {hasMultipleVerses && (
              <View style={styles.navRow}>
                <Pressable
                  onPress={() =>
                    setVerseIdx((p) => (p > 0 ? p - 1 : verses.length - 1))
                  }
                  style={[styles.navBtn, { backgroundColor: colors.primary }]}
                >
                  <Ionicons name="chevron-back" size={16} color="#fff" />
                </Pressable>
                <Text style={[styles.navCounter, { color: colors.textMuted }]}>
                  {verseIdx + 1} of {verses.length}
                </Text>
                <Pressable
                  onPress={() =>
                    setVerseIdx((p) => (p < verses.length - 1 ? p + 1 : 0))
                  }
                  style={[styles.navBtn, { backgroundColor: colors.primary }]}
                >
                  <Ionicons name="chevron-forward" size={16} color="#fff" />
                </Pressable>
              </View>
            )}

            {currentVerse && (
              <>
                {/* Arabic */}
                {currentVerse.arabic && (
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
                      {currentVerse.arabic}
                    </Text>
                  </View>
                )}

                {/* Translation */}
                <Text
                  style={[
                    styles.verseTranslation,
                    { color: colors.textSecondary },
                  ]}
                >
                  "{currentVerse.text}"
                </Text>

                {/* Reference */}
                <Text style={[styles.reference, { color: colors.primary }]}>
                  — {currentVerse.reference}
                </Text>

                {/* Copy */}
                <Pressable
                  onPress={() =>
                    handleCopy(
                      `${currentVerse.arabic || ""}\n\n${currentVerse.text}\n\n— ${currentVerse.reference}`,
                      "verse",
                    )
                  }
                  style={[
                    styles.copyBtn,
                    { backgroundColor: colors.primaryGlow },
                  ]}
                >
                  <Ionicons
                    name={
                      copiedSection === "verse" ? "checkmark" : "copy-outline"
                    }
                    size={15}
                    color={colors.primary}
                  />
                  <Text style={[styles.copyBtnText, { color: colors.primary }]}>
                    {copiedSection === "verse" ? "Copied!" : "Copy Verse"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        )}

        {/* ----- Dua For You ----- */}
        {duas.length > 0 && (
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.card, borderColor: colors.glassBorder },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <View
                style={[
                  styles.sectionIcon,
                  { backgroundColor: colors.primaryGlow },
                ]}
              >
                <Text style={{ fontSize: 20 }}>🤲</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Dua for You
              </Text>
            </View>

            {/* Navigation for multiple duas */}
            {hasMultipleDuas && (
              <View style={styles.navRow}>
                <Pressable
                  onPress={() =>
                    setDuaIdx((p) => (p > 0 ? p - 1 : duas.length - 1))
                  }
                  style={[styles.navBtn, { backgroundColor: colors.primary }]}
                >
                  <Ionicons name="chevron-back" size={16} color="#fff" />
                </Pressable>
                <Text style={[styles.navCounter, { color: colors.textMuted }]}>
                  {duaIdx + 1} of {duas.length}
                </Text>
                <Pressable
                  onPress={() =>
                    setDuaIdx((p) => (p < duas.length - 1 ? p + 1 : 0))
                  }
                  style={[styles.navBtn, { backgroundColor: colors.primary }]}
                >
                  <Ionicons name="chevron-forward" size={16} color="#fff" />
                </Pressable>
              </View>
            )}

            {currentDua && (
              <>
                {/* Arabic */}
                {currentDua.arabic && (
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
                      {currentDua.arabic}
                    </Text>
                  </View>
                )}

                {/* Transliteration */}
                {currentDua.transliteration && (
                  <View style={styles.duaSection}>
                    <Text
                      style={[styles.duaLabel, { color: colors.textMuted }]}
                    >
                      Transliteration
                    </Text>
                    <Text
                      style={[
                        styles.translitText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {currentDua.transliteration}
                    </Text>
                  </View>
                )}

                {/* Meaning */}
                {currentDua.meaning && (
                  <View style={styles.duaSection}>
                    <Text
                      style={[styles.duaLabel, { color: colors.textMuted }]}
                    >
                      Meaning
                    </Text>
                    <Text style={[styles.meaningText, { color: colors.text }]}>
                      "{currentDua.meaning}"
                    </Text>
                  </View>
                )}

                {/* Reference */}
                {currentDua.reference && (
                  <Text style={[styles.reference, { color: colors.primary }]}>
                    — {currentDua.reference}
                  </Text>
                )}

                {/* Copy */}
                <Pressable
                  onPress={() =>
                    handleCopy(
                      `${currentDua.arabic || ""}\n\n${currentDua.transliteration || ""}\n\n"${currentDua.meaning || ""}"\n\n— ${currentDua.reference || ""}`,
                      "dua",
                    )
                  }
                  style={[
                    styles.copyBtn,
                    { backgroundColor: colors.primaryGlow },
                  ]}
                >
                  <Ionicons
                    name={
                      copiedSection === "dua" ? "checkmark" : "copy-outline"
                    }
                    size={15}
                    color={colors.primary}
                  />
                  <Text style={[styles.copyBtnText, { color: colors.primary }]}>
                    {copiedSection === "dua" ? "Copied!" : "Copy Dua"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        )}

        {/* ----- Small Actions ----- */}
        {feeling.actions && feeling.actions.length > 0 && (
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.card, borderColor: colors.glassBorder },
            ]}
          >
            <View style={styles.sectionHeaderRow}>
              <View
                style={[
                  styles.sectionIcon,
                  { backgroundColor: colors.primaryGlow },
                ]}
              >
                <Text style={{ fontSize: 20 }}>✨</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Small Actions You Can Take
              </Text>
            </View>

            {feeling.actions.map((action, idx) => (
              <View key={idx} style={styles.actionItem}>
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  style={styles.actionNumber}
                >
                  <Text style={styles.actionNumberText}>{idx + 1}</Text>
                </LinearGradient>
                <Text
                  style={[styles.actionText, { color: colors.textSecondary }]}
                >
                  {action}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ----- Wallpaper Generator ----- */}
        <WallpaperGenerator feeling={feeling} />

        {/* ----- Share Card ----- */}
        <View
          style={[
            styles.shareCard,
            {
              backgroundColor: colors.glassBg,
              borderColor: colors.glassBorder,
            },
          ]}
        >
          <Text style={[styles.shareText, { color: colors.textSecondary }]}>
            Know someone who might need this?{"\n"}Share it with them.
          </Text>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              styles.shareBtn,
              {
                backgroundColor: colors.primary,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              },
            ]}
          >
            <Ionicons name="share-outline" size={18} color="#fff" />
            <Text style={styles.shareBtnText}>Share This Feeling</Text>
          </Pressable>
        </View>

        {/* ----- Explore Button ----- */}
        <Pressable
          onPress={() => router.push("/(tabs)")}
          style={({ pressed }) => [
            styles.exploreBtn,
            {
              transform: [{ scale: pressed ? 0.96 : 1 }],
            },
          ]}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.exploreBtnGradient}
          >
            <Ionicons name="grid-outline" size={18} color="#fff" />
            <Text style={styles.exploreBtnText}>Explore Other Feelings</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Bottom spacer */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "600",
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  notFoundText: {
    fontSize: 14,
    fontWeight: "500",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // ===== HERO =====
  hero: {
    paddingTop:
      Platform.OS === "ios" ? 56 : (StatusBar.currentHeight || 44) + 10,
    paddingBottom: 32,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  heroDecor1: {
    position: "absolute",
    right: -40,
    bottom: -30,
  },
  heroDecor2: {
    position: "absolute",
    left: 30,
    top: Platform.OS === "ios" ? 70 : (StatusBar.currentHeight || 44) + 24,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heroBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
  },
  heroCenter: {
    alignItems: "center",
  },
  heroEmojiCircle: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: "center",
  },
  heroPreview: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  favBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    marginTop: 14,
  },
  favBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // ===== SECTIONS =====
  sections: {
    padding: 18,
    gap: 14,
    marginTop: -16,
  },
  sectionCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    flex: 1,
  },

  // Reminder
  reminderText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
  },

  // Navigation
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  navCounter: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Arabic
  arabicBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 44,
    textAlign: "right",
    fontWeight: "600",
  },

  // Verse
  verseTranslation: {
    fontSize: 15,
    lineHeight: 24,
    fontStyle: "italic",
    fontWeight: "500",
    marginBottom: 8,
  },
  reference: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },

  // Dua
  duaSection: {
    marginBottom: 12,
    gap: 4,
  },
  duaLabel: {
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
  meaningText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
  },

  // Copy button
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },

  // Actions
  actionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  actionNumber: {
    width: 26,
    height: 26,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },
  actionNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },

  // Share
  shareCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
  },
  shareText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 16,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  shareBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  // Explore
  exploreBtn: {
    borderRadius: 18,
    overflow: "hidden",
  },
  exploreBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 18,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  exploreBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
