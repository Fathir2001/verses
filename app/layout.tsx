import { RootLayoutClient } from "@/components/RootLayoutClient";
import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  metadataBase: new URL("https://think-different-td.netlify.app"),
  title: {
    template: "%s | Think Different",
    default: "Think Different - Islamic Comfort & Guidance",
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
  authors: [{ name: "Think Different" }],
  icons: {
    icon: "/enhanced_image.png",
    shortcut: "/enhanced_image.png",
    apple: "/enhanced_image.png",
  },
  openGraph: {
    title: "Think Different - Islamic Comfort & Guidance",
    description:
      "Find comfort and spiritual guidance through Islamic teachings when you need it most.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/enhanced_image.png",
        width: 512,
        height: 512,
        alt: "Think Different - Islamic Comfort & Guidance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Think Different - Islamic Comfort & Guidance",
    description:
      "Find comfort and spiritual guidance through Islamic teachings when you need it most.",
    images: ["/enhanced_image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
