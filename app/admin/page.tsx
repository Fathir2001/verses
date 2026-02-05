"use client";

import { AdminSidebar } from "@/components/AdminSidebar";
import { api, ApiError, Feeling } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    feelings: 0,
    duas: 0,
    verses: 0,
  });
  const [recentFeelings, setRecentFeelings] = useState<Feeling[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feelingsRes, duasRes, versesRes] = await Promise.all([
          api.getAdminFeelings(1, 5),
          api.getAdminDuas(1, 1),
          api.getAdminVerses(1, 1),
        ]);

        setStats({
          feelings: feelingsRes.pagination?.totalItems || 0,
          duas: duasRes.pagination?.totalItems || 0,
          verses: versesRes.pagination?.totalItems || 0,
        });

        if (feelingsRes.data) {
          setRecentFeelings(feelingsRes.data);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: "Feelings",
      value: stats.feelings,
      href: "/admin/feelings",
      icon: "😊",
      gradient: "from-emerald-400 to-teal-500",
      bgGlow: "bg-emerald-500/20",
    },
    {
      label: "Duas",
      value: stats.duas,
      href: "/admin/duas",
      icon: "🤲",
      gradient: "from-blue-400 to-indigo-500",
      bgGlow: "bg-blue-500/20",
    },
    {
      label: "Verses",
      value: stats.verses,
      href: "/admin/verses",
      icon: "📖",
      gradient: "from-purple-400 to-pink-500",
      bgGlow: "bg-purple-500/20",
    },
  ];

  return (
    <AdminSidebar>
      <div>
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            Welcome back! Here&apos;s an overview of your content.
          </motion.p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 backdrop-blur-sm"
          >
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={stat.href}
                className="group block relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10
                          hover:bg-white/10 hover:border-white/20 transition-all duration-300
                          overflow-hidden"
              >
                {/* Background glow */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 ${stat.bgGlow} rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity`}
                />

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-4xl font-bold text-white">
                      {isLoading ? (
                        <span className="inline-block w-12 h-8 bg-white/10 rounded animate-pulse" />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform`}
                  >
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>

                <div className="relative mt-4 flex items-center text-sm text-slate-400 group-hover:text-white transition-colors">
                  <span>View all</span>
                  <svg
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
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
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Feelings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-xl">✨</span>
              Recent Feelings
            </h2>
            <Link
              href="/admin/feelings"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              View all
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto" />
              </div>
            ) : recentFeelings.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No feelings found. Create your first one!
              </div>
            ) : (
              recentFeelings.map((feeling, index) => (
                <motion.div
                  key={feeling._id || feeling.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Link
                    href={`/admin/feelings/${feeling._id}/edit`}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-2xl transform group-hover:scale-110 transition-transform">
                      {feeling.emoji || "📝"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white group-hover:text-emerald-400 transition-colors truncate">
                        {feeling.title}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {feeling.preview}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-all">
                      {feeling.slug}
                    </span>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">⚡</span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                href: "/admin/feelings/new",
                label: "Add Feeling",
                icon: "😊",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                href: "/admin/suras/new",
                label: "Add Sura",
                icon: "📖",
                gradient: "from-blue-500 to-indigo-500",
              },
              {
                href: "/admin/verses/new",
                label: "Add Verse",
                icon: "📜",
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((action, index) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Link
                  href={action.href}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${action.gradient} 
                            hover:shadow-lg hover:shadow-emerald-500/25 transform hover:scale-[1.02] 
                            transition-all duration-300 text-white`}
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="font-medium">{action.label}</span>
                  <svg
                    className="w-5 h-5 ml-auto"
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
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminSidebar>
  );
}
