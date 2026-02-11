// Root Layout - This wraps your ENTIRE app (like layout.tsx in Next.js)
// Every screen in the app is rendered inside this layout.
//
// KEY CONCEPTS:
// - <Stack> = A navigation pattern where screens stack on top of each other
//   (like pushing/popping pages). The user can go back by swiping or pressing back.
// - <Slot> = Renders the current child route (like {children} in Next.js)

import Colors from "@/constants/Colors";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

function RootNavigator() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

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
