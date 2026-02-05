"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, CreateDuaInput } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditDuaPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<CreateDuaInput>({
    title: "",
    slug: "",
    arabic: "",
    transliteration: "",
    meaning: "",
    reference: "",
    category: "",
    benefits: "",
  });

  useEffect(() => {
    const fetchDua = async () => {
      try {
        const response = await api.getAdminDuaById(id);
        if (response.data) {
          setFormData({
            title: response.data.title,
            slug: response.data.slug,
            arabic: response.data.arabic,
            transliteration: response.data.transliteration || "",
            meaning: response.data.meaning,
            reference: response.data.reference || "",
            category: response.data.category || "",
            benefits: response.data.benefits || "",
          });
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load dua");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDua();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await api.updateDua(id, formData);
      router.push("/admin/duas");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update dua");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
        </div>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar>
      <div>
        {/* Back Button */}
        <Link
          href="/admin/duas"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
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
          Back to Duas
        </Link>

        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Edit Dua
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            Update supplication details
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

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6"
        >
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                         placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50
                         transition-all"
                placeholder="e.g., Dua for Protection"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                         placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50
                         transition-all"
                placeholder="dua-for-protection"
              />
            </div>
          </div>

          {/* Arabic Text */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Arabic Text *
            </label>
            <textarea
              value={formData.arabic}
              onChange={(e) =>
                setFormData({ ...formData, arabic: e.target.value })
              }
              required
              rows={3}
              dir="rtl"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-arabic text-xl
                       placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50
                       transition-all"
              placeholder="اللَّهُمَّ..."
            />
          </div>

          {/* Transliteration */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Transliteration
            </label>
            <input
              type="text"
              value={formData.transliteration}
              onChange={(e) =>
                setFormData({ ...formData, transliteration: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                       placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50
                       transition-all"
              placeholder="Allahumma..."
            />
          </div>

          {/* Meaning */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Meaning / Translation *
            </label>
            <textarea
              value={formData.meaning}
              onChange={(e) =>
                setFormData({ ...formData, meaning: e.target.value })
              }
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                       placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50
                       transition-all"
              placeholder="O Allah, protect me..."
            />
          </div>

          {/* Reference & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Reference
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                         placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50
                         transition-all"
                placeholder="e.g., Sahih al-Bukhari"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                         placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50
                         transition-all"
                placeholder="e.g., Morning, Evening, Protection"
              />
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Benefits
            </label>
            <textarea
              value={formData.benefits}
              onChange={(e) =>
                setFormData({ ...formData, benefits: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white
                       placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50
                       transition-all"
              placeholder="Describe the benefits of this dua..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/admin/duas"
              className="px-6 py-3 rounded-xl border border-white/20 text-slate-300
                       hover:bg-white/10 hover:text-white transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
                       hover:shadow-lg hover:shadow-emerald-500/25 text-white font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                       flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        </motion.form>
      </div>
    </AdminSidebar>
  );
}
