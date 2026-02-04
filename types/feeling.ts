export interface QuranVerse {
  text: string;
  reference: string;
}

export interface Dua {
  arabic?: string;
  transliteration: string;
  meaning: string;
  reference?: string;
}

export interface Feeling {
  slug: string;
  title: string;
  emoji: string;
  preview: string;
  reminder: string;
  quran: QuranVerse;
  dua: Dua;
  actions: string[];
}
