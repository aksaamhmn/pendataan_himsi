/**
 * Pengaturan — Placeholder halaman pengaturan dashboard.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan — PSDM HIMASI",
  description: "Pengaturan dashboard admin PSDM HIMASI.",
};

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Pengaturan</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Konfigurasi dan pengaturan dashboard
        </p>
      </div>

      <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Dalam Pengembangan</h3>
            <p className="text-xs text-slate-500">Fitur pengaturan akan tersedia di update berikutnya</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-t border-slate-800/40">
            <div>
              <p className="text-sm text-slate-300">Autentikasi Admin</p>
              <p className="text-xs text-slate-500">Login dengan Supabase Auth</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-600 bg-slate-800 px-2 py-1 rounded-full">Segera</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-slate-800/40">
            <div>
              <p className="text-sm text-slate-300">Export Data (CSV)</p>
              <p className="text-xs text-slate-500">Download data mahasiswa ke file CSV</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-600 bg-slate-800 px-2 py-1 rounded-full">Segera</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-slate-800/40">
            <div>
              <p className="text-sm text-slate-300">Manajemen Formulir</p>
              <p className="text-xs text-slate-500">Buka/tutup periode pendataan</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-slate-600 bg-slate-800 px-2 py-1 rounded-full">Segera</span>
          </div>
        </div>
      </div>
    </div>
  );
}
