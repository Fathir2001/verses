// Root Layout - This wraps your ENTIRE app (like layout.tsx in Next.js)
// Every screen in the app is rendered inside this layout.
//
// KEY CONCEPTS:
// - <Stack> = A navigation pattern where screens stack on top of each other
//   (like pushing/popping pages). The user can go back by swiping or pressing back.
// - <Slot> = Renders the current child route (like {children} in Next.js)

import OnboardingScreen, {
  hasSeenOnboarding,
} from "@/components/OnboardingScreen";
import Colors from "@/constants/Colors";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { wakeUpBackend } from "@/lib/api";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    wakeUpBackend(); // Ping backend immediately so Render starts spinning up
    hasSeenOnboarding().then((seen) => setShowOnboarding(!seen));
  }, []);

  // Still checking AsyncStorage
  if (showOnboarding === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />

        {/* Feeling detail — NO native header (we draw our own hero with back button) */}
        <Stack.Screen
          name="feeling/[slug]"
          options={{
            headerShown: false,
            presentation: "card",
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
