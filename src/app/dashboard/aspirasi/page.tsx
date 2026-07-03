/**
 * Aspirasi Page — Halaman daftar aspirasi mahasiswa.
 * Server Component. Menampilkan semua aspirasi dalam grid cards.
 */

import { getAspirations } from "@/lib/data/dashboard";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function AspirasiPage() {
  const aspirations = await getAspirations();

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Aspirasi Mahasiswa</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Kumpulan feedback dan aspirasi dari mahasiswa Sistem Informasi
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200 w-fit">
        <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
        <span className="text-sm font-medium text-yellow-800">{aspirations.length} aspirasi masuk</span>
      </div>

      {/* Content */}
      {aspirations.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          <p className="text-sm text-gray-500">Belum ada aspirasi yang masuk</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {aspirations.map((aspiration) => (
            <div
              key={aspiration.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Quote icon */}
              <svg className="w-6 h-6 text-yellow-400 mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
              </svg>

              {/* Feedback text */}
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {aspiration.feedback_text}
              </p>

              {/* Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-yellow-700">
                    {aspiration.student?.nama?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {aspiration.student?.nama || "Mahasiswa"}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {aspiration.student?.nim || "—"} · Angkatan {aspiration.student?.angkatan || "—"}
                  </p>
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                  {formatDate(aspiration.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
