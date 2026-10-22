// CALENDAR SCREEN — Premium glassmorphism design
//
// Features:
// - Large gradient date hero card with moon decoration
// - Today's occasion banner (if any)
// - Islamic months & important dates with glass styling
// - Premium shadow & border treatments

import { CalendarScreenSkeleton } from "@/components/SkeletonLoader";
import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { formatIslamicDate, getIslamicDate } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface IslamicMonth {
  month: number;
  name: string;
  events: string[];
}

const ISLAMIC_MONTHS: IslamicMonth[] = [
  { month: 1, name: "Muharram", events: ["Day of Ashura (10th)"] },
  { month: 2, name: "Safar", events: [] },
  { month: 3, name: "Rabi al-Awwal", events: ["Mawlid al-Nabi (12th)"] },
  { month: 4, name: "Rabi al-Thani", events: [] },
  { month: 5, name: "Jumada al-Ula", events: [] },
  { month: 6, name: "Jumada al-Thani", events: [] },
  { month: 7, name: "Rajab", events: ["Isra & Mi'raj (27th)"] },
  { month: 8, name: "Sha'ban", events: ["Shab-e-Barat (15th)"] },
  {
    month: 9,
    name: "Ramadan",
    events: ["Laylatul Qadr (27th)", "Eid al-Fitr (end)"],
  },
  {
    month: 10,
    name: "Shawwal",
    events: ["Eid al-Fitr (1st)", "Six Fasts of Shawwal"],
  },
  { month: 11, name: "Dhul Qa'dah", events: [] },
  {
    month: 12,
    name: "Dhul Hijjah",
    events: ["Day of Arafah (9th)", "Eid al-Adha (10th)"],
  },
];

const MONTH_EMOJIS = [
  "🌙",
  "🌑",
  "🌟",
  "🌿",
  "🕊️",
  "💎",
  "✨",
  "🌓",
  "🕌",
  "🎉",
  "🏔️",
  "🐪",
];

export default function CalendarScreen() {
  const [islamicDate, setIslamicDate] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [gregorianDate, setGregorianDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useTheme().colorScheme;
  const colors = Colors[colorScheme];

  const loadDate = useCallback(async () => {
    try {
      const hijri = await getIslamicDate();
      setIslamicDate(formatIslamicDate(hijri));
      setCurrentMonth(hijri.month);
      setSelectedMonth(hijri.month);

      const now = new Date();
      setGregorianDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      );
    } catch (e) {
      console.error("Failed to load date:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDate();
  }, [loadDate]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Clear cache to force fresh data
    getIslamicDate.clearCache?.();

    loadDate();
  }, [loadDate]);

  // Get current month's events
  const currentMonthData = ISLAMIC_MONTHS.find((m) => m.month === currentMonth);
  const selectedMonthData = ISLAMIC_MONTHS.find(
    (m) => m.month === selectedMonth,
  );

  // Upcoming events from current month onward
  const upcomingEvents = useMemo(() => {
    if (currentMonth === 0) return [];
    const events: {
      month: string;
      event: string;
      emoji: string;
      monthsAway: number;
    }[] = [];
    for (let i = 0; i < 12; i++) {
      const idx = (((currentMonth - 1 + i) % 12) + 12) % 12;
      const m = ISLAMIC_MONTHS[idx];
      if (m && m.events.length > 0) {
        m.events.forEach((evt) => {
          events.push({
            month: m.name,
            event: evt,
            emoji: MONTH_EMOJIS[idx],
            monthsAway: i,
          });
        });
      }
    }
    return events.slice(0, 6); // Next 6 upcoming events
  }, [currentMonth]);

  if (loading) {
    return <CalendarScreenSkeleton />;
  }

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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* ===== HERO DATE CARD ===== */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          {/* Background decoration */}
          <View style={styles.heroDecor}>
            <Text style={{ fontSize: 140, opacity: 0.08 }}>🌙</Text>
          </View>
          <View style={styles.heroDecor2}>
            <Text style={{ fontSize: 60, opacity: 0.06 }}>✨</Text>
          </View>

          <View style={styles.heroContent}>
            <View style={styles.heroIconCircle}>
              <Text style={{ fontSize: 36 }}>📅</Text>
            </View>

            <Text style={styles.heroSubtitle}>Today's Islamic Date</Text>
            <Text style={styles.heroTitle}>{islamicDate}</Text>
            <Text style={styles.heroGregorian}>{gregorianDate}</Text>

            {/* Current month indicator */}
            {currentMonthData && (
              <View style={styles.heroMonthPill}>
                <Text style={{ fontSize: 16 }}>
                  {MONTH_EMOJIS[currentMonth - 1] || "🌙"}
                </Text>
                <Text style={styles.heroMonthText}>
                  {currentMonthData.name}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>

        {/* ===== CURRENT MONTH EVENTS ===== */}
        {currentMonthData && currentMonthData.events.length > 0 && (
          <View style={styles.section}>
            <View
              style={[
                styles.sectionHeader,
                {
                  backgroundColor: colors.glassBg,
                  borderColor: colors.glassBorder,
                },
              ]}
            >
              <Text style={{ fontSize: 20 }}>⭐</Text>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                This Month's Events
              </Text>
            </View>

            {currentMonthData.events.map((event, idx) => (
              <View
                key={idx}
                style={[
                  styles.eventCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.glassBorder,
                  },
                ]}
              >
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  style={styles.eventDot}
                />
                <Text style={[styles.eventText, { color: colors.text }]}>
                  {event}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== MONTH SELECTOR GRID ===== */}
        <View style={styles.section}>
          <View
            style={[
              styles.sectionHeader,
              {
                backgroundColor: colors.glassBg,
                borderColor: colors.glassBorder,
              },
            ]}
          >
            <Text style={{ fontSize: 20 }}>📖</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Islamic Months
            </Text>
          </View>

          <View style={styles.monthGrid}>
            {ISLAMIC_MONTHS.map((month) => {
              const isCurrent = month.month === currentMonth;
              const isSelected = month.month === selectedMonth;
              const hasEvents = month.events.length > 0;
              return (
                <Pressable
                  key={month.month}
                  onPress={() => setSelectedMonth(month.month)}
                  style={({ pressed }) => [
                    styles.monthGridItem,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.card,
                      borderColor: isCurrent
                        ? colors.primary + "50"
                        : colors.glassBorder,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                    },
                  ]}
                >
                  <Text style={styles.monthGridEmoji}>
                    {MONTH_EMOJIS[month.month - 1]}
                  </Text>
                  <Text
                    style={[
                      styles.monthGridName,
                      {
                        color: isSelected ? "#fff" : colors.text,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {month.name.split(" ")[0]}
                  </Text>
                  {hasEvents && (
                    <View
                      style={[
                        styles.monthGridDot,
                        {
                          backgroundColor: isSelected ? "#fff" : colors.primary,
                        },
                      ]}
                    />
                  )}
                  {isCurrent && !isSelected && (
                    <View
                      style={[
                        styles.monthGridCurrent,
                        { borderColor: colors.primary },
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ===== SELECTED MONTH DETAIL ===== */}
        {selectedMonthData && (
          <View style={styles.section}>
            <View
              style={[
                styles.selectedMonthCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.glassBorder,
                },
              ]}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.selectedMonthAccent}
              />
              <View style={styles.selectedMonthHeader}>
                <Text style={{ fontSize: 32 }}>
                  {MONTH_EMOJIS[selectedMonth - 1]}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.selectedMonthName, { color: colors.text }]}
                  >
                    {selectedMonthData.name}
                  </Text>
                  <Text
                    style={[
                      styles.selectedMonthNumber,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Month {selectedMonth} of the Islamic Calendar
                  </Text>
                </View>
                {selectedMonth === currentMonth && (
                  <View
                    style={[
                      styles.currentBadge,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.currentBadgeText}>Now</Text>
                  </View>
                )}
              </View>
              {selectedMonthData.events.length > 0 ? (
                <View style={styles.selectedMonthEvents}>
                  {selectedMonthData.events.map((evt, i) => (
                    <View
                      key={i}
                      style={[
                        styles.eventCard,
                        {
                          backgroundColor: colors.glassBg,
                          borderColor: colors.glassBorder,
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        style={styles.eventDot}
                      />
                      <Text style={[styles.eventText, { color: colors.text }]}>
                        {evt}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text
                  style={[styles.noEventsText, { color: colors.textMuted }]}
                >
                  No major Islamic events this month
                </Text>
              )}
            </View>
          </View>
        )}

        {/* ===== UPCOMING EVENTS COUNTDOWN ===== */}
        <View style={styles.section}>
          <View
            style={[
              styles.sectionHeader,
              {
                backgroundColor: colors.glassBg,
                borderColor: colors.glassBorder,
              },
            ]}
          >
            <Text style={{ fontSize: 20 }}>⏰</Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Upcoming Events
            </Text>
          </View>

          {upcomingEvents.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.upcomingCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.glassBorder,
                },
              ]}
            >
              <View style={styles.upcomingLeft}>
                <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
              </View>
              <View style={styles.upcomingInfo}>
                <Text style={[styles.upcomingEvent, { color: colors.text }]}>
                  {item.event}
                </Text>
                <Text
                  style={[
                    styles.upcomingMonth,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.month}
                </Text>
              </View>
              <View
                style={[
                  styles.upcomingBadge,
                  {
                    backgroundColor:
                      item.monthsAway === 0
                        ? colors.primary
                        : colors.primaryGlow,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.upcomingBadgeText,
                    {
                      color: item.monthsAway === 0 ? "#fff" : colors.primary,
                    },
                  ]}
                >
                  {item.monthsAway === 0
                    ? "This month"
                    : item.monthsAway === 1
                      ? "Next month"
                      : `${item.monthsAway}m away`}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 80 }} />
      </ScrollView>
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

  // ===== HERO =====
  heroCard: {
    borderRadius: 28,
    padding: 28,
    marginBottom: 24,
    overflow: "hidden",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 14,
  },
  heroDecor: {
    position: "absolute",
    right: -30,
    top: -30,
  },
  heroDecor2: {
    position: "absolute",
    left: 20,
    bottom: 10,
  },
  heroContent: {
    alignItems: "center",
  },
  heroIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.3,
    textAlign: "center",
    marginBottom: 6,
  },
  heroGregorian: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 14,
  },
  heroMonthPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  heroMonthText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // ===== SECTIONS =====
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  // Events
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  eventText: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },

  // Month cards
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  monthGridItem: {
    width: (Dimensions.get("window").width - 36 - 24) / 4,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 4,
    position: "relative",
    overflow: "hidden",
  },
  monthGridEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  monthGridName: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  monthGridDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 4,
  },
  monthGridCurrent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 2,
  },

  // Selected month detail
  selectedMonthCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    padding: 18,
  },
  selectedMonthAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  selectedMonthHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  selectedMonthName: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  selectedMonthNumber: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  selectedMonthEvents: {
    gap: 8,
  },
  noEventsText: {
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "italic",
  },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  currentBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Upcoming events
  upcomingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  upcomingLeft: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(99,102,241,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingEvent: {
    fontSize: 14,
    fontWeight: "700",
  },
  upcomingMonth: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  upcomingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  upcomingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
