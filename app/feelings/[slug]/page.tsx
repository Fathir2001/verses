import { api } from "@/lib/api";
import {
  getAllSlugs,
  getFeelingBySlug as getLocalFeeling,
} from "@/lib/feelings";
import type { Feeling } from "@/types/feeling";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import FeelingDetailClient from "./FeelingDetailClient";

interface FeelingPageProps {
  params: { slug: string };
}

// Fetch feeling from API, transforming response to match client type
async function getFeelingFromAPI(slug: string): Promise<Feeling | null> {
  try {
    const response = await api.getFeelingBySlug(slug);
    if (!response.data) return null;

    const data = response.data;
    // Transform API response to match Feeling type
    return {
      slug: data.slug,
      title: data.title,
      emoji: data.emoji,
      preview: data.preview,
      reminder: data.reminder,
      actions: data.actions || [],
      // Map verses array to expected format
      verses: data.verses?.map((v) => ({
        _id: v._id,
        arabic: v.arabicText,
        text: v.translationText,
        reference: v.reference || `Qur'an ${v.suraNumber}:${v.verseNumber}`,
      })),
      // Map duas array to expected format
      duas: data.duas?.map((d) => ({
        _id: d._id,
        arabic: d.arabic,
        transliteration: d.transliteration,
        meaning: d.meaning,
        reference: d.reference,
      })),
      // Backward compatibility - single verse/dua
      quran: data.quran
        ? {
            arabic: data.quran.arabicText,
            text: data.quran.translationText,
            reference:
              data.quran.reference ||
              `Qur'an ${data.quran.suraNumber}:${data.quran.verseNumber}`,
          }
        : undefined,
      dua: data.dua
        ? {
            arabic: data.dua.arabic,
            transliteration: data.dua.transliteration,
            meaning: data.dua.meaning,
            reference: data.dua.reference,
          }
        : undefined,
    };
  } catch (error) {
    console.error("Error fetching feeling from API:", error);
    return null;
  }
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FeelingPageProps): Promise<Metadata> {
  // Use local data for metadata (faster, static)
  const feeling = getLocalFeeling(params.slug);

  if (!feeling) {
    return {
      title: "Feeling Not Found",
    };
  }

  return {
    title: `Feeling ${feeling.title}`,
    description: `${feeling.preview} Find Quranic verses, duas, and comfort for when you're feeling ${feeling.title.toLowerCase()}.`,
    openGraph: {
      title: `Feeling ${feeling.title} ${feeling.emoji} | Think Different`,
      description: feeling.preview,
      images: ["/enhanced_image.png"],
    },
  };
}

export default async function FeelingPage({ params }: FeelingPageProps) {
  // Start with local data for instant render (no network dependency)
  const localFeeling = getLocalFeeling(params.slug);
  if (!localFeeling) {
    notFound();
  }

  // Try API in parallel for enriched data (verses/duas arrays), with a short timeout
  // If API fails or is slow (e.g. Render cold-start), local data is already available
  let feeling: Feeling = localFeeling;
  try {
    const apiFeeling = await Promise.race([
      getFeelingFromAPI(params.slug),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);
    if (apiFeeling) {
      feeling = apiFeeling;
    }
  } catch {
    // API failed — use local data silently
  }

  return <FeelingDetailClient feeling={feeling} />;
}
