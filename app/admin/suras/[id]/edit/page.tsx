"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, CreateSuraInput } from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditSuraPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<CreateSuraInput>>({
    suraNumber: 1,
    nameArabic: "",
    nameEnglish: "",
    transliteration: "",
    totalVerses: null,
  });

  useEffect(() => {
    const fetchSura = async () => {
      try {
        const response = await api.getAdminSuraById(id);
        if (response.data) {
          const sura = response.data;
          setFormData({
            suraNumber: sura.suraNumber,
            nameArabic: sura.nameArabic,
            nameEnglish: sura.nameEnglish,
            transliteration: sura.transliteration,
            totalVerses: sura.totalVerses,
          });
        }
      } catch (err) {
        if (err instanceof ApiError) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSura();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.updateSura(id, formData);
      router.push("/admin/suras");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200`;
  const labelClass = "block text-sm font-medium text-slate-300 mb-2";

  if (isLoading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400"></div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="max-w-2xl">
        <div className="mb-8">
          <Link
            href="/admin/suras"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Suras
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">
            Edit Sura
          </h1>
          <p className="text-slate-400 animate-fade-in-up animate-delay-100">
            Update Quran chapter information
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 backdrop-blur-sm animate-fade-in-up">
            <p className="text-red-300 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 animate-fade-in-up"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Sura Number *</label>
                <input
                  type="number"
                  min="1"
                  max="114"
                  value={formData.suraNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      suraNumber: parseInt(e.target.value),
                    })
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Total Verses</label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalVerses || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalVerses: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Name (Arabic) *</label>
              <input
                type="text"
                value={formData.nameArabic}
                onChange={(e) =>
                  setFormData({ ...formData, nameArabic: e.target.value })
                }
                className={`${inputClass} text-xl`}
                dir="rtl"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Name (English) *</label>
              <input
                type="text"
                value={formData.nameEnglish}
                onChange={(e) =>
                  setFormData({ ...formData, nameEnglish: e.target.value })
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Transliteration *</label>
              <input
                type="text"
                value={formData.transliteration}
                onChange={(e) =>
                  setFormData({ ...formData, transliteration: e.target.value })
                }
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
            <Link
              href="/admin/suras"
              className="flex-1 px-6 py-4 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 hover:text-white text-center font-medium transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-lg hover:shadow-blue-500/25 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminSidebar>
  );
}
