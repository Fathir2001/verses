"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, Dua } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDuasPage() {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDuas = async (page: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.getAdminDuas(page, 10);
      if (response.data) {
        setDuas(response.data);
      }
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.currentPage);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load duas");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDuas(1);
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteDua(id);
      setDuas(duas.filter((d) => d._id !== id));
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
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Duas
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400"
            >
              Manage all duas and supplications
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Link
              href="/admin/duas/new"
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
              Add Dua
            </Link>
          </motion.div>
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

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
        >
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading duas...</p>
            </div>
          ) : duas.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 mb-4">No duas found</p>
              <Link
                href="/admin/duas/new"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Create your first dua →
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Arabic
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {duas.map((dua) => (
                      <tr
                        key={dua._id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                              🤲
                            </span>
                            <div>
                              <span className="font-medium text-white group-hover:text-emerald-400 transition-colors block">
                                {dua.title}
                              </span>
                              <span className="text-sm text-slate-500">
                                {dua.slug}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p
                            className="text-sm text-slate-300 truncate max-w-xs font-arabic"
                            dir="rtl"
                          >
                            {dua.arabic}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-slate-300">
                            {dua.reference || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/duas/${dua._id}/edit`}
                              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-all"
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
                              onClick={() => setDeleteConfirm(dua._id)}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchDuas(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-white/20 text-slate-300
                               disabled:opacity-50 disabled:cursor-not-allowed
                               hover:bg-white/10 hover:text-white transition-all"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchDuas(currentPage + 1)}
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

        {/* Delete Confirmation Modal */}
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
                Delete Dua?
              </h3>
              <p className="text-slate-400 text-center mb-6">
                This action cannot be undone. Are you sure you want to delete
                this dua?
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
