export interface Quote {
  id: number;
  arabic: string;
  text: string;
  source: string;
  type: "hadith" | "quran";
}

export interface QuoteCategory {
  id: string;
  name: string;
  emoji: string;
  quotes: Quote[];
}

export interface QuotesData {
  categories: QuoteCategory[];
}
