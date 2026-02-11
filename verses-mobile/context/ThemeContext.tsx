// Theme context — allows user to toggle between light/dark/system themes
// Persists preference in AsyncStorage

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  colorScheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const THEME_KEY = "@think_different_theme";

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "system",
  colorScheme: "light",
  setThemeMode: () => {},
  toggleTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [loaded, setLoaded] = useState(false);

  // Load saved preference
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setThemeModeState(saved);
      }
      setLoaded(true);
    });
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_KEY, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(
      themeMode === "system"
        ? systemScheme === "light"
          ? "dark"
          : "light"
        : themeMode === "light"
          ? "dark"
          : "light",
    );
  }, [themeMode, systemScheme, setThemeMode]);

  const colorScheme: ResolvedTheme =
    themeMode === "system" ? systemScheme : themeMode;

  const isDark = colorScheme === "dark";

  if (!loaded) return null;

  return (
    <ThemeContext.Provider
      value={{ themeMode, colorScheme, setThemeMode, toggleTheme, isDark }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
