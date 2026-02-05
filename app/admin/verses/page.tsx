"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, Verse } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminVersesPage() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterSura, setFilterSura] = useState<string>("");

  const fetchVerses = async (page: number, suraNumber?: number) => {
    setIsLoading(true);
    try {
      const response = await api.getAdminVerses(page, 20, suraNumber);
      if (response.data) {
        setVerses(response.data);
      }
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.currentPage);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerses(1, filterSura ? parseInt(filterSura) : undefined);
  }, [filterSura]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteVerse(id);
      setVerses(verses.filter((v) => v._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  return (
    <AdminSidebar>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Verses
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400"
            >
              Manage Quran verses
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Link
              href="/admin/verses/new"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
                       hover:shadow-lg hover:shadow-emerald-500/25 text-white font-medium transition-all duration-300"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Verse
            </Link>
          </motion.div>
        </div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className="relative w-72">
            <input
              type="number"
              placeholder="Filter by Sura Number..."
              value={filterSura}
              onChange={(e) => setFilterSura(e.target.value)}
              className="w-full px-4 py-3 pl-11 rounded-xl border border-white/20 
                       bg-white/5 text-white placeholder-slate-400
                       focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                       focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
        >
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading verses...</p>
            </div>
          ) : verses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400">No verses found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                        Reference
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                        Arabic
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                        Translation
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {verses.map((verse) => (
                      <tr
                        key={verse._id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                            {verse.suraNumber}:{verse.verseNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p
                            className="text-lg text-white truncate max-w-xs"
                            dir="rtl"
                          >
                            {verse.arabicText}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-400 truncate max-w-md">
                            {verse.translationText}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/verses/${verse._id}/edit`}
                              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-all"
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(verse._id)}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        fetchVerses(
                          currentPage - 1,
                          filterSura ? parseInt(filterSura) : undefined,
                        )
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-white/20 text-slate-300
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:bg-white/10 hover:text-white transition-all"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        fetchVerses(
                          currentPage + 1,
                          filterSura ? parseInt(filterSura) : undefined,
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-white/20 text-slate-300
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:bg-white/10 hover:text-white transition-all"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="backdrop-blur-xl bg-slate-900/90 border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-400"
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
              </div>
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                Delete Verse?
              </h3>
              <p className="text-slate-400 text-center mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/20 text-slate-300
                           hover:bg-white/10 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/25"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminSidebar>
  );
}
