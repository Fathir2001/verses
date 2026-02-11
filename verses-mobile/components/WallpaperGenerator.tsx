// WallpaperGenerator — React Native version
// Creates shareable wallpapers with mosque backgrounds, verse/dua content
// Uses react-native-view-shot to capture and expo-media-library to save

import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { Feeling } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CAPT_SCALE = SCREEN_WIDTH / 1080; // Scale factor for capture view elements

type WallpaperImageKey =
  | "mosque-1"
  | "mosque-2"
  | "mosque-3"
  | "mosque-4"
  | "mosque-5"
  | "mosque-6"
  | "mosque-7"
  | "mosque-8";

const imageOptions: Record<
  WallpaperImageKey,
  { source: ReturnType<typeof require>; name: string }
> = {
  "mosque-1": { source: require("@/assets/image1.png"), name: "Golden Dome" },
  "mosque-2": {
    source: require("@/assets/image2.jpeg"),
    name: "White Majesty",
  },
  "mosque-3": {
    source: require("@/assets/image3.jpeg"),
    name: "Dome of Rock",
  },
  "mosque-4": {
    source: require("@/assets/image4.jpeg"),
    name: "Sunset Minaret",
  },
  "mosque-5": {
    source: require("@/assets/image5.jpeg"),
    name: "Elegant Courtyard",
  },
  "mosque-6": { source: require("@/assets/image6.jpeg"), name: "Grand White" },
  "mosque-7": {
    source: require("@/assets/image7.jpeg"),
    name: "Blue Reflection",
  },
  "mosque-8": { source: require("@/assets/background.jpeg"), name: "Classic" },
};

type ContentType = "verse" | "dua";

interface WallpaperGeneratorProps {
  feeling: Feeling;
}

export function WallpaperGenerator({ feeling }: WallpaperGeneratorProps) {
  const [imageKey, setImageKey] = useState<WallpaperImageKey>("mosque-8");
  const [contentType, setContentType] = useState<ContentType>("verse");
  const [isGenerating, setIsGenerating] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);
  const colorScheme = useTheme().colorScheme;
  const colors = Colors[colorScheme];

  const verseContent =
    feeling.verses?.[0] ||
    (feeling.quran
      ? {
          arabic: feeling.quran.arabic,
          text: feeling.quran.text,
          reference: feeling.quran.reference,
        }
      : null);

  const duaContent =
    feeling.duas?.[0] ||
    (feeling.dua
      ? {
          arabic: feeling.dua.arabic,
          transliteration: feeling.dua.transliteration,
          meaning: feeling.dua.meaning,
          reference: feeling.dua.reference,
        }
      : null);

  const currentImage = imageOptions[imageKey];

  const handleSaveWallpaper = useCallback(async () => {
    if (!viewShotRef.current?.capture) return;

    setIsGenerating(true);

    try {
      // Request write-only permission (avoids AUDIO permission issue in Expo Go)
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to save wallpapers to your gallery.",
        );
        setIsGenerating(false);
        return;
      }

      // Capture the view as an image
      const uri = await viewShotRef.current.capture();

      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Think Different", asset, false);

      Alert.alert(
        "Wallpaper Saved! 🎉",
        "Your wallpaper has been saved to the gallery in the 'Think Different' album.",
        [
          { text: "OK" },
          {
            text: "Share",
            onPress: () => {
              Share.share({
                url: Platform.OS === "ios" ? uri : undefined,
                message:
                  Platform.OS === "android"
                    ? `Check out this Islamic wallpaper from Think Different!`
                    : undefined,
              } as any);
            },
          },
        ],
      );
    } catch (error) {
      console.error("Failed to save wallpaper:", error);
      Alert.alert("Error", "Failed to save wallpaper. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.glassBorder },
      ]}
    >
      {/* Section Header */}
      <View style={styles.sectionHeaderRow}>
        <View
          style={[styles.sectionIcon, { backgroundColor: colors.primaryGlow }]}
        >
          <Text style={{ fontSize: 20 }}>🎨</Text>
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Create Shareable Wallpaper
        </Text>
      </View>

      {/* Content Type Toggle */}
      <Text
        style={[styles.label, { color: colors.textSecondary, marginBottom: 8 }]}
      >
        Content
      </Text>
      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setContentType("verse")}
          style={[
            styles.toggleBtn,
            contentType === "verse"
              ? { backgroundColor: colors.primary }
              : {
                  backgroundColor: colors.glassBg,
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                },
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              { color: contentType === "verse" ? "#fff" : colors.text },
            ]}
          >
            📖 Quran Verse
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setContentType("dua")}
          style={[
            styles.toggleBtn,
            contentType === "dua"
              ? { backgroundColor: colors.primary }
              : {
                  backgroundColor: colors.glassBg,
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                },
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              { color: contentType === "dua" ? "#fff" : colors.text },
            ]}
          >
            🤲 Dua
          </Text>
        </Pressable>
      </View>

      {/* Image Selector */}
      <Text
        style={[
          styles.label,
          { color: colors.textSecondary, marginTop: 16, marginBottom: 8 },
        ]}
      >
        Background Image
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageSelector}
      >
        {(Object.keys(imageOptions) as WallpaperImageKey[]).map((key) => (
          <Pressable
            key={key}
            onPress={() => setImageKey(key)}
            style={[
              styles.imageThumb,
              imageKey === key && {
                borderColor: colors.primary,
                borderWidth: 2.5,
                transform: [{ scale: 1.1 }],
              },
            ]}
          >
            <Image
              source={imageOptions[key].source}
              style={styles.imageThumbImg}
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* Wallpaper Preview (visible) */}
      <View style={styles.previewContainer}>
        <View style={styles.previewInner}>
          <ImageBackground
            source={currentImage.source}
            style={styles.previewBg}
            resizeMode="cover"
          >
            {/* Dark overlay */}
            <View style={styles.previewOverlay} />

            {/* Logo */}
            <View style={styles.previewLogo}>
              <Image
                source={require("@/assets/enhanced_image.png")}
                style={{ width: 28, height: 28 }}
              />
            </View>

            {/* Glass panel */}
            <View style={styles.previewGlass}>
              <Text style={styles.previewEmoji}>{feeling.emoji}</Text>
              <Text style={styles.previewTitle}>
                I Am Feeling {feeling.title}
              </Text>
              <Text style={styles.previewContent} numberOfLines={3}>
                {contentType === "verse"
                  ? `"${verseContent?.text || ""}"`
                  : `"${duaContent?.transliteration || ""}"`}
              </Text>
              <Text style={styles.previewRef}>
                —{" "}
                {contentType === "verse"
                  ? verseContent?.reference || ""
                  : duaContent?.reference || ""}
              </Text>
            </View>

            {/* Branding */}
            <View style={styles.previewBrand}>
              <Text style={styles.previewBrandText}>
                © 2026 Think_Different
              </Text>
            </View>
          </ImageBackground>
        </View>
      </View>

      {/* Hidden capture view — rendered on-screen but clipped to 0 height.
          Android clips truly off-screen views, so we keep it in the layout
          tree but invisible. collapsable={false} prevents RN from removing it. */}
      <View style={styles.hiddenCaptureWrapper} collapsable={false}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1, width: 1080, height: 1920 }}
          style={styles.hiddenCapture}
        >
          <ImageBackground
            source={currentImage.source}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH * (1920 / 1080),
            }}
            resizeMode="cover"
          >
            {/* Dark overlay */}
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "rgba(2, 6, 23, 0.25)",
              }}
            />

            {/* Logo at top */}
            <View style={styles.captLogo}>
              <View style={styles.captLogoGlow}>
                <Image
                  source={require("@/assets/enhanced_image.png")}
                  style={{
                    width: 120 * CAPT_SCALE,
                    height: 120 * CAPT_SCALE,
                    borderRadius: 60 * CAPT_SCALE,
                  }}
                />
              </View>
            </View>

            {/* Glass panel */}
            <View style={styles.captPanel}>
              {/* Emoji */}
              <Text style={{ fontSize: 80 * CAPT_SCALE, textAlign: "center" }}>
                {feeling.emoji}
              </Text>

              {/* Title */}
              <Text style={styles.captTitle}>I Am Feeling {feeling.title}</Text>

              {/* Arabic */}
              {((contentType === "verse" && verseContent?.arabic) ||
                (contentType === "dua" && duaContent?.arabic)) && (
                <Text style={styles.captArabic}>
                  {contentType === "verse"
                    ? verseContent?.arabic
                    : duaContent?.arabic}
                </Text>
              )}

              {/* English / Transliteration */}
              <Text style={styles.captEnglish}>
                "
                {contentType === "verse"
                  ? verseContent?.text || ""
                  : duaContent?.transliteration || ""}
                "
              </Text>

              {/* Meaning (dua only) */}
              {contentType === "dua" && duaContent?.meaning && (
                <Text style={styles.captMeaning}>"{duaContent.meaning}"</Text>
              )}

              {/* Reference */}
              <Text style={styles.captRef}>
                —{" "}
                {contentType === "verse"
                  ? verseContent?.reference || ""
                  : duaContent?.reference || ""}
              </Text>
            </View>

            {/* Branding at bottom */}
            <View style={styles.captBrand}>
              <Text style={styles.captBrandText}>© 2026 Think_Different</Text>
            </View>
          </ImageBackground>
        </ViewShot>
      </View>

      {/* Download Button */}
      <Pressable
        onPress={handleSaveWallpaper}
        disabled={isGenerating}
        style={({ pressed }) => [
          styles.downloadBtn,
          {
            transform: [{ scale: pressed ? 0.96 : 1 }],
            opacity: isGenerating ? 0.6 : 1,
          },
        ]}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.downloadBtnGradient}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.downloadBtnText}>Generating...</Text>
            </>
          ) : (
            <>
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.downloadBtnText}>Save Wallpaper</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },

  // Header
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

  // Labels
  label: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Toggle
  toggleRow: {
    flexDirection: "row",
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Image selector
  imageSelector: {
    gap: 8,
    paddingVertical: 4,
  },
  imageThumb: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.1)",
  },
  imageThumbImg: {
    width: "100%",
    height: "100%",
  },

  // Preview
  previewContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  previewInner: {
    width: SCREEN_WIDTH - 80,
    aspectRatio: 9 / 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  previewBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(2, 6, 23, 0.2)",
  },
  previewLogo: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  previewGlass: {
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 12,
    marginHorizontal: 12,
    alignItems: "center",
  },
  previewEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  previewTitle: {
    color: "#f8fafc",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 4,
  },
  previewContent: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 8,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 12,
  },
  previewRef: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 7,
    fontWeight: "700",
    marginTop: 4,
  },
  previewBrand: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  previewBrandText: {
    color: "#f8fafc",
    fontSize: 7,
    fontWeight: "700",
  },

  // Wrapper clips the capture view to 0 height so it's invisible but still rendered
  hiddenCaptureWrapper: {
    height: 0,
    overflow: "hidden",
    opacity: 0,
  },
  hiddenCapture: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * (1920 / 1080),
  },

  // Capture styles (scaled to device width, ViewShot upscales to 1080x1920)
  captLogo: {
    alignItems: "center" as const,
    paddingTop: 50 * CAPT_SCALE,
  },
  captLogoGlow: {
    width: 140 * CAPT_SCALE,
    height: 140 * CAPT_SCALE,
    borderRadius: 70 * CAPT_SCALE,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40 * CAPT_SCALE,
    elevation: 20,
  },
  captPanel: {
    position: "absolute" as const,
    top: "22%" as any,
    left: 24 * CAPT_SCALE,
    right: 24 * CAPT_SCALE,
    bottom: "18%" as any,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    borderRadius: 20 * CAPT_SCALE,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 20 * CAPT_SCALE,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  captTitle: {
    color: "#f8fafc",
    fontSize: 22 * CAPT_SCALE,
    fontWeight: "800" as const,
    textAlign: "center" as const,
    marginTop: 8 * CAPT_SCALE,
    marginBottom: 12 * CAPT_SCALE,
  },
  captArabic: {
    color: "#f8fafc",
    fontSize: 20 * CAPT_SCALE,
    fontWeight: "700" as const,
    textAlign: "center" as const,
    lineHeight: 30 * CAPT_SCALE,
    marginBottom: 12 * CAPT_SCALE,
  },
  captEnglish: {
    color: "#f8fafc",
    fontSize: 15 * CAPT_SCALE,
    fontStyle: "italic" as const,
    fontWeight: "600" as const,
    textAlign: "center" as const,
    lineHeight: 22 * CAPT_SCALE,
    marginBottom: 8 * CAPT_SCALE,
  },
  captMeaning: {
    color: "#f8fafc",
    fontSize: 13 * CAPT_SCALE,
    fontWeight: "600" as const,
    textAlign: "center" as const,
    lineHeight: 20 * CAPT_SCALE,
    marginBottom: 8 * CAPT_SCALE,
  },
  captRef: {
    color: "#f8fafc",
    fontSize: 14 * CAPT_SCALE,
    fontWeight: "800" as const,
    textAlign: "center" as const,
    marginTop: 6 * CAPT_SCALE,
  },
  captBrand: {
    position: "absolute" as const,
    bottom: 30 * CAPT_SCALE,
    alignSelf: "center" as const,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 20 * CAPT_SCALE,
    paddingVertical: 8 * CAPT_SCALE,
    borderRadius: 10 * CAPT_SCALE,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  captBrandText: {
    color: "#f8fafc",
    fontSize: 14 * CAPT_SCALE,
    fontWeight: "800" as const,
  },

  // Download button
  downloadBtn: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 16,
  },
  downloadBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  downloadBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
