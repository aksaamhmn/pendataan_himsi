/**
 * StatCards — 6 kartu statistik overview di dashboard.
 * Grid: 2 baris × 3 kolom (desktop), responsif ke 1 kolom.
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
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    key: "totalAspirations" as const,
    label: "Total Aspirasi",
    icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    key: "topHardSkill" as const,
    label: "Top Hard Skill",
    icon: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "topSoftSkill" as const,
    label: "Top Soft Skill",
    icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    key: "topMinatAkademik" as const,
    label: "Top Minat Akademik",
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    key: "topMinatNonAkademik" as const,
    label: "Top Minat Non-Akademik",
    icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];

function getValue(stats: DashboardStats, key: string): { primary: string; secondary?: string } {
  switch (key) {
    case "totalStudents":
      return { primary: String(stats.totalStudents), secondary: "pendaftar" };
    case "totalAspirations":
      return { primary: String(stats.totalAspirations), secondary: "aspirasi masuk" };
    case "topHardSkill":
      return stats.topHardSkill
        ? { primary: stats.topHardSkill.name, secondary: `${stats.topHardSkill.count} mahasiswa` }
        : { primary: "—", secondary: "belum ada data" };
    case "topSoftSkill":
      return stats.topSoftSkill
        ? { primary: stats.topSoftSkill.name, secondary: `${stats.topSoftSkill.count} mahasiswa` }
        : { primary: "—", secondary: "belum ada data" };
    case "topMinatAkademik":
      return stats.topMinatAkademik
        ? { primary: stats.topMinatAkademik.name, secondary: `${stats.topMinatAkademik.count} mahasiswa` }
        : { primary: "—", secondary: "belum ada data" };
    case "topMinatNonAkademik":
      return stats.topMinatNonAkademik
        ? { primary: stats.topMinatNonAkademik.name, secondary: `${stats.topMinatNonAkademik.count} mahasiswa` }
        : { primary: "—", secondary: "belum ada data" };
    default:
      return { primary: "—" };
  }
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {CARDS.map((card) => {
        const value = getValue(stats, card.key);
        return (
          <div
            key={card.key}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            {/* Icon + Label */}
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <svg className={`w-4.5 h-4.5 ${card.iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium text-right max-w-[100px] leading-tight">
                {card.label}
              </span>
            </div>

            {/* Value */}
            <p className={`font-bold text-gray-900 ${value.primary.length > 12 ? "text-sm" : value.primary.length > 6 ? "text-base" : "text-2xl"} truncate`}>
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
