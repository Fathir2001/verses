"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, CreateFeelingInput } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewFeelingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CreateFeelingInput>({
    slug: "",
    title: "",
    emoji: "",
    preview: "",
    reminder: "",
    quran: {
      text: "",
      reference: "",
      suraNumber: null,
      verseNumber: null,
    },
    dua: {
      arabic: "",
      transliteration: "",
      meaning: "",
      reference: "",
    },
    actions: [""],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const cleanedData = {
        ...formData,
        actions: formData.actions.filter((a) => a.trim() !== ""),
      };
      await api.createFeeling(cleanedData);
      router.push("/admin/feelings");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create feeling");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string | number | null) => {
    const keys = field.split(".");
    if (keys.length === 1) {
      setFormData({ ...formData, [field]: value });
    } else if (keys.length === 2) {
      setFormData({
        ...formData,
        [keys[0]]: {
          ...(formData[keys[0] as keyof CreateFeelingInput] as object),
          [keys[1]]: value,
        },
      });
    }
  };

  const addAction = () => {
    setFormData({ ...formData, actions: [...formData.actions, ""] });
  };

  const updateAction = (index: number, value: string) => {
    const newActions = [...formData.actions];
    newActions[index] = value;
    setFormData({ ...formData, actions: newActions });
  };

  const removeAction = (index: number) => {
    const newActions = formData.actions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      actions: newActions.length > 0 ? newActions : [""],
    });
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border border-white/10 
                      bg-white/5 backdrop-blur-sm text-white placeholder-slate-400
                      focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                      transition-all duration-200`;

  const labelClass = "block text-sm font-medium text-slate-300 mb-2";

  return (
    <AdminSidebar>
      <div className="max-w-4xl">
        <div className="mb-8">
          <Link
            href="/admin/feelings"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-4"
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
            Back to Feelings
          </Link>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Add New Feeling
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            Create a new emotional state with Islamic guidance
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
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className={inputClass}
                  placeholder="e.g., feeling-anxious"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Feeling Anxious"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Emoji *</label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => updateField("emoji", e.target.value)}
                  className={inputClass}
                  placeholder="e.g., 😰"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Preview *</label>
                <input
                  type="text"
                  value={formData.preview}
                  onChange={(e) => updateField("preview", e.target.value)}
                  className={inputClass}
                  placeholder="Short preview text"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClass}>Reminder *</label>
              <textarea
                value={formData.reminder}
                onChange={(e) => updateField("reminder", e.target.value)}
                className={`${inputClass} min-h-[100px]`}
                placeholder="A comforting reminder..."
                required
              />
            </div>
          </div>

          {/* Quran Section */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </span>
              Quran Reference
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Verse Text *</label>
                <textarea
                  value={formData.quran.text}
                  onChange={(e) => updateField("quran.text", e.target.value)}
                  className={`${inputClass} min-h-[100px]`}
                  dir="rtl"
                  placeholder="Arabic verse text..."
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Reference *</label>
                <input
                  type="text"
                  value={formData.quran.reference}
                  onChange={(e) =>
                    updateField("quran.reference", e.target.value)
                  }
                  className={inputClass}
                  placeholder="e.g., Surah Al-Baqarah 2:286"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Sura Number</label>
                  <input
                    type="number"
                    min="1"
                    max="114"
                    value={formData.quran.suraNumber || ""}
                    onChange={(e) =>
                      updateField(
                        "quran.suraNumber",
                        e.target.value ? parseInt(e.target.value) : null,
                      )
                    }
                    className={inputClass}
                    placeholder="1-114"
                  />
                </div>
                <div>
                  <label className={labelClass}>Verse Number</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quran.verseNumber || ""}
                    onChange={(e) =>
                      updateField(
                        "quran.verseNumber",
                        e.target.value ? parseInt(e.target.value) : null,
                      )
                    }
                    className={inputClass}
                    placeholder="Verse #"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dua Section */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                  />
                </svg>
              </span>
              Dua (Supplication)
            </h2>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>Arabic *</label>
                <textarea
                  value={formData.dua.arabic}
                  onChange={(e) => updateField("dua.arabic", e.target.value)}
                  className={`${inputClass} min-h-[100px]`}
                  dir="rtl"
                  placeholder="Arabic dua text..."
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Transliteration *</label>
                <textarea
                  value={formData.dua.transliteration}
                  onChange={(e) =>
                    updateField("dua.transliteration", e.target.value)
                  }
                  className={`${inputClass} min-h-[80px]`}
                  placeholder="Transliteration..."
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Meaning *</label>
                <textarea
                  value={formData.dua.meaning}
                  onChange={(e) => updateField("dua.meaning", e.target.value)}
                  className={`${inputClass} min-h-[80px]`}
                  placeholder="English meaning..."
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Reference *</label>
                <input
                  type="text"
                  value={formData.dua.reference}
                  onChange={(e) => updateField("dua.reference", e.target.value)}
                  className={inputClass}
                  placeholder="e.g., Sahih Bukhari"
                  required
                />
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </span>
                Suggested Actions
              </h2>
              <button
                type="button"
                onClick={addAction}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 
                         text-slate-300 hover:text-white transition-all text-sm"
              >
                <svg
                  className="w-4 h-4"
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
                Add Action
              </button>
            </div>

            <div className="space-y-3">
              {formData.actions.map((action, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={action}
                    onChange={(e) => updateAction(index, e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder={`Action ${index + 1}`}
                  />
                  {formData.actions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAction(index)}
                      className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 
                               hover:text-red-300 transition-all"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/admin/feelings"
              className="flex-1 px-6 py-4 rounded-xl border border-white/20 text-slate-300
                       hover:bg-white/10 hover:text-white text-center font-medium transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
                       hover:shadow-lg hover:shadow-emerald-500/25 text-white font-medium
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
                  Create Feeling
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </AdminSidebar>
  );
}
