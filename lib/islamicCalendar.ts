// Islamic calendar utilities
// Uses Aladhan API for accurate Islamic dates with fallback to algorithmic conversion

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

// Cache for API responses to avoid excessive API calls
let cachedDate: { gregorian: string; islamic: IslamicDate } | null = null;

// Fallback: Approximate conversion from Gregorian to Hijri using Julian Day Number
function toIslamicDateFallback(gregorianDate: Date): IslamicDate {
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

// Convert Gregorian date to Islamic date using Aladhan API
export async function toIslamicDate(gregorianDate: Date): Promise<IslamicDate> {
  const dateString = `${String(gregorianDate.getDate()).padStart(2, "0")}-${String(gregorianDate.getMonth() + 1).padStart(2, "0")}-${gregorianDate.getFullYear()}`;

  // Check cache
  if (cachedDate && cachedDate.gregorian === dateString) {
    return cachedDate.islamic;
  }

  try {
    // Fetch from Aladhan API
    const response = await fetch(
      `https://api.aladhan.com/v1/gToH/${dateString}`,
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    if (data.code === 200 && data.data?.hijri) {
      const hijri = data.data.hijri;

      // Apply -1 day adjustment to match ACJU (Sri Lanka) calendar
      // Different organizations use different moon sighting methods
      let adjustedDay = parseInt(hijri.day) - 1;
      let adjustedMonth = parseInt(hijri.month.number);
      let adjustedYear = parseInt(hijri.year);
      let monthName = hijri.month.en;

      // Handle day underflow (going to previous month)
      if (adjustedDay < 1) {
        adjustedMonth--;
        if (adjustedMonth < 1) {
          adjustedMonth = 12;
          adjustedYear--;
        }
        // Islamic months are typically 29 or 30 days
        adjustedDay = 29; // Simplified, most months have 29-30 days
        monthName = ISLAMIC_MONTHS[adjustedMonth - 1];
      }

      const islamicDate: IslamicDate = {
        day: adjustedDay,
        month: adjustedMonth,
        monthName: monthName,
        year: adjustedYear,
      };

      // Cache the result
      cachedDate = { gregorian: dateString, islamic: islamicDate };

      return islamicDate;
    }

    throw new Error("Invalid API response");
  } catch (error) {
    console.warn(
      "Failed to fetch Islamic date from API, using fallback:",
      error,
    );
    // Fallback to algorithmic conversion
    return toIslamicDateFallback(gregorianDate);
  }
}

// Synchronous version for backwards compatibility (uses cached value or fallback)
export function toIslamicDateSync(gregorianDate: Date): IslamicDate {
  const dateString = `${String(gregorianDate.getDate()).padStart(2, "0")}-${String(gregorianDate.getMonth() + 1).padStart(2, "0")}-${gregorianDate.getFullYear()}`;

  // Return cached value if available
  if (cachedDate && cachedDate.gregorian === dateString) {
    return cachedDate.islamic;
  }

  // Otherwise use fallback
  return toIslamicDateFallback(gregorianDate);
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
export async function getCurrentOccasion(): Promise<SpecialOccasion | null> {
  const now = new Date();
  const islamicDate = await toIslamicDate(now);

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
