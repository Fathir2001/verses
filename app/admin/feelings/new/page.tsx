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
  const [errorDetails, setErrorDetails] = useState<
    Array<{ field: string; message: string }>
  >([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [actionErrors, setActionErrors] = useState<boolean[]>([]);
  const [formData, setFormData] = useState<CreateFeelingInput>({
    slug: "",
    title: "",
    emoji: "",
    preview: "",
    reminder: "",
    actions: [""],
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value),
    });
    if (fieldErrors.title) {
      setFieldErrors({ ...fieldErrors, title: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorDetails([]);

    const nextFieldErrors: Record<string, boolean> = {
      emoji: !(formData.emoji || "").trim(),
      title: !(formData.title || "").trim(),
      preview: !(formData.preview || "").trim(),
      reminder: !(formData.reminder || "").trim(),
    };

    const nextActionErrors = (formData.actions || []).map((a) => !a.trim());
    setActionErrors(nextActionErrors);

    const hasFieldErrors = Object.values(nextFieldErrors).some(Boolean);
    const hasActionErrors = nextActionErrors.some(Boolean);

    if (hasFieldErrors || hasActionErrors) {
      setFieldErrors(nextFieldErrors);
      setError("Please fill all required fields.");
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const cleanedActions = formData.actions.filter((a) => a.trim() !== "");
      if (cleanedActions.length === 0) {
        setError("Please add at least one action.");
        setIsSubmitting(false);
        return;
      }
      const cleanedData = {
        ...formData,
        actions: cleanedActions,
      };
      await api.createFeeling(cleanedData);
      router.push("/admin/feelings");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setErrorDetails(err.errors || []);
      } else {
        setError("Failed to create feeling");
        setErrorDetails([]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: false });
    }
  };

  const addAction = () => {
    setFormData({ ...formData, actions: [...formData.actions, ""] });
  };

  const updateAction = (index: number, value: string) => {
    const newActions = [...formData.actions];
    newActions[index] = value;
    setFormData({ ...formData, actions: newActions });
    if (actionErrors[index]) {
      const nextActionErrors = [...actionErrors];
      nextActionErrors[index] = false;
      setActionErrors(nextActionErrors);
    }
  };

  const removeAction = (index: number) => {
    const newActions = formData.actions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      actions: newActions.length > 0 ? newActions : [""],
    });
    const nextActionErrors = actionErrors.filter((_, i) => i !== index);
    setActionErrors(nextActionErrors.length > 0 ? nextActionErrors : [false]);
  };

  const getInputClass = (hasError?: boolean) => {
    const baseClass =
      "w-full px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-slate-400 transition-all duration-200";
    const borderClass = hasError
      ? "border-2 border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-600"
      : "border border-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50";
    return `${baseClass} ${borderClass}`;
  };

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
            Create a new emotional state and link related content.
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
          noValidate
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
                <label className={labelClass}>Emoji *</label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => updateField("emoji", e.target.value)}
                  className={getInputClass(fieldErrors.emoji)}
                  placeholder="e.g., 😰"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Name of the Feeling *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className={getInputClass(fieldErrors.title)}
                  placeholder="e.g., Anxious"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClass}>Small Description *</label>
              <input
                type="text"
                value={formData.preview}
                onChange={(e) => updateField("preview", e.target.value)}
                className={getInputClass(fieldErrors.preview)}
                placeholder="A brief description shown on feeling cards"
                required
              />
            </div>

            <div className="mt-6">
              <label className={labelClass}>Gentle Reminder *</label>
              <textarea
                value={formData.reminder}
                onChange={(e) => updateField("reminder", e.target.value)}
                className={`${getInputClass(fieldErrors.reminder)} min-h-[100px]`}
                placeholder="A comforting reminder for when someone feels this way..."
                required
              />
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
                    className={`${getInputClass(actionErrors[index])} flex-1`}
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
