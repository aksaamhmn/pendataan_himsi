"use client";

import { useState, useMemo } from "react";

interface ProgressItem {
  nim: string;
  nama: string;
  status: boolean;
}

interface ProgressTableClientProps {
  progressList: ProgressItem[];
}

type SortKey = "nim" | "nama" | "status";
type SortDirection = "asc" | "desc";

export default function ProgressTableClient({ progressList }: ProgressTableClientProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("nim");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = progressList;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.nim.toLowerCase().includes(q) ||
          item.nama.toLowerCase().includes(q) ||
          (item.status ? "sudah" : "belum").includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      if (sortKey === "nim") {
        valA = a.nim;
        valB = b.nim;
      } else if (sortKey === "nama") {
        valA = a.nama;
        valB = b.nama;
      } else if (sortKey === "status") {
        valA = a.status ? 1 : 0;
        valB = b.status ? 1 : 0;
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [progressList, search, sortKey, sortDirection]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const currentData = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return (
        <svg className="w-3 h-3 text-gray-400 ml-1 inline" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
      );
    }
    return sortDirection === "asc" ? (
      <svg className="w-3 h-3 text-gray-700 ml-1 inline" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-gray-700 ml-1 inline" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-base font-semibold text-gray-900">Daftar Akun Mahasiswa</h2>
        <div className="relative w-full sm:max-w-xs">
          <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Cari NIM, Nama, atau Status..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th 
                className="px-6 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("nim")}
              >
                <div className="flex items-center">NIM <SortIcon columnKey="nim" /></div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("nama")}
              >
                <div className="flex items-center">Nama <SortIcon columnKey="nama" /></div>
              </th>
              <th 
                className="px-6 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors text-center"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center justify-center">Status <SortIcon columnKey="status" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentData.map((item) => (
              <tr key={item.nim} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono whitespace-nowrap">
                  {item.nim}
                </td>
                <td className={`px-6 py-4 text-sm whitespace-nowrap ${item.status ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                  {item.nama}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center">
                    {item.status ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Sudah
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        Belum
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {currentData.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                  {search ? "Data tidak ditemukan." : "Belum ada data akun."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-500">
            Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAndSorted.length)}</span> dari <span className="font-medium">{filteredAndSorted.length}</span> data
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            <div className="text-sm text-gray-700 px-2 font-medium">
              {currentPage} / {totalPages}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
