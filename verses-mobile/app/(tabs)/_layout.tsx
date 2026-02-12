// Tab Layout — Premium bottom tab bar with Dynamic Island style

import DynamicIslandTabBar from "@/components/DynamicIslandTabBar";
import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TabLayout() {
  const { colorScheme, toggleTheme, isDark } = useTheme();
  const colors = Colors[colorScheme];

  // Enhanced theme toggle with gradient background
  const themeToggle = () => (
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
        <Pressable onPress={toggleTheme} style={styles.themeToggleButton}>
          {/* Track icons */}
          <Text style={styles.themeIconLeft}>☀️</Text>
          <Text style={styles.themeIconRight}>🌙</Text>
          {/* Animated Knob */}
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
  );

  return (
    <Tabs
      tabBar={(props) => <DynamicIslandTabBar {...props} />}
      screenOptions={{
        // Hide default tab bar - using custom Dynamic Island instead
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          display: "none", // Hide default tab bar
        },
        // Enhanced header styling with blur and gradient
        headerTransparent: Platform.OS === "ios",
        headerBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            >
              <LinearGradient
                colors={
                  isDark
                    ? ["rgba(15, 23, 42, 0.8)", "rgba(30, 41, 59, 0.9)"]
                    : ["rgba(255, 255, 255, 0.8)", "rgba(249, 250, 251, 0.9)"]
                }
                style={StyleSheet.absoluteFill}
              />
            </BlurView>
          ) : (
            <LinearGradient
              colors={
                isDark
                  ? ["rgba(15, 23, 42, 0.98)", "rgba(30, 41, 59, 0.98)"]
                  : ["rgba(255, 255, 255, 0.98)", "rgba(249, 250, 251, 0.98)"]
              }
              style={StyleSheet.absoluteFill}
            />
          ),
        headerStyle: {
          backgroundColor:
            Platform.OS === "ios" ? "transparent" : colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: "800",
          fontSize: 22,
          letterSpacing: -0.3,
        },
        headerShadowVisible: false,
        headerRight: () => (
          <View style={{ marginRight: 16 }}>{themeToggle()}</View>
        ),
      }}
    >
      {/* HOME TAB */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: () => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Image
                source={require("@/assets/enhanced_image.png")}
                style={{ width: 28, height: 28, borderRadius: 14 }}
              />
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: "800",
                    fontSize: 22,
                    letterSpacing: -0.3,
                  }}
                >
                  Think Different
                </Text>
                <Text style={{ fontSize: 18 }}>🌙</Text>
              </View>
            </View>
          ),
        }}
      />

      {/* DUAS TAB */}
      <Tabs.Screen
        name="duas"
        options={{
          title: "Duas",
          headerTitle: "Duas 🤲",
        }}
      />

      {/* CALENDAR TAB */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerTitle: "Islamic Calendar 📅",
        }}
      />

      {/* FAVORITES TAB */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          headerTitle: "My Favorites ❤️",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
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
});
