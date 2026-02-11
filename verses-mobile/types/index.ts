// Types - reused from web app with mobile-specific additions

export interface QuranVerse {
  _id?: string;
  arabic: string;
  text: string;
  reference: string;
}

export interface Dua {
  _id?: string;
  title?: string;
  slug?: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  reference?: string;
  category?: string;
  benefits?: string;
}

export interface Feeling {
  _id?: string;
  slug: string;
  title: string;
  emoji: string;
  preview: string;
  reminder: string;
  verses?: QuranVerse[];
  duas?: Dua[];
  quran?: QuranVerse | null;
  dua?: Dua | null;
  actions: string[];
}

export interface IslamicDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
}
