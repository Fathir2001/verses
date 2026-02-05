"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, CreateDuaInput, Feeling } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewDuaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    arabic: "",
    transliteration: "",
    meaning: "",
    reference: "",
    feelingId: "",
  });

  useEffect(() => {
    const loadFeelings = async () => {
      try {
        const res = await api.getAdminFeelings(1, 100);
        if (res.data) setFeelings(res.data);
      } catch (err) {
        console.error("Failed to load feelings", err);
      }
    };
    loadFeelings();
  }, []);

  const generateSlug = (arabic: string) => {
    // Generate slug from first few words of Arabic text
    const words = arabic.trim().split(/\s+/).slice(0, 3);
    return `dua-${Date.now()}`;
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: false });
    }
  };

  const getInputClass = (hasError?: boolean) => {
    if (hasError) {
      return "w-full px-4 py-3 rounded-xl bg-white/5 border-2 border-red-500 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all";
    }
    return "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const errors: Record<string, boolean> = {};
    if (!formData.arabic.trim()) errors.arabic = true;
    if (!formData.transliteration.trim()) errors.transliteration = true;
    if (!formData.meaning.trim()) errors.meaning = true;
    if (!formData.reference.trim()) errors.reference = true;
    if (!formData.feelingId) errors.feelingId = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { feelingId, ...duaData } = formData;
      await api.createDua({
        ...duaData,
        title: `Dua ${Date.now()}`,
        slug: generateSlug(formData.arabic),
        category: "",
        benefits: "",
        feelingId: feelingId || null,
      } as CreateDuaInput);
      router.push("/admin/duas");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create dua");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Add New Dua
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            Create a new supplication
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
          noValidate
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6"
        >
          {/* Arabic Text */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Arabic Text *
            </label>
            <textarea
              value={formData.arabic}
              onChange={(e) => updateField("arabic", e.target.value)}
              rows={3}
              dir="rtl"
              className={getInputClass(fieldErrors.arabic) + " font-arabic text-xl"}
              placeholder="اللَّهُمَّ..."
            />
          </div>

          {/* Transliteration */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Transliteration *
            </label>
            <input
              type="text"
              value={formData.transliteration}
              onChange={(e) => updateField("transliteration", e.target.value)}
              className={getInputClass(fieldErrors.transliteration)}
              placeholder="Allahumma antas-salam wa minkas-salam..."
            />
          </div>

          {/* Meaning */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Meaning / Translation *
            </label>
            <textarea
              value={formData.meaning}
              onChange={(e) => updateField("meaning", e.target.value)}
              rows={3}
              className={getInputClass(fieldErrors.meaning)}
              placeholder="O Allah, You are Peace and from You is peace..."
            />
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Reference *
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => updateField("reference", e.target.value)}
              className={getInputClass(fieldErrors.reference)}
              placeholder="e.g., Sahih Muslim"
            />
          </div>

          {/* Link to Feeling */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Link to Feeling *
            </label>
            <select
              value={formData.feelingId}
              onChange={(e) => updateField("feelingId", e.target.value)}
              className={fieldErrors.feelingId ? "w-full px-4 py-3 rounded-xl bg-white/5 border-2 border-red-500 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" : "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"}
            >
              <option value="">-- Select a feeling --</option>
              {feelings.map((feeling) => (
                <option key={feeling._id} value={feeling._id}>
                  {feeling.emoji} {feeling.title}
                </option>
              ))}
            </select>
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
                  Create Dua
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </AdminSidebar>
  );
}
