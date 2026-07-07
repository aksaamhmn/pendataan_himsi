/**
 * Student Detail Page — Halaman detail data mahasiswa.
 * Server Component. Query berdasarkan param NIM.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudentByNim } from "@/lib/data/dashboard";

export const dynamic = "force-dynamic";

const LEVEL_BADGE: Record<string, { label: string; color: string }> = {
  pemula: { label: "Pemula", color: "bg-green-100 text-green-700 border-green-200" },
  menengah: { label: "Menengah", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  mahir: { label: "Mahir", color: "bg-purple-100 text-purple-700 border-purple-200" },
};

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

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ nim: string }>;
}) {
  const { nim } = await params;
  const student = await getStudentByNim(nim);

  if (!student) {
    notFound();
  }

  const hardSkills = student.skills.filter((s) => s.category === "hard_skill");
  const softSkills = student.skills.filter((s) => s.category === "soft_skill");
  const akademik = student.interests.filter((i) => i.category === "akademik");
  const nonAkademik = student.interests.filter((i) => i.category === "non_akademik");

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back button */}
      <Link
        href="/dashboard/students"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Kembali ke Data Mahasiswa
      </Link>

      {/* Header Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-yellow-700">
              {student.nama.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{student.nama}</h1>
            <p className="text-sm text-gray-500 font-mono">{student.nim}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                Angkatan {student.angkatan}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                Terdaftar {formatDate(student.created_at)}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                IPK {student.ipk || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            <span className="text-sm text-gray-700 truncate">{student.email || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
            <span className="text-sm text-gray-700 truncate">{student.email_kampus || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            <span className="text-sm text-gray-700">{student.whatsapp || "—"}</span>
          </div>
        </div>
      </div>

      {/* Skills & Interests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hard Skills Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Hard Skills</h2>
            <span className="ml-auto text-xs text-gray-500">{hardSkills.length} item</span>
          </div>
          {hardSkills.length > 0 ? (
            <div className="space-y-2">
              {hardSkills.map((skill, i) => {
                const lvl = LEVEL_BADGE[skill.level] || LEVEL_BADGE.pemula;
                return (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-sm text-gray-800">{skill.name}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${lvl.color}`}>
                      {lvl.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic text-center py-4">Tidak ada hard skill</p>
          )}
        </div>

        {/* Soft Skills Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Soft Skills</h2>
            <span className="ml-auto text-xs text-gray-500">{softSkills.length} item</span>
          </div>
          {softSkills.length > 0 ? (
            <div className="space-y-2">
              {softSkills.map((skill, i) => {
                const lvl = LEVEL_BADGE[skill.level] || LEVEL_BADGE.pemula;
                return (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="text-sm text-gray-800">{skill.name}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${lvl.color}`}>
                      {lvl.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic text-center py-4">Tidak ada soft skill</p>
          )}
        </div>

        {/* Minat Akademik Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Minat Akademik</h2>
            <span className="ml-auto text-xs text-gray-500">{akademik.length} item</span>
          </div>
          {akademik.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {akademik.map((interest, i) => (
                <span key={i} className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  {interest.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic text-center py-4">Tidak ada minat akademik</p>
          )}
        </div>

        {/* Minat Non-Akademik Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-pink-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Minat Non-Akademik</h2>
            <span className="ml-auto text-xs text-gray-500">{nonAkademik.length} item</span>
          </div>
          {nonAkademik.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {nonAkademik.map((interest, i) => (
                <span key={i} className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  {interest.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic text-center py-4">Tidak ada minat non-akademik</p>
          )}
        </div>
      </div>

      {/* Aspirasi Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-gray-900">Aspirasi & Feedback</h2>
        </div>
        {student.aspirations.length > 0 ? (
          <div className="space-y-3">
            {student.aspirations.map((a, i) => (
              <div key={i} className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{a.feedback_text}&rdquo;</p>
                <p className="text-[10px] text-gray-400 mt-2">{formatDate(a.created_at)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic text-center py-4">Belum ada aspirasi</p>
        )}
      </div>
    </div>
  );
}
