// Islamic calendar utilities
// Note: This is a simplified implementation. For production use, consider using libraries like hijri-date

interface IslamicDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
}

interface SpecialOccasion {
  name: string;
  emoji: string;
  message: string;
  type: "holy" | "blessed" | "special";
}

// Islamic month names
const ISLAMIC_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Shaban",
  "Ramadan",
  "Shawwal",
  "Dhul Qadah",
  "Dhul Hijjah",
];

// Approximate conversion from Gregorian to Hijri
// This is a simplified algorithm - for exact dates, use a proper library
export function toIslamicDate(gregorianDate: Date): IslamicDate {
  // Julian Day Number calculation
  const y = gregorianDate.getFullYear();
  const m = gregorianDate.getMonth() + 1;
  const d = gregorianDate.getDate();

  // Calculate Julian Day Number
  const jd =
    Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4) +
    Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12) -
    Math.floor(
      (3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4,
    ) +
    d -
    32075;

  // Convert Julian Day to Islamic Date
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;

  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return {
    day,
    month,
    monthName: ISLAMIC_MONTHS[month - 1] || "Unknown",
    year,
  };
}

// Check if today is Friday (Jummah)
export function isFriday(date: Date = new Date()): boolean {
  return date.getDay() === 5;
}

// Get special occasions for a given Islamic date
export function getSpecialOccasion(
  islamicDate: IslamicDate,
): SpecialOccasion | null {
  const { day, month } = islamicDate;

  // Ramadan
  if (month === 9) {
    if (day >= 1 && day <= 10) {
      return {
        name: "First 10 Days of Ramadan",
        emoji: "🌙",
        message: "The days of Mercy. May Allah shower His mercy upon you.",
        type: "holy",
      };
    }
    if (day >= 11 && day <= 20) {
      return {
        name: "Second 10 Days of Ramadan",
        emoji: "🤲",
        message: "The days of Forgiveness. May Allah forgive your sins.",
        type: "holy",
      };
    }
    if (day >= 21 && day <= 30) {
      return {
        name: "Last 10 Days of Ramadan",
        emoji: "⭐",
        message: "The days of seeking refuge from Hell. Seek Laylatul Qadr!",
        type: "holy",
      };
    }
  }

  // Eid ul-Fitr (1st Shawwal)
  if (month === 10 && day >= 1 && day <= 3) {
    return {
      name: "Eid ul-Fitr",
      emoji: "🎉",
      message: "Eid Mubarak! May Allah accept your fasting and prayers.",
      type: "special",
    };
  }

  // Eid ul-Adha (10th Dhul Hijjah)
  if (month === 12 && day >= 10 && day <= 13) {
    return {
      name: "Eid ul-Adha",
      emoji: "🐑",
      message: "Eid Mubarak! May Allah accept your sacrifice and prayers.",
      type: "special",
    };
  }

  // Day of Arafah (9th Dhul Hijjah)
  if (month === 12 && day === 9) {
    return {
      name: "Day of Arafah",
      emoji: "🕋",
      message: "Fasting on this day expiates sins of the past and coming year.",
      type: "blessed",
    };
  }

  // First 10 days of Dhul Hijjah
  if (month === 12 && day >= 1 && day <= 9) {
    return {
      name: "Blessed Days of Dhul Hijjah",
      emoji: "🌟",
      message: "No good deeds are better than those done in these days.",
      type: "blessed",
    };
  }

  // Ashura (10th Muharram)
  if (month === 1 && day === 10) {
    return {
      name: "Day of Ashura",
      emoji: "📿",
      message: "Fasting on this day expiates the sins of the previous year.",
      type: "blessed",
    };
  }

  // Mawlid al-Nabi (12th Rabi al-Awwal)
  if (month === 3 && day === 12) {
    return {
      name: "Mawlid al-Nabi",
      emoji: "💚",
      message: "Commemorating the birth of Prophet Muhammad ﷺ",
      type: "special",
    };
  }

  // Isra and Miraj (27th Rajab)
  if (month === 7 && day === 27) {
    return {
      name: "Isra and Miraj",
      emoji: "🌠",
      message: "The night journey and ascension of Prophet Muhammad ﷺ",
      type: "blessed",
    };
  }

  // Shab-e-Barat (15th Shaban)
  if (month === 8 && day === 15) {
    return {
      name: "Shab-e-Barat",
      emoji: "🌃",
      message: "The Night of Fortune and Forgiveness",
      type: "blessed",
    };
  }

  return null;
}

// Get Friday blessing
export function getFridayBlessing(): SpecialOccasion {
  return {
    name: "Jummah Mubarak",
    emoji: "🕌",
    message:
      "The best day the sun rises upon. Send blessings upon the Prophet ﷺ",
    type: "blessed",
  };
}

// Get current occasion (combines Islamic date occasions with Friday)
export function getCurrentOccasion(): SpecialOccasion | null {
  const now = new Date();
  const islamicDate = toIslamicDate(now);

  // Check for special Islamic occasions first
  const specialOccasion = getSpecialOccasion(islamicDate);
  if (specialOccasion) {
    return specialOccasion;
  }

  // Check if it's Friday
  if (isFriday(now)) {
    return getFridayBlessing();
  }

  return null;
}

// Format Islamic date as string
export function formatIslamicDate(islamicDate: IslamicDate): string {
  return `${islamicDate.day} ${islamicDate.monthName} ${islamicDate.year} AH`;
}
