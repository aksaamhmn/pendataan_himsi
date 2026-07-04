/**
 * Mahasiswa Profile Page — Landing page setelah login mahasiswa.
 * Menampilkan NRP (dari session) dan status pengisian formulir.
 * Server Component — data di-fetch server-side.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ClientDate from "@/components/ui/ClientDate";

export const metadata = {
  title: "Dashboard — Portal Mahasiswa PSDM HIMSI",
  description: "Dashboard portal mahasiswa PSDM HIMSI.",
};

export default async function StudentDashboard() {
  const supabase = await createClient();

  // Dapatkan user dari session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Extract NRP dari email dummy (nrp@himsi.local → nrp)
  const email = user.email || "";
  const nrp = email.replace("@himsi.local", "");

  // Cek apakah sudah mengisi formulir (ada di tabel students)
  const { data: student } = await supabase
    .from("students")
    .select("nim, nama, angkatan, created_at")
    .eq("nim", nrp)
    .single();

  const hasFilledForm = !!student;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Selamat Datang
        </h1>
        <p className="text-gray-500 mt-1">
          Portal pendataan mahasiswa HIMSI
        </p>
      </div>

      {/* NRP Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center shrink-0">
            <svg
              className="w-7 h-7 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <div>
            {hasFilledForm ? (
              <>
                <p className="text-lg font-semibold text-gray-900">
                  {student.nama}
                </p>
                <p className="text-sm text-gray-500">
                  NRP: <span className="font-mono font-medium text-gray-700">{nrp}</span>
                  {" · "}
                  Angkatan {student.angkatan}
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-gray-900">
                  Mahasiswa
                </p>
                <p className="text-sm text-gray-500">
                  NRP: <span className="font-mono font-medium text-gray-700">{nrp}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Pengisian Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Status Pendataan
        </h2>

        {hasFilledForm ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 border border-green-200 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Formulir Sudah Diisi
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Kamu sudah mengisi formulir pendataan HIMSI. Terima kasih atas partisipasimu!
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  <ClientDate isoString={student.created_at} prefix="Diisi pada: " />
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Belum Mengisi Formulir
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Kamu belum mengisi formulir pendataan. Segera lengkapi data minat, bakat, dan aspirasimu!
                </p>
              </div>
            </div>

            <Link
              href="/mahasiswa/form"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-500 transition-colors shadow-sm"
            >
              Isi Formulir Sekarang
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
