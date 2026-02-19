// Premium color palette matching the website's Islamic theme
// Glassmorphism-inspired with rich gradients and deep shadows

const Colors = {
  light: {
    // Backgrounds
    background: "#F0F4F8",
    card: "rgba(255, 255, 255, 0.92)",
    cardSolid: "#FFFFFF",
    cardBorder: "rgba(226, 232, 240, 0.8)",
    glassBg: "rgba(255, 255, 255, 0.7)",
    glassBorder: "rgba(226, 232, 240, 0.6)",

    // Text
    text: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",

    // Brand colors - Emerald/Teal Islamic theme
    primary: "#10B981",
    primaryDark: "#059669",
    primaryLight: "#D1FAE5",
    primaryGlow: "rgba(16, 185, 129, 0.15)",
    accent: "#14B8A6",
    accentLight: "#CCFBF1",

    // Gradient pairs
    gradientStart: "#10B981",
    gradientEnd: "#0D9488",
    gradientGoldStart: "#F59E0B",
    gradientGoldEnd: "#D97706",
    gradientPurpleStart: "#8B5CF6",
    gradientPurpleEnd: "#7C3AED",

    // Special
    gold: "#F59E0B",
    goldLight: "#FEF3C7",
    goldGlow: "rgba(245, 158, 11, 0.12)",
    purple: "#8B5CF6",
    purpleLight: "#EDE9FE",
    purpleGlow: "rgba(139, 92, 246, 0.12)",
    red: "#EF4444",
    pink: "#EC4899",

    // Tab bar
    tabBar: "rgba(255, 255, 255, 0.95)",
    tabBarBorder: "rgba(226, 232, 240, 0.5)",
    tabActive: "#10B981",
    tabInactive: "#94A3B8",

    // Shadows
    shadowColor: "rgba(15, 23, 42, 0.08)",
    shadowHeavy: "rgba(15, 23, 42, 0.15)",

    // Status bar
    statusBar: "dark" as const,
  },
  dark: {
    // Backgrounds
    background: "#0B1120",
    card: "rgba(30, 41, 59, 0.9)",
    cardSolid: "#1E293B",
    cardBorder: "rgba(51, 65, 85, 0.7)",
    glassBg: "rgba(30, 41, 59, 0.7)",
    glassBorder: "rgba(51, 65, 85, 0.5)",

    // Text
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",

    // Brand colors
    primary: "#34D399",
    primaryDark: "#10B981",
    primaryLight: "rgba(6, 78, 59, 0.5)",
    primaryGlow: "rgba(52, 211, 153, 0.15)",
    accent: "#2DD4BF",
    accentLight: "rgba(4, 47, 46, 0.5)",

    // Gradient pairs
    gradientStart: "#34D399",
    gradientEnd: "#14B8A6",
    gradientGoldStart: "#FBBF24",
    gradientGoldEnd: "#F59E0B",
    gradientPurpleStart: "#A78BFA",
    gradientPurpleEnd: "#8B5CF6",

    // Special
    gold: "#FBBF24",
    goldLight: "rgba(120, 53, 15, 0.4)",
    goldGlow: "rgba(251, 191, 36, 0.1)",
    purple: "#A78BFA",
    purpleLight: "rgba(76, 29, 149, 0.4)",
    purpleGlow: "rgba(167, 139, 250, 0.1)",
    red: "#F87171",
    pink: "#F472B6",

    // Tab bar
    tabBar: "rgba(15, 23, 42, 0.95)",
    tabBarBorder: "rgba(51, 65, 85, 0.3)",
    tabActive: "#34D399",
    tabInactive: "#64748B",

    // Shadows
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowHeavy: "rgba(0, 0, 0, 0.5)",

    // Status bar
    statusBar: "light" as const,
  },
};

export default Colors;
