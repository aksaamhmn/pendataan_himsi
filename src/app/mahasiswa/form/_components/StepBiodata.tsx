"use client";

/**
 * StepBiodata — Step 1: Data Diri Mahasiswa
 * Input: Nama Lengkap, NIM, Angkatan, Email, WhatsApp
 */

import { useCallback } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { FormBiodata } from "@/types/database";

interface StepBiodataProps {
  data: FormBiodata;
  onChange: (data: FormBiodata) => void;
  errors: Record<string, string>;
  ipk?: string | null;
  isSyncingIpk?: boolean;
}

const currentYear = new Date().getFullYear();
const angkatanOptions = Array.from({ length: 4 }, (_, i) => {
  const year = currentYear - i;
  return { value: String(year), label: String(year) };
});

export default function StepBiodata({ data, onChange, errors, ipk, isSyncingIpk }: StepBiodataProps) {
  const handleChange = useCallback(
    (field: keyof FormBiodata, value: string | number) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange]
  );

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200 mb-3">
          <svg className="w-3.5 h-3.5 text-yellow-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span className="text-xs font-medium text-yellow-700">Step 1 dari 4</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Data Diri</h2>
        <p className="text-sm text-gray-500 mt-1">Lengkapi identitas dirimu sebagai mahasiswa Sistem Informasi.</p>
      </div>

      {/* Form Fields */}
      <Input
        id="nama-lengkap"
        label="Nama Lengkap"
        placeholder="Masukkan nama lengkap"
        value={data.nama}
        onChange={(e) => handleChange("nama", e.target.value)}
        error={errors.nama}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="nim"
          label="NIM (Nomor Induk Mahasiswa)"
          placeholder="Otomatis dari akun"
          value={data.nim}
          readOnly
          className="bg-gray-100 text-gray-500 cursor-not-allowed"
          helperText="NIM diisi otomatis dari akun login Anda"
        />
        <Select
          id="angkatan"
          label="Angkatan"
          options={angkatanOptions}
          value={String(data.angkatan)}
          onChange={(e) => handleChange("angkatan", parseInt(e.target.value))}
          error={errors.angkatan}
          required
        />
      </div>

      {/* IPK (Read-Only dari Sistem Akademik) */}
      <div>
        <label
          htmlFor="ipk-akademik"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          IPK{" "}
          <span className="text-gray-400 font-normal">(Otomatis dari Sistem Akademik)</span>
        </label>
        <div className="relative">
          <input
            id="ipk-akademik"
            type="text"
            value={isSyncingIpk ? "" : (ipk ?? "Data tidak tersedia")}
            readOnly
            disabled
            placeholder={isSyncingIpk ? "" : "Data tidak tersedia"}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-500 text-sm cursor-not-allowed"
          />
          {isSyncingIpk && (
            <div className="absolute inset-y-0 left-4 flex items-center gap-2">
              <svg className="animate-spin w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs text-gray-400">Menyinkronkan data...</span>
            </div>
          )}
          {!isSyncingIpk && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Nilai IPK diambil langsung dari sistem akademik kampus.
        </p>
      </div>

      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="nama@email.com"
        value={data.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
        required
      />

      <Input
        id="whatsapp"
        label="Nomor WhatsApp"
        type="tel"
        placeholder="Contoh: 08123456789"
        value={data.whatsapp}
        onChange={(e) => {
          const val = e.target.value.replace(/[^0-9+]/g, "");
          handleChange("whatsapp", val);
        }}
        error={errors.whatsapp}
        helperText="Gunakan format nomor Indonesia (08xx atau +628xx)"
        required
      />
    </div>
  );
}
