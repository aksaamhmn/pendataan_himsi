/**
 * StatCards — Kartu statistik overview di dashboard.
 */

import type { DashboardStats } from "@/lib/data/dashboard";

interface StatCardsProps {
  stats: DashboardStats;
}

const CARDS = [
  {
    key: "totalStudents" as const,
    label: "Total Mahasiswa",
    icon: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
  },
  {
    key: "topHardSkill" as const,
    label: "Top Hard Skill",
    icon: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
  },
  {
    key: "topInterest" as const,
    label: "Top Minat",
    icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
  },
  {
    key: "totalAspirations" as const,
    label: "Total Aspirasi",
    icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
  },
];

function getValue(stats: DashboardStats, key: string): { primary: string; secondary?: string } {
  switch (key) {
    case "totalStudents":
      return { primary: String(stats.totalStudents), secondary: "pendaftar" };
    case "topHardSkill":
      return stats.topHardSkill
        ? { primary: stats.topHardSkill.name, secondary: `${stats.topHardSkill.count} mahasiswa` }
        : { primary: "—", secondary: "belum ada data" };
    case "topInterest":
      return stats.topInterest
        ? { primary: stats.topInterest.name, secondary: `${stats.topInterest.count} mahasiswa` }
        : { primary: "—", secondary: "belum ada data" };
    case "totalAspirations":
      return { primary: String(stats.totalAspirations), secondary: "aspirasi masuk" };
    default:
      return { primary: "—" };
  }
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {CARDS.map((card) => {
        const value = getValue(stats, card.key);
        return (
          <div
            key={card.key}
            className={`
              relative overflow-hidden rounded-xl border border-gray-200
              bg-white p-5 shadow-sm
            `}
          >
            {/* Icon */}
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center`}>
                <svg className={`w-4.5 h-4.5 text-yellow-600`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                {card.label}
              </span>
            </div>

            {/* Value */}
            <p className={`font-bold text-gray-900 ${value.primary.length > 10 ? "text-base" : "text-2xl"} truncate`}>
              {value.primary}
            </p>
            {value.secondary && (
              <p className="text-xs text-gray-500 mt-0.5">{value.secondary}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
