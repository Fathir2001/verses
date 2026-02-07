"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, Feeling } from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminFeelingsPage() {
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFeelings = async (page: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.getAdminFeelings(page, 10);
      if (response.data) {
        setFeelings(response.data);
      }
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.currentPage);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load feelings");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeelings(1);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteFeeling(id);
      setFeelings(feelings.filter((f) => f._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  return (
    <AdminSidebar>
      <div className="relative">
        {/* Ambient Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-[90px] animate-pulse" />
        </div>

        {/* Header */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-2xl">😊</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Feelings
              </h1>
              <p className="text-slate-400 mt-1">Manage all feelings content</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/admin/feelings/new"
              className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl 
                       bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
                       hover:shadow-2xl hover:shadow-emerald-500/30 
                       transform hover:scale-[1.02] hover:-translate-y-0.5
                       transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </div>
              <svg
                className="relative w-5 h-5 text-white"
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
              <span className="relative font-semibold text-white">
                Add Feeling
              </span>
            </Link>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-red-500/20 to-rose-500/10 border border-red-500/30 backdrop-blur-xl"
          >
            <p className="text-red-300 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
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
              </span>
              {error}
            </p>
          </motion.div>
        )}

        {/* Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 overflow-hidden shadow-2xl"
        >
          {/* Decorative corner glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />

          {isLoading ? (
            <div className="relative p-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/30">
                <svg
                  className="w-8 h-8 text-white animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
              <p className="mt-4 text-slate-400 font-medium">
                Loading feelings...
              </p>
            </div>
          ) : feelings.length === 0 ? (
            <div className="relative p-16 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4">
                <span className="text-4xl">📭</span>
              </div>
              <p className="text-slate-400 mb-4 text-lg">No feelings found</p>
              <Link
                href="/admin/feelings/new"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Create your first feeling
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-white/5 to-transparent">
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Feeling
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                        Slug
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                        Preview
                      </th>
                      <th className="px-6 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {feelings.map((feeling, index) => (
                      <motion.tr
                        key={feeling._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent transition-all duration-300"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all duration-300">
                              <span className="text-2xl">
                                {feeling.emoji || "📝"}
                              </span>
                            </div>
                            <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {feeling.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden sm:table-cell">
                          <span className="inline-flex px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300 font-mono">
                            {feeling.slug}
                          </span>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell">
                          <p className="text-sm text-slate-400 truncate max-w-xs">
                            {feeling.preview}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/feelings/${feeling._id}/edit`}
                              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 
                                       hover:bg-emerald-500/20 hover:border-emerald-500/30 hover:text-emerald-400 
                                       transition-all duration-300"
                              title="Edit"
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
                              onClick={() => setDeleteConfirm(feeling._id!)}
                              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 
                                       hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 
                                       transition-all duration-300"
                              title="Delete"
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
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-white/5 to-transparent">
                  <p className="text-sm text-slate-400">
                    Page{" "}
                    <span className="text-white font-semibold">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="text-white font-semibold">
                      {totalPages}
                    </span>
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => fetchFeelings(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="group px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300
                               disabled:opacity-40 disabled:cursor-not-allowed
                               hover:bg-white/10 hover:border-white/20 hover:text-white 
                               transition-all duration-300 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Previous
                    </button>
                    <button
                      onClick={() => fetchFeelings(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="group px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300
                               disabled:opacity-40 disabled:cursor-not-allowed
                               hover:bg-white/10 hover:border-white/20 hover:text-white 
                               transition-all duration-300 flex items-center gap-2"
                    >
                      Next
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Delete Modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-900/95 border border-white/10 p-8 shadow-2xl"
              >
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl" />

                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
                    <svg
                      className="w-8 h-8 text-red-400"
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
                  <h3 className="text-2xl font-bold text-white text-center mb-2">
                    Delete Feeling?
                  </h3>
                  <p className="text-slate-400 text-center mb-8">
                    This action cannot be undone. This will permanently delete
                    the feeling and all associated data.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-300
                               hover:bg-white/10 hover:text-white transition-all duration-300 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(deleteConfirm)}
                      className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 
                               hover:shadow-lg hover:shadow-red-500/30 text-white font-medium 
                               transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminSidebar>
  );
}
