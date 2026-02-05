import { AnimatedBackground, Navbar, ThemeProvider } from "@/components";
import { FavoritesProvider } from "@/context";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0fdf4" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export const metadata: Metadata = {
  title: {
    template: "%s | I Am Feeling",
    default: "I Am Feeling - Islamic Comfort & Guidance",
  },
  description:
    "Find comfort and spiritual guidance through Islamic teachings when you need it most. Quranic verses, duas, and gentle reminders for every emotion.",
  keywords: [
    "Islamic",
    "emotional support",
    "Quran",
    "dua",
    "spiritual",
    "comfort",
    "mental health",
    "Muslim",
  ],
  authors: [{ name: "I Am Feeling" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "I Am Feeling - Islamic Comfort & Guidance",
    description:
      "Find comfort and spiritual guidance through Islamic teachings when you need it most.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "I Am Feeling - Islamic Comfort & Guidance",
    description:
      "Find comfort and spiritual guidance through Islamic teachings when you need it most.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FavoritesProvider>
            <AnimatedBackground />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <footer className="py-6 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-300 text-glow">
                  Made with 💚 for the Ummah
                </p>
                <div className="flex items-center justify-center gap-2">
                  <img
                    src="/enhanced_image.png"
                    alt="Think Different Logo"
                    className="w-6 h-6 object-contain"
                  />
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-400 text-glow">
                    © 2026 Think_Different
                  </p>
                </div>
              </footer>
            </div>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
