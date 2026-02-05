"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewVersePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    suraNumber: "",
    verseNumber: "",
    arabicText: "",
    translationText: "",
    transliteration: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await api.createVerse({
        suraNumber: parseInt(formData.suraNumber),
        verseNumber: parseInt(formData.verseNumber),
        arabicText: formData.arabicText,
        translationText: formData.translationText,
        transliteration: formData.transliteration || undefined,
      });
      router.push("/admin/verses");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border border-white/10 
                      bg-white/5 backdrop-blur-sm text-white placeholder-slate-400
                      focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50
                      transition-all duration-200`;

  const labelClass = "block text-sm font-medium text-slate-300 mb-2";

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
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Add New Verse
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            Add a new Quran verse to the database
          </motion.p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 backdrop-blur-sm"
          >
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
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6"
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
                  placeholder="1-114"
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
                  placeholder="Verse #"
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
                placeholder="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
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
                placeholder="In the name of Allah, the Most Gracious, the Most Merciful"
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
                placeholder="Bismillahir Rahmanir Raheem (optional)"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
            <Link
              href="/admin/verses"
              className="flex-1 px-6 py-4 rounded-xl border border-white/20 text-slate-300
                       hover:bg-white/10 hover:text-white text-center font-medium transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500
                       hover:shadow-lg hover:shadow-amber-500/25 text-white font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all
                       flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Verse
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </AdminSidebar>
  );
}
