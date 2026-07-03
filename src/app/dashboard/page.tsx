/**
 * Dashboard Overview — Server Component
 * Mengambil data dari Supabase dan merender statistik + tabel.
 */

import { getDashboardStats, getStudentsData } from "@/lib/data/dashboard";
import StatCards from "./_components/StatCards";
import DistributionBars from "./_components/DistributionBars";
import RecentTable from "./_components/RecentTable";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, students] = await Promise.all([
    getDashboardStats(),
    getStudentsData(),
  ]);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-white">Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Rekapitulasi data pendataan mahasiswa Sistem Informasi
        </p>
      </div>

      {/* Stat Cards */}
      <StatCards stats={stats} />

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DistributionBars
          title="Top 10 Skills"
          icon="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
          items={stats.skillDistribution}
          barColor="bg-cyan-500"
          emptyText="Belum ada data skill"
        />
        <DistributionBars
          title="Top 10 Minat"
          icon="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          items={stats.interestDistribution}
          barColor="bg-pink-500"
          emptyText="Belum ada data minat"
        />
      </div>

      {/* Recent Registrations */}
      <RecentTable students={students} />
    </div>
  );
}
