import quotesData from "@/data/quotes.json";
import type { Quote, QuoteCategory, QuotesData } from "@/types/quote";

const data = quotesData as QuotesData;

export function getAllCategories(): QuoteCategory[] {
  return data.categories;
}

export function getCategoryById(id: string): QuoteCategory | undefined {
  return data.categories.find((category) => category.id === id);
}

export function getAllQuotes(): Quote[] {
  return data.categories.flatMap((category) => category.quotes);
}

export function getRandomQuote(): Quote {
  const allQuotes = getAllQuotes();
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[randomIndex];
}

export function getDailyQuote(): Quote {
  const allQuotes = getAllQuotes();
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const seed = today.getFullYear() * 366 + dayOfYear;
  const index = seed % allQuotes.length;
  return allQuotes[index];
}

export function searchQuotes(query: string): Quote[] {
  if (!query.trim()) return getAllQuotes();

  const lowerQuery = query.toLowerCase();
  return getAllQuotes().filter(
    (quote) =>
      quote.text.toLowerCase().includes(lowerQuery) ||
      quote.source.toLowerCase().includes(lowerQuery) ||
      quote.arabic.includes(query),
  );
}
