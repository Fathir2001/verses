"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, Feeling } from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditVersePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [formData, setFormData] = useState({
    suraNumber: "",
    verseNumber: "",
    arabicText: "",
    translationText: "",
    transliteration: "",
    feelingId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [verseRes, feelingsRes] = await Promise.all([
          api.getAdminVerseById(id),
          api.getAdminFeelings(1, 100),
        ]);
        if (feelingsRes.data) setFeelings(feelingsRes.data);
        if (verseRes.data) {
          const verse = verseRes.data;
          const feelingId =
            typeof verse.feeling === "object"
              ? verse.feeling?._id
              : verse.feeling;
          setFormData({
            suraNumber: verse.suraNumber.toString(),
            verseNumber: verse.verseNumber.toString(),
            arabicText: verse.arabicText,
            translationText: verse.translationText,
            transliteration: verse.transliteration || "",
            feelingId: feelingId || "",
          });
        }
      } catch (err) {
        if (err instanceof ApiError) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await api.updateVerse(id, {
        arabicText: formData.arabicText,
        translationText: formData.translationText,
        transliteration: formData.transliteration || undefined,
        feelingId: formData.feelingId || null,
      });
      router.push("/admin/verses");
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200`;
  const labelClass = "block text-sm font-medium text-slate-300 mb-2";

  if (isLoading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400"></div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div className="max-w-2xl">
        <div className="mb-8">
          <Link
            href="/admin/verses"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-4"
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
            Back to Verses
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">
            Edit Verse
          </h1>
          <p className="text-slate-400 animate-fade-in-up animate-delay-100">
            Update this Quran verse
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
                  required
                  min="1"
                  max="114"
                  value={formData.suraNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, suraNumber: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Verse Number *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.verseNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, verseNumber: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Arabic Text *</label>
              <textarea
                required
                value={formData.arabicText}
                onChange={(e) =>
                  setFormData({ ...formData, arabicText: e.target.value })
                }
                className={`${inputClass} min-h-[120px] text-xl leading-relaxed`}
                dir="rtl"
              />
            </div>
            <div>
              <label className={labelClass}>Translation *</label>
              <textarea
                required
                value={formData.translationText}
                onChange={(e) =>
                  setFormData({ ...formData, translationText: e.target.value })
                }
                className={`${inputClass} min-h-[100px]`}
              />
            </div>
            <div>
              <label className={labelClass}>Transliteration</label>
              <textarea
                value={formData.transliteration}
                onChange={(e) =>
                  setFormData({ ...formData, transliteration: e.target.value })
                }
                className={`${inputClass} min-h-[80px]`}
                placeholder="Optional"
              />
            </div>
            <div>
              <label className={labelClass}>Link to Feeling</label>
              <select
                value={formData.feelingId}
                onChange={(e) =>
                  setFormData({ ...formData, feelingId: e.target.value })
                }
                className={inputClass}
              >
                <option value="">-- No feeling (standalone verse) --</option>
                {feelings.map((feeling) => (
                  <option key={feeling._id} value={feeling._id}>
                    {feeling.emoji} {feeling.title}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-slate-500">
                Select a feeling to link this verse to.
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
            <Link
              href="/admin/verses"
              className="flex-1 px-6 py-4 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 hover:text-white text-center font-medium transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg hover:shadow-amber-500/25 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
