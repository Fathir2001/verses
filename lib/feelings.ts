import feelingsData from "@/data/feelings.json";
import { Feeling } from "@/types/feeling";

export function getAllFeelings(): Feeling[] {
  return feelingsData as Feeling[];
}

export function getFeelingBySlug(slug: string): Feeling | undefined {
  return (feelingsData as Feeling[]).find((feeling) => feeling.slug === slug);
}

export function getAllSlugs(): string[] {
  return (feelingsData as Feeling[]).map((feeling) => feeling.slug);
}

export function searchFeelings(query: string): Feeling[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return getAllFeelings();

  return (feelingsData as Feeling[]).filter(
    (feeling) =>
      feeling.title.toLowerCase().includes(lowerQuery) ||
      feeling.preview.toLowerCase().includes(lowerQuery) ||
      feeling.emoji.includes(query),
  );
}
