"use client";

/**
 * Settings Client Page
 */
import { useState, useTransition } from "react";
import { toggleFormStatus } from "./actions";

interface SettingsClientProps {
  isFormOpen: boolean;
}

export default function SettingsClient({ isFormOpen }: SettingsClientProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/export");
      if (!response.ok) {
        throw new Error("Gagal mengunduh data");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data_mahasiswa_himsi.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Terjadi kesalahan saat mengunduh data.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleToggle = () => {
    const newState = !isFormOpen;
    startTransition(async () => {
      try {
        await toggleFormStatus(newState);
      } catch (error) {
        alert("Gagal mengubah status form.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Card: Export Data Mahasiswa */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Export Data Mahasiswa</h3>
            <p className="text-sm text-gray-500 mt-1">
              Unduh seluruh data mahasiswa yang telah mengisi formulir dalam format CSV.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 shrink-0"
          >
            {isExporting ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
            Unduh CSV
          </button>
        </div>
      </div>

      {/* Card: Status Pendataan */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Status Pendataan</h3>
            <p className="text-sm text-gray-500 mt-1">
              Buka atau tutup akses bagi mahasiswa untuk mengisi formulir pendataan.
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={isPending}
            className={`
              relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50
              ${isFormOpen ? "bg-green-500" : "bg-gray-200"}
            `}
            role="switch"
            aria-checked={isFormOpen}
          >
            <span
              aria-hidden="true"
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                ${isFormOpen ? "translate-x-6" : "translate-x-1"}
              `}
            />
          </button>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm">
            Status saat ini:{" "}
            <span className={`font-semibold ${isFormOpen ? "text-green-600" : "text-gray-500"}`}>
              {isFormOpen ? "Terbuka (Mahasiswa dapat mengisi form)" : "Tertutup (Form terkunci)"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
