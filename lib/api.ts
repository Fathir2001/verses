// API client for backend communication

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage if available (client-side only)
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("admin_token");
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("admin_token", token);
      } else {
        localStorage.removeItem("admin_token");
      }
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || "Request failed",
          response.status,
          data.errors,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Network error. Please check your connection.", 0);
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{
      token: string;
      admin: { id: string; email: string; role: string };
    }>("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async getMe() {
    return this.request<{
      id: string;
      email: string;
      role: string;
      createdAt: string;
    }>("/auth/admin/me");
  }

  logout() {
    this.setToken(null);
  }

  // Public Feelings endpoints
  async getFeelings() {
    return this.request<Feeling[]>("/feelings");
  }

  async getFeelingBySlug(slug: string) {
    return this.request<Feeling>(`/feelings/${slug}`);
  }

  // Admin Feelings endpoints
  async getAdminFeelings(page = 1, limit = 20) {
    return this.request<Feeling[]>(
      `/admin/feelings?page=${page}&limit=${limit}`,
    );
  }

  async getAdminFeelingById(id: string) {
    return this.request<Feeling>(`/admin/feelings/${id}`);
  }

  async createFeeling(feeling: CreateFeelingInput) {
    return this.request<Feeling>("/admin/feelings", {
      method: "POST",
      body: JSON.stringify(feeling),
    });
  }

  async updateFeeling(id: string, feeling: Partial<CreateFeelingInput>) {
    return this.request<Feeling>(`/admin/feelings/${id}`, {
      method: "PUT",
      body: JSON.stringify(feeling),
    });
  }

  async deleteFeeling(id: string) {
    return this.request<{ id: string }>(`/admin/feelings/${id}`, {
      method: "DELETE",
    });
  }

  // Admin Sura endpoints
  async getAdminSuras(page = 1, limit = 50) {
    return this.request<Sura[]>(`/admin/suras?page=${page}&limit=${limit}`);
  }

  async createSura(sura: CreateSuraInput) {
    return this.request<Sura>("/admin/suras", {
      method: "POST",
      body: JSON.stringify(sura),
    });
  }

  async updateSura(id: string, sura: Partial<CreateSuraInput>) {
    return this.request<Sura>(`/admin/suras/${id}`, {
      method: "PUT",
      body: JSON.stringify(sura),
    });
  }

  async deleteSura(id: string) {
    return this.request<{ id: string }>(`/admin/suras/${id}`, {
      method: "DELETE",
    });
  }

  async getAdminSuraById(id: string) {
    return this.request<Sura>(`/admin/suras/${id}`);
  }

  // Admin Verse endpoints
  async getAdminVerses(page = 1, limit = 50, suraNumber?: number) {
    let url = `/admin/verses?page=${page}&limit=${limit}`;
    if (suraNumber) {
      url += `&suraNumber=${suraNumber}`;
    }
    return this.request<Verse[]>(url);
  }

  async createVerse(verse: CreateVerseInput) {
    return this.request<Verse>("/admin/verses", {
      method: "POST",
      body: JSON.stringify(verse),
    });
  }

  async updateVerse(id: string, verse: Partial<CreateVerseInput>) {
    return this.request<Verse>(`/admin/verses/${id}`, {
      method: "PUT",
      body: JSON.stringify(verse),
    });
  }

  async deleteVerse(id: string) {
    return this.request<{ id: string }>(`/admin/verses/${id}`, {
      method: "DELETE",
    });
  }

  async getAdminVerseById(id: string) {
    return this.request<Verse>(`/admin/verses/${id}`);
  }

  // Admin Dua endpoints
  async getAdminDuas(page = 1, limit = 20) {
    return this.request<Dua[]>(`/admin/duas?page=${page}&limit=${limit}`);
  }

  async getAdminDuaById(id: string) {
    return this.request<Dua>(`/admin/duas/${id}`);
  }

  async createDua(dua: CreateDuaInput) {
    return this.request<Dua>("/admin/duas", {
      method: "POST",
      body: JSON.stringify(dua),
    });
  }

  async updateDua(id: string, dua: Partial<CreateDuaInput>) {
    return this.request<Dua>(`/admin/duas/${id}`, {
      method: "PUT",
      body: JSON.stringify(dua),
    });
  }

  async deleteDua(id: string) {
    return this.request<{ id: string }>(`/admin/duas/${id}`, {
      method: "DELETE",
    });
  }

  // Public Dua endpoints
  async getDuas() {
    return this.request<Dua[]>("/duas");
  }

  async getDuaBySlug(slug: string) {
    return this.request<Dua>(`/duas/${slug}`);
  }
}

// Error class
export class ApiError extends Error {
  status: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    status: number,
    errors?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

// Types
export interface Feeling {
  _id?: string;
  slug: string;
  title: string;
  emoji: string;
  preview: string;
  reminder: string;
  quran: {
    text: string;
    reference: string;
    suraNumber?: number;
    verseNumber?: number;
  };
  dua: {
    arabic: string;
    transliteration: string;
    meaning: string;
    reference: string;
  };
  actions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFeelingInput {
  slug: string;
  title: string;
  emoji?: string;
  preview: string;
  reminder: string;
  quran: {
    text: string;
    reference: string;
    suraNumber?: number | null;
    verseNumber?: number | null;
  };
  dua: {
    arabic?: string;
    transliteration?: string;
    meaning: string;
    reference?: string;
  };
  actions: string[];
}

export interface Sura {
  _id: string;
  suraNumber: number;
  nameArabic: string;
  nameEnglish: string;
  transliteration: string;
  totalVerses: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSuraInput {
  suraNumber: number;
  nameArabic?: string;
  nameEnglish?: string;
  transliteration?: string;
  totalVerses?: number | null;
}

export interface Verse {
  _id: string;
  suraNumber: number;
  verseNumber: number;
  arabicText: string;
  translationText: string;
  transliteration: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVerseInput {
  suraNumber: number;
  verseNumber: number;
  arabicText: string;
  translationText: string;
  transliteration?: string;
  reference?: string;
}

export interface Dua {
  _id: string;
  title: string;
  slug: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  reference: string;
  category: string;
  benefits: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDuaInput {
  title: string;
  slug: string;
  arabic: string;
  transliteration?: string;
  meaning: string;
  reference?: string;
  category?: string;
  benefits?: string;
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);
