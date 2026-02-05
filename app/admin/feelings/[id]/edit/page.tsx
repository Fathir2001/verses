"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, CreateFeelingInput, Dua, Verse } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditFeelingPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState<
    Array<{ field: string; message: string }>
  >([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [formData, setFormData] = useState<Partial<CreateFeelingInput>>({
    slug: "",
    title: "",
    emoji: "",
    preview: "",
    reminder: "",
    verseId: "",
    duaId: "",
    actions: [""],
  });

  useEffect(() => {
    const fetchFeeling = async () => {
      try {
        const [versesRes, duasRes, feelingRes] = await Promise.all([
          api.getAdminVerses(1, 200),
          api.getAdminDuas(1, 200),
          api.getAdminFeelingById(id),
        ]);
        if (versesRes.data) setVerses(versesRes.data);
        if (duasRes.data) setDuas(duasRes.data);
        if (feelingRes.data) {
          const feeling = feelingRes.data;
          const verseId =
            typeof feeling.verse === "string"
              ? feeling.verse
              : feeling.verse?._id || "";
          const duaId =
            typeof feeling.dua === "string"
              ? feeling.dua
              : feeling.dua?._id || "";
          setFormData({
            slug: feeling.slug,
            title: feeling.title,
            emoji: feeling.emoji,
            preview: feeling.preview,
            reminder: feeling.reminder,
            verseId,
            duaId,
            actions: feeling.actions.length > 0 ? feeling.actions : [""],
          });
        }
      } catch (err) {
        if (err instanceof ApiError) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeeling();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorDetails([]);
    setIsSubmitting(true);
    try {
      const cleanedActions =
        formData.actions?.filter((a: string) => a.trim() !== "") || [];
      if (cleanedActions.length === 0) {
        setError("Please add at least one action.");
        setIsSubmitting(false);
        return;
      }
      const cleanedData = {
        ...formData,
        actions: cleanedActions,
      };
      await api.updateFeeling(id, cleanedData);
      router.push("/admin/feelings");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setErrorDetails(err.errors || []);
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
          ...(formData[keys[0] as keyof Partial<CreateFeelingInput>] as object),
          [keys[1]]: value,
        },
      });
    }
  };

  const normalizeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

  const addAction = () =>
    setFormData({ ...formData, actions: [...(formData.actions || []), ""] });
  const updateAction = (index: number, value: string) => {
    const newActions = [...(formData.actions || [])];
    newActions[index] = value;
    setFormData({ ...formData, actions: newActions });
  };
  const removeAction = (index: number) => {
    const newActions = (formData.actions || []).filter(
      (_: string, i: number) => i !== index,
    );
    setFormData({
      ...formData,
      actions: newActions.length > 0 ? newActions : [""],
    });
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200`;
  const labelClass = "block text-sm font-medium text-slate-300 mb-2";

  if (isLoading) {
    return (
      <AdminSidebar>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400"></div>
        </div>
      </AdminSidebar>
    );
  }

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
            Edit Feeling
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            Update this emotional state
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
            {errorDetails.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-red-200">
                {errorDetails.map((detail, index) => (
                  <li key={`${detail.field}-${index}`}>
                    <span className="font-medium">{detail.field}:</span>{" "}
                    {detail.message}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
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
                  onChange={(e) =>
                    updateField("slug", normalizeSlug(e.target.value))
                  }
                  className={inputClass}
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
                required
              />
            </div>
          </div>

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
              Verse & Dua References
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Verse *</label>
                <select
                  value={formData.verseId || ""}
                  onChange={(e) => updateField("verseId", e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    Select a verse
                  </option>
                  {verses.map((verse) => (
                    <option key={verse._id} value={verse._id}>
                      {verse.suraNumber}:{verse.verseNumber} — {verse.reference}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Dua *</label>
                <select
                  value={formData.duaId || ""}
                  onChange={(e) => updateField("duaId", e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    Select a dua
                  </option>
                  {duas.map((dua) => (
                    <option key={dua._id} value={dua._id}>
                      {dua.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all text-sm"
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
                Add
              </button>
            </div>
            <div className="space-y-3">
              {(formData.actions || []).map((action: string, index: number) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={action}
                    onChange={(e) => updateAction(index, e.target.value)}
                    className={`${inputClass} flex-1`}
                    placeholder={`Action ${index + 1}`}
                  />
                  {(formData.actions?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAction(index)}
                      className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all"
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

          <div className="flex gap-4 pt-4">
            <Link
              href="/admin/feelings"
              className="flex-1 px-6 py-4 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 hover:text-white text-center font-medium transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/25 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
        </motion.form>
      </div>
    </AdminSidebar>
  );
}
