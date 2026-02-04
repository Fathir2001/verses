import { getAllSlugs, getFeelingBySlug } from "@/lib/feelings";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import FeelingDetailClient from "./FeelingDetailClient";

interface FeelingPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FeelingPageProps): Promise<Metadata> {
  const feeling = getFeelingBySlug(params.slug);

  if (!feeling) {
    return {
      title: "Feeling Not Found",
    };
  }

  return {
    title: `Feeling ${feeling.title}`,
    description: `${feeling.preview} Find Quranic verses, duas, and comfort for when you're feeling ${feeling.title.toLowerCase()}.`,
    openGraph: {
      title: `I Am Feeling ${feeling.title} ${feeling.emoji}`,
      description: feeling.preview,
    },
  };
}

export default function FeelingPage({ params }: FeelingPageProps) {
  const feeling = getFeelingBySlug(params.slug);

  if (!feeling) {
    notFound();
  }

  return <FeelingDetailClient feeling={feeling} />;
}
