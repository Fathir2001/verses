// Curated Islamic quotes for pull-down reveal on home screen

export interface IslamicQuote {
  arabic: string;
  text: string;
  source: string;
}

const ISLAMIC_QUOTES: IslamicQuote[] = [
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    text: "Indeed, with hardship comes ease.",
    source: "Quran 94:6",
  },
  {
    arabic: "وَبَشِّرِ الصَّابِرِينَ",
    text: "And give good tidings to the patient.",
    source: "Quran 2:155",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    text: "So remember Me; I will remember you.",
    source: "Quran 2:152",
  },
  {
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    text: "And whoever relies upon Allah – then He is sufficient for him.",
    source: "Quran 65:3",
  },
  {
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    text: "Verily, in the remembrance of Allah do hearts find rest.",
    source: "Quran 13:28",
  },
  {
    arabic: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    text: "And your Lord is going to give you, and you will be satisfied.",
    source: "Quran 93:5",
  },
  {
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي",
    text: "My Lord, expand for me my chest.",
    source: "Quran 20:25",
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    text: "Indeed, Allah is with the patient.",
    source: "Quran 2:153",
  },
  {
    arabic: "مَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْرًا وَأَوْسَعَ مِنَ الصَّبْرِ",
    text: "No one is granted a gift better and more comprehensive than patience.",
    source: "Sahih al-Bukhari 1469",
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    text: "Our Lord, give us good in this world and good in the Hereafter.",
    source: "Quran 2:201",
  },
  {
    arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
    text: "And He is with you wherever you are.",
    source: "Quran 57:4",
  },
  {
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    text: "Sufficient for us is Allah, and He is the best Disposer of affairs.",
    source: "Quran 3:173",
  },
];

/** Get a random Islamic quote */
export function getRandomQuote(): IslamicQuote {
  return ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
}
