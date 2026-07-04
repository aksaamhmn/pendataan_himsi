"use client";

/**
 * StudentDataTable — Tabel interaktif data mahasiswa.
 * Client component dengan fitur search. Tanpa expandable row.
 * Kolom Aksi: Link "Lihat Detail" ke /dashboard/students/[nim].
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import type { StudentWithRelations } from "@/lib/data/dashboard";

interface StudentDataTableProps {
  students: StudentWithRelations[];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
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
          <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">IPK</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">Kontak</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">Minat</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden xl:table-cell">Tanggal</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((student) => {
                  const hasData = student.skills.length > 0 || student.interests.length > 0;

                  return (
                    <tr key={student.nim} className="group hover:bg-gray-50 transition-colors">
                      {/* Mahasiswa */}
                      <td className="px-5 py-3">
                        <p className="text-gray-900 font-medium">{student.nama}</p>
                        <p className="text-xs text-gray-500 font-mono">{student.nim}</p>
                      </td>

                      {/* Angkatan */}
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                          {student.angkatan}
                        </span>
                      </td>

                      {/* IPK */}
                      <td className="px-5 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-700">
                          {student.ipk || "—"}
                        </span>
                      </td>

                      {/* Kontak */}
                      <td className="px-5 py-3 hidden lg:table-cell">
                        {student.email ? (
                          <>
                            <p className="text-xs text-gray-600 truncate max-w-[180px]">{student.email}</p>
                            <p className="text-xs text-gray-500">{student.whatsapp || "—"}</p>
                          </>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-500 border border-gray-200">
                            Belum Isi Form
                          </span>
                        )}
                      </td>

                      {/* Minat */}
                      <td className="px-5 py-3 hidden sm:table-cell">
                        {hasData ? (
                          <div className="flex gap-1 flex-wrap max-w-[220px]">
                            {student.interests.slice(0, 3).map((interest, i) => (
                              <span
                                key={i}
                                className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                  interest.category === "akademik"
                                    ? "bg-blue-50 text-blue-600 border-blue-200"
                                    : "bg-purple-50 text-purple-600 border-purple-200"
                                }`}
                              >
                                {interest.name.length > 12 ? interest.name.slice(0, 12) + "…" : interest.name}
                              </span>
                            ))}
                            {student.interests.length > 3 && (
                              <span className="text-[10px] text-gray-500 self-center">+{student.interests.length - 3}</span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-500 border border-gray-200">
                            Belum Isi Form
                          </span>
                        )}
                      </td>

                      {/* Tanggal */}
                      <td className="px-5 py-3 hidden xl:table-cell">
                        <span className="text-xs text-gray-500 whitespace-nowrap">{formatDate(student.created_at)}</span>
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={`/dashboard/students/${student.nim}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-yellow-800 bg-yellow-100 border border-yellow-200 hover:bg-yellow-200 transition-colors"
                        >
                          Lihat Detail
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
