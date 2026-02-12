// API Client for the mobile app
// This talks to your same backend server

import { Dua, Feeling, IslamicDate } from "@/types";

// IMPORTANT: Change this to your backend URL
// - For Android emulator: http://10.0.2.2:5000/api
// - For iOS simulator: http://localhost:5000/api
// - For physical device on same WiFi: http://YOUR_PC_IP:5000/api
// - For production: https://your-backend-url.com/api
const API_BASE_URL = "https://verses.onrender.com/api";

// Helper to make API calls
async function fetchApi<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    const data = await response.json();

    if (data.success && data.data) {
      return data.data as T;
    }
    return null;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    return null;
  }
}

// ==========================================
// PUBLIC API ENDPOINTS (no auth needed)
// ==========================================

// Get all feelings
export async function getFeelings(): Promise<Feeling[]> {
  const data = await fetchApi<Feeling[]>("/feelings");
  return data || [];
}

// Get a single feeling by slug
export async function getFeelingBySlug(slug: string): Promise<Feeling | null> {
  return fetchApi<Feeling>(`/feelings/${slug}`);
}

// Get all duas
export async function getDuas(): Promise<Dua[]> {
  const data = await fetchApi<Dua[]>("/duas");
  return data || [];
}

// ==========================================
// ISLAMIC DATE (Aladhan API)
// ==========================================

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

export async function getIslamicDate(
  date: Date = new Date(),
): Promise<IslamicDate> {
  const dateString = `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}-${date.getFullYear()}`;

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/gToH/${dateString}`,
    );
    const data = await response.json();

    if (data.code === 200 && data.data?.hijri) {
      const hijri = data.data.hijri;

      // Apply -1 day adjustment to match ACJU (Sri Lanka) calendar
      let adjustedDay = parseInt(hijri.day) - 1;
      let adjustedMonth = parseInt(hijri.month.number);
      let adjustedYear = parseInt(hijri.year);
      let monthName = hijri.month.en;

      if (adjustedDay < 1) {
        adjustedMonth--;
        if (adjustedMonth < 1) {
          adjustedMonth = 12;
          adjustedYear--;
        }
        adjustedDay = 29;
        monthName = ISLAMIC_MONTHS[adjustedMonth - 1];
      }

      return {
        day: adjustedDay,
        month: adjustedMonth,
        monthName,
        year: adjustedYear,
      };
    }
    throw new Error("Invalid API response");
  } catch {
    // Fallback: simplified calculation
    return fallbackIslamicDate(date);
  }
}

function fallbackIslamicDate(date: Date): IslamicDate {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  const jd =
    Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4) +
    Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12) -
    Math.floor(
      (3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4,
    ) +
    d -
    32075;

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

export function formatIslamicDate(islamicDate: IslamicDate): string {
  return `${islamicDate.day} ${islamicDate.monthName} ${islamicDate.year} AH`;
}
