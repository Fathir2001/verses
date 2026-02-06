export interface QuranVerse {
  _id?: string;
  arabic: string;
  text: string;
  reference: string;
}

export interface Dua {
  _id?: string;
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
  // Arrays of verses and duas linked to this feeling
  verses?: QuranVerse[];
  duas?: Dua[];
  // Backward compatibility - single verse/dua (first from arrays)
  quran?: QuranVerse;
  dua?: Dua;
  actions: string[];
}
