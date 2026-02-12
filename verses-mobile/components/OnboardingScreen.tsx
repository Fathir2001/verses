// Onboarding Screen — Shown only on first app launch
// Beautiful Islamic geometric pattern with animated intro

import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { haptics } from "@/lib/haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ONBOARDING_KEY = "verses_onboarding_done";

const SLIDES = [
  {
    emoji: "🌙",
    title: "Assalamu Alaikum",
    subtitle: "Welcome to Think Different",
    description:
      "Your personal Islamic companion for emotional well-being through the wisdom of the Quran and Sunnah.",
    bgEmoji: "✨",
    decoration: "🕌",
  },
  {
    emoji: "🎭",
    title: "Express Your Feelings",
    subtitle: "Be honest with yourself",
    description:
      "Choose how you're feeling, and discover Quranic verses, duas, and practical actions tailored to your emotional state.",
    bgEmoji: "💝",
    decoration: "📖",
  },
  {
    emoji: "🤲",
    title: "Find Comfort",
    subtitle: "In Allah's Words",
    description:
      "Read beautiful Arabic calligraphy, save your favorites, create shareable wallpapers, and track your spiritual journey.",
    bgEmoji: "🌟",
    decoration: "💎",
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const decorAnim = useRef(new Animated.Value(0)).current;
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
    ]).start();

    // Floating decoration animation
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(decorAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(decorAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    );
    float.start();
    return () => float.stop();
  }, []);

  const animateToSlide = (next: number) => {
    haptics.selection();
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentSlide(next);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      animateToSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    haptics.success();
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    onComplete();
  };

  const slide = SLIDES[currentSlide];
  const isLast = currentSlide === SLIDES.length - 1;

  const decorTranslateY = decorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Background geometric decorations */}
      <Animated.View
        style={[
          styles.bgDecor1,
          { transform: [{ translateY: decorTranslateY }] },
        ]}
      >
        <Text style={styles.bgDecorText}>{slide.bgEmoji}</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.bgDecor2,
          {
            transform: [{ translateY: Animated.multiply(decorTranslateY, -1) }],
          },
        ]}
      >
        <Text style={styles.bgDecorText2}>{slide.decoration}</Text>
      </Animated.View>
      <View style={styles.bgDecor3}>
        <Text style={{ fontSize: 200, opacity: 0.04 }}>🌙</Text>
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Emoji hero */}
        <View style={styles.emojiHero}>
          <View style={styles.emojiCircle}>
            <Text style={styles.emojiText}>{slide.emoji}</Text>
          </View>
        </View>

        {/* Text */}
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </Animated.View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => animateToSlide(i)}>
              <View
                style={[styles.dot, i === currentSlide && styles.dotActive]}
              />
            </Pressable>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          {!isLast && (
            <Pressable onPress={handleComplete} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextBtn,
              { transform: [{ scale: pressed ? 0.95 : 1 }] },
            ]}
          >
            <Text style={styles.nextText}>
              {isLast ? "Get Started ✨" : "Next"}
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
    return seen === "true";
  } catch {
    return false;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bgDecor1: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.12,
    right: 30,
  },
  bgDecorText: {
    fontSize: 60,
    opacity: 0.15,
  },
  bgDecor2: {
    position: "absolute",
    bottom: SCREEN_HEIGHT * 0.25,
    left: 30,
  },
  bgDecorText2: {
    fontSize: 50,
    opacity: 0.12,
  },
  bgDecor3: {
    position: "absolute",
    bottom: -60,
    right: -60,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
    flex: 1,
    justifyContent: "center",
  },
  emojiHero: {
    marginBottom: 30,
  },
  emojiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  emojiText: {
    fontSize: 56,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  bottomSection: {
    paddingBottom: 60,
    paddingHorizontal: 30,
    width: "100%",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    width: 30,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  skipText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    fontWeight: "600",
  },
  nextBtn: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 20,
    marginLeft: "auto",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  nextText: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "800",
  },
});
