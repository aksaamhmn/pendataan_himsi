/**
 * Data Mahasiswa — Halaman tabel lengkap data mahasiswa.
 * Server Component yang mengambil data dan merender StudentDataTable.
 */

import type { Metadata } from "next";
import { getStudentsData } from "@/lib/data/dashboard";
import StudentDataTable from "../_components/StudentDataTable";

export const metadata: Metadata = {
  title: "Data Mahasiswa — PSDM HIMSI",
  description: "Daftar lengkap data mahasiswa beserta skill, minat, dan aspirasi.",
};

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const students = await getStudentsData();

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Page title */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Data Mahasiswa</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar lengkap pendaftar beserta keterampilan, minat, dan aspirasi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            {students.length} Mahasiswa
          </span>
        </div>
      </div>

      {/* Interactive Table */}
      <StudentDataTable students={students} />
    </div>
  );
}
