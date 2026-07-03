"use client";

/**
 * StudentDataTable — Tabel interaktif lengkap data mahasiswa.
 * Client component dengan fitur search (Nama / Skill / NIM).
 */

import { useState, useMemo } from "react";
import type { StudentWithRelations } from "@/lib/data/dashboard";

interface StudentDataTableProps {
  students: StudentWithRelations[];
}

const LEVEL_BADGE: Record<string, { label: string; icon: string; color: string }> = {
  pemula: { label: "Pemula", icon: "🌱", color: "bg-green-100 text-green-700 border-green-200" },
  menengah: { label: "Menengah", icon: "🔥", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  mahir: { label: "Mahir", icon: "⚡", color: "bg-purple-100 text-purple-700 border-purple-200" },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function StudentDataTable({ students }: StudentDataTableProps) {
  const [search, setSearch] = useState("");
  const [expandedNim, setExpandedNim] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.nama.toLowerCase().includes(q) ||
        s.nim.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.skills.some((sk) => sk.name.toLowerCase().includes(q)) ||
        s.interests.some((i) => i.name.toLowerCase().includes(q))
    );
  }, [students, search]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama, NIM, skill, atau minat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {filtered.length} dari {students.length} mahasiswa
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p className="text-sm text-gray-500">
              {search ? `Tidak ditemukan hasil untuk "${search}"` : "Belum ada data mahasiswa"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Mahasiswa</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">Angkatan</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">Kontak</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">Skills</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden xl:table-cell">Aspirasi</th>
                  <th className="px-5 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((student) => {
                  const isExpanded = expandedNim === student.nim;
                  return (
                    <tr key={student.nim} className="group hover:bg-gray-50 transition-colors">
                      {/* Main row */}
                      <td className="px-5 py-3">
                        <p className="text-gray-900 font-medium">{student.nama}</p>
                        <p className="text-xs text-gray-500 font-mono">{student.nim}</p>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                          {student.angkatan}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <p className="text-xs text-gray-600 truncate max-w-[180px]">{student.email}</p>
                        <p className="text-xs text-gray-500">{student.whatsapp}</p>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <div className="flex gap-1 flex-wrap max-w-[220px]">
                          {student.skills.slice(0, 3).map((skill, i) => {
                            const lvl = LEVEL_BADGE[skill.level] || LEVEL_BADGE.pemula;
                            return (
                              <span
                                key={i}
                                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                  skill.category === "hard_skill"
                                    ? "bg-blue-50 text-blue-600 border-blue-200"
                                    : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                }`}
                                title={`${skill.name} — ${lvl.label}`}
                              >
                                {skill.name.length > 12 ? skill.name.slice(0, 12) + "…" : skill.name}
                              </span>
                            );
                          })}
                          {student.skills.length > 3 && (
                            <span className="text-[10px] text-gray-500 self-center">+{student.skills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden xl:table-cell">
                        {student.aspirations.length > 0 ? (
                          <p className="text-xs text-gray-600 truncate max-w-[200px]" title={student.aspirations[0].feedback_text}>
                            {student.aspirations[0].feedback_text}
                          </p>
                        ) : (
                          <span className="text-xs text-gray-400 italic">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setExpandedNim(isExpanded ? null : student.nim)}
                          className="p-1 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Detail"
                        >
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Expanded Detail Panel — rendered outside table for proper layout */}
            {expandedNim && (
              <ExpandedDetail student={filtered.find((s) => s.nim === expandedNim)!} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Expanded Detail Panel ─────────────────────────────────────

function ExpandedDetail({ student }: { student: StudentWithRelations }) {
  if (!student) return null;

  const hardSkills = student.skills.filter((s) => s.category === "hard_skill");
  const softSkills = student.skills.filter((s) => s.category === "soft_skill");
  const akademik = student.interests.filter((i) => i.category === "akademik");
  const nonAkademik = student.interests.filter((i) => i.category === "non_akademik");

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Contact */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Kontak</h4>
          <p className="text-sm text-gray-900">{student.email}</p>
          <p className="text-sm text-gray-600">{student.whatsapp}</p>
          <p className="text-xs text-gray-400 mt-1">Angkatan {student.angkatan} · Daftar {formatDate(student.created_at)}</p>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Keterampilan ({student.skills.length})
          </h4>
          {hardSkills.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] text-gray-500 font-medium mb-1">Hard Skills</p>
              <div className="flex flex-wrap gap-1">
                {hardSkills.map((s, i) => {
                  const lvl = LEVEL_BADGE[s.level] || LEVEL_BADGE.pemula;
                  return (
                    <span key={i} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] border ${lvl.color}`}>
                      {lvl.icon} {s.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {softSkills.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-500 font-medium mb-1">Soft Skills</p>
              <div className="flex flex-wrap gap-1">
                {softSkills.map((s, i) => {
                  const lvl = LEVEL_BADGE[s.level] || LEVEL_BADGE.pemula;
                  return (
                    <span key={i} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] border ${lvl.color}`}>
                      {lvl.icon} {s.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {student.skills.length === 0 && <p className="text-xs text-gray-400 italic">Tidak ada</p>}
        </div>

        {/* Interests + Aspirations */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Minat ({student.interests.length})
          </h4>
          {akademik.length > 0 && (
            <div className="mb-1.5">
              <div className="flex flex-wrap gap-1">
                {akademik.map((i, idx) => (
                  <span key={idx} className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                    {i.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {nonAkademik.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {nonAkademik.map((i, idx) => (
                <span key={idx} className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                  {i.name}
                </span>
              ))}
            </div>
          )}
          {student.interests.length === 0 && <p className="text-xs text-gray-400 italic">Tidak ada</p>}

          {/* Aspirations */}
          {student.aspirations.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Aspirasi</h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                &ldquo;{student.aspirations[0].feedback_text}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
