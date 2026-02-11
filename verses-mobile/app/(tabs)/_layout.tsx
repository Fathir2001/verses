// Tab Layout — Premium bottom tab bar with glassmorphism style

import Colors from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, Platform, Pressable, Text, View } from "react-native";

export default function TabLayout() {
  const { colorScheme, toggleTheme, isDark } = useTheme();
  const colors = Colors[colorScheme];

  const tabIcon = (
    name: React.ComponentProps<typeof Ionicons>["name"],
    focusedName: React.ComponentProps<typeof Ionicons>["name"],
    color: string,
    focused: boolean,
  ) => (
    <View
      style={
        focused
          ? {
              backgroundColor: colors.primaryGlow,
              borderRadius: 14,
              width: 36,
              height: 36,
              justifyContent: "center" as const,
              alignItems: "center" as const,
            }
          : {
              width: 36,
              height: 36,
              justifyContent: "center" as const,
              alignItems: "center" as const,
            }
      }
    >
      <Ionicons name={focused ? focusedName : name} size={22} color={color} />
    </View>
  );

  // Theme toggle component for header
  const themeToggle = () => (
    <Pressable
      onPress={toggleTheme}
      style={{
        position: "relative",
        backgroundColor: isDark
          ? "rgba(51, 65, 85, 0.6)"
          : "rgba(251, 191, 36, 0.15)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isDark
          ? "rgba(71, 85, 105, 0.5)"
          : "rgba(251, 191, 36, 0.3)",
        width: 56,
        height: 30,
      }}
    >
      {/* Track icons */}
      <Text
        style={{
          position: "absolute",
          left: 7,
          top: 6,
          fontSize: 12,
          opacity: 0.6,
        }}
      >
        ☀️
      </Text>
      <Text
        style={{
          position: "absolute",
          right: 7,
          top: 6,
          fontSize: 12,
          opacity: 0.6,
        }}
      >
        🌙
      </Text>
      {/* Knob */}
      <View
        style={{
          position: "absolute",
          top: 3,
          left: isDark ? 29 : 3,
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderWidth: 1,
          borderColor: isDark
            ? "rgba(71, 85, 105, 0.6)"
            : "rgba(251, 191, 36, 0.4)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 3,
          elevation: 3,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 11 }}>{isDark ? "🌙" : "☀️"}</Text>
      </View>
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        // Tab bar styling — glass effect
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 0.5,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 10,
          // Floating tab bar effect
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        // Header styling
        headerStyle: {
          backgroundColor: colors.background,
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
          tabBarIcon: ({ color, focused }) =>
            tabIcon("home-outline", "home", color, focused),
        }}
      />

      {/* DUAS TAB */}
      <Tabs.Screen
        name="duas"
        options={{
          title: "Duas",
          headerTitle: "Duas 🤲",
          tabBarIcon: ({ color, focused }) =>
            tabIcon("book-outline", "book", color, focused),
        }}
      />

      {/* CALENDAR TAB */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerTitle: "Islamic Calendar 📅",
          tabBarIcon: ({ color, focused }) =>
            tabIcon("calendar-outline", "calendar", color, focused),
        }}
      />

      {/* FAVORITES TAB */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          headerTitle: "My Favorites ❤️",
          tabBarIcon: ({ color, focused }) =>
            tabIcon("heart-outline", "heart", color, focused),
        }}
      />
    </Tabs>
  );
}
