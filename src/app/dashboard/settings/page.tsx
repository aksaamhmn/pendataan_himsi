/**
 * Pengaturan — Halaman pengaturan dashboard.
 * Server Component: fetch status dari app_settings lalu render Client Component.
 */

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./SettingsClient";
import MasterDataPanel from "./MasterDataPanel";

export const metadata: Metadata = {
  title: "Pengaturan — PSDM HIMSI",
  description: "Pengaturan dashboard admin PSDM HIMSI.",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: setting } = await (supabase as any)
    .from("app_settings")
    .select("setting_value")
    .eq("setting_key", "is_form_open")
    .single();

  const isFormOpen = setting?.setting_value === true;

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Konfigurasi sistem dan export data
        </p>
      </div>

      <SettingsClient isFormOpen={isFormOpen} />
      <MasterDataPanel />
    </div>
  );
}
