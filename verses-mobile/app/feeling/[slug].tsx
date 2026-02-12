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
import { BlurView } from "expo-blur";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
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

  const { colorScheme, toggleTheme, isDark } = useTheme();
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
  // Normalize verses to use consistent field names (handle both API formats)
  const verses = feeling.verses?.length
    ? feeling.verses.map((v) => ({
        ...v,
        arabic: v.arabicText || v.arabic || "",
        text: v.translationText || v.text || "",
      }))
    : feeling.quran
      ? [
          {
            ...feeling.quran,
            arabic: feeling.quran.arabic || "",
            text: feeling.quran.text || "",
          },
        ]
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
              ? "rgba(15, 23, 42, 0.7)"
              : "rgba(255, 255, 255, 0.5)",
        }}
      />

      {/* ===== CUSTOM HEADER ===== */}
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={80}
          tint={isDark ? "dark" : "light"}
          style={styles.headerBlur}
        >
          <LinearGradient
            colors={
              isDark
                ? ["rgba(15, 23, 42, 0.8)", "rgba(30, 41, 59, 0.9)"]
                : ["rgba(255, 255, 255, 0.8)", "rgba(249, 250, 251, 0.9)"]
            }
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.headerContent}>
            <Pressable
              onPress={() => router.back()}
              style={styles.headerBackBtn}
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {feeling ? `Feeling ${feeling.title}` : "Loading..."}
            </Text>
            <View style={styles.themeToggleContainer}>
              <LinearGradient
                colors={
                  isDark
                    ? ["rgba(99, 102, 241, 0.2)", "rgba(59, 130, 246, 0.2)"]
                    : ["rgba(251, 191, 36, 0.3)", "rgba(245, 158, 11, 0.3)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.themeToggleGradient}
              >
                <Pressable
                  onPress={toggleTheme}
                  style={styles.themeToggleButton}
                >
                  <Text style={styles.themeIconLeft}>☀️</Text>
                  <Text style={styles.themeIconRight}>🌙</Text>
                  <View
                    style={[
                      styles.themeKnob,
                      {
                        left: isDark ? 29 : 3,
                        backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                        borderColor: isDark
                          ? "rgba(99, 102, 241, 0.6)"
                          : "rgba(251, 191, 36, 0.5)",
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 11 }}>{isDark ? "🌙" : "☀️"}</Text>
                  </View>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        </BlurView>
      ) : (
        <LinearGradient
          colors={
            isDark
              ? ["rgba(15, 23, 42, 0.98)", "rgba(30, 41, 59, 0.98)"]
              : ["rgba(255, 255, 255, 0.98)", "rgba(249, 250, 251, 0.98)"]
          }
          style={styles.headerBlur}
        >
          <View style={styles.headerContent}>
            <Pressable
              onPress={() => router.back()}
              style={styles.headerBackBtn}
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {feeling ? `Feeling ${feeling.title}` : "Loading..."}
            </Text>
            <View style={styles.themeToggleContainer}>
              <LinearGradient
                colors={
                  isDark
                    ? ["rgba(99, 102, 241, 0.2)", "rgba(59, 130, 246, 0.2)"]
                    : ["rgba(251, 191, 36, 0.3)", "rgba(245, 158, 11, 0.3)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.themeToggleGradient}
              >
                <Pressable
                  onPress={toggleTheme}
                  style={styles.themeToggleButton}
                >
                  <Text style={styles.themeIconLeft}>☀️</Text>
                  <Text style={styles.themeIconRight}>🌙</Text>
                  <View
                    style={[
                      styles.themeKnob,
                      {
                        left: isDark ? 29 : 3,
                        backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                        borderColor: isDark
                          ? "rgba(99, 102, 241, 0.6)"
                          : "rgba(251, 191, 36, 0.5)",
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 11 }}>{isDark ? "🌙" : "☀️"}</Text>
                  </View>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      )}

      <ScrollView
        style={{ flex: 1 }}
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
          {/* Actions (far right, no back button) */}
          <View style={styles.heroTopRow}>
            <View style={{ flex: 1 }} />
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
              <Text style={{ fontSize: 42 }}>{feeling.emoji}</Text>
            </View>
            <Text style={styles.heroTitle}>Feeling {feeling.title}</Text>
            <Text style={styles.heroPreview}>{feeling.preview}</Text>

            {/* Fav badge */}
            {isFav && (
              <View style={styles.favBadge}>
                <Ionicons name="heart" size={10} color="#F87171" />
                <Text style={styles.favBadgeText}>Saved</Text>
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
            <Text
              style={[styles.reminderText, { color: colors.textSecondary }]}
            >
              {feeling.reminder}
            </Text>
          </View>

          {/* ----- Qur'anic Comfort ----- */}
          {verses.length > 0 && (
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.glassBorder,
                },
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
                  <Text
                    style={[styles.navCounter, { color: colors.textMuted }]}
                  >
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
                    <Text
                      style={[styles.copyBtnText, { color: colors.primary }]}
                    >
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
                {
                  backgroundColor: colors.card,
                  borderColor: colors.glassBorder,
                },
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
                  <Text
                    style={[styles.navCounter, { color: colors.textMuted }]}
                  >
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
                      <Text
                        style={[styles.meaningText, { color: colors.text }]}
                      >
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
                    <Text
                      style={[styles.copyBtnText, { color: colors.primary }]}
                    >
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
                {
                  backgroundColor: colors.card,
                  borderColor: colors.glassBorder,
                },
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
    </ImageBackground>
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
    padding: 18,
    paddingBottom: Platform.OS === "ios" ? 110 : 100,
  },

  // ===== HEADER =====
  headerBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  themeToggleContainer: {
    overflow: "hidden",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeToggleGradient: {
    borderRadius: 20,
    padding: 1,
  },
  themeToggleButton: {
    position: "relative",
    backgroundColor: "transparent",
    borderRadius: 20,
    width: 56,
    height: 30,
  },
  themeIconLeft: {
    position: "absolute",
    left: 7,
    top: 6,
    fontSize: 12,
    opacity: 0.7,
  },
  themeIconRight: {
    position: "absolute",
    right: 7,
    top: 6,
    fontSize: 12,
    opacity: 0.7,
  },
  themeKnob: {
    position: "absolute",
    top: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  // ===== HERO =====
  hero: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 22,
    overflow: "hidden",
    marginTop:
      Platform.OS === "ios" ? 96 : (StatusBar.currentHeight || 44) + 56,
    marginBottom: 20,
    borderRadius: 24,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  heroDecor1: {
    position: "absolute",
    right: -50,
    bottom: -40,
    opacity: 0.08,
  },
  heroDecor2: {
    position: "absolute",
    left: 20,
    top: 30,
    opacity: 0.2,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 16,
  },
  heroBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
  },
  heroCenter: {
    alignItems: "center",
  },
  heroEmojiCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    marginBottom: 10,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
    marginBottom: 6,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroPreview: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 16,
  },
  favBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
    marginTop: 8,
  },
  favBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  // ===== SECTIONS =====
  sections: {
    gap: 12,
  },
  sectionCard: {
    position: "relative",
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
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
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  navCounter: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Arabic
  arabicBox: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
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
    marginBottom: 16,
    gap: 6,
  },
  duaLabel: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
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
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },

  // Actions
  actionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(16, 185, 129, 0.03)",
  },
  actionNumber: {
    width: 32,
    height: 32,
    borderRadius: 11,
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
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 28,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
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
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 18,
  },
  shareBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  // Explore
  exploreBtn: {
    borderRadius: 20,
    overflow: "hidden",
  },
  exploreBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
    borderRadius: 18,
  },
  exploreBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
