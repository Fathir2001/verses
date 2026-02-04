import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Feelings",
  description:
    "Browse through different emotions and find Islamic comfort, Quranic verses, duas, and gentle reminders for each feeling.",
};

export default function FeelingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
