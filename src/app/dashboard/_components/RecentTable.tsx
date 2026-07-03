/**
 * RecentTable — Tabel 5-10 pendaftar terakhir (server-rendered).
 */

import type { StudentWithRelations } from "@/lib/data/dashboard";

interface RecentTableProps {
  students: StudentWithRelations[];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function RecentTable({ students }: RecentTableProps) {
  const recent = students.slice(0, 8);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">Pendaftar Terakhir</h3>
        </div>
        <span className="text-xs text-gray-500">{students.length} total</span>
      </div>

      {recent.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-gray-500 italic">Belum ada pendaftar</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Nama</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">NIM</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">Angkatan</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">Skills</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recent.map((student) => (
                <tr key={student.nim} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-gray-900 font-medium truncate max-w-[180px]">{student.nama}</p>
                    <p className="text-xs text-gray-500 sm:hidden">{student.nim}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs hidden sm:table-cell">{student.nim}</td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                      {student.angkatan}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
                      {student.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className={`
                            inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium
                            ${skill.category === "hard_skill"
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : "bg-yellow-50 text-yellow-600 border border-yellow-200"
                            }
                          `}
                        >
                          {skill.name.length > 15 ? skill.name.slice(0, 15) + "…" : skill.name}
                        </span>
                      ))}
                      {student.skills.length > 3 && (
                        <span className="text-[10px] text-gray-500">+{student.skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(student.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
