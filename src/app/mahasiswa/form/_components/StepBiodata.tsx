"use client";

/**
 * StepBiodata — Step 1: Data Diri Mahasiswa
 * Input: Nama Lengkap, NIM, Angkatan, Email, WhatsApp
 */

import { useCallback } from "react";
import Input from "@/components/ui/Input";
import type { FormBiodata } from "@/types/database";

interface StepBiodataProps {
  data: FormBiodata;
  onChange: (data: FormBiodata) => void;
  errors: Record<string, string>;
  ipk?: string;
  onIpkChange?: (value: string) => void;
}


export default function StepBiodata({ data, onChange, errors, ipk, onIpkChange }: StepBiodataProps) {
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
        <Input
          id="angkatan"
          label="Angkatan"
          placeholder="Otomatis dari akun"
          value={String(data.angkatan)}
          readOnly
          className="bg-gray-100 text-gray-500 cursor-not-allowed"
          helperText="Angkatan diisi otomatis dari NIM Anda"
        />
      </div>

      {/* IPK (Input Manual) */}
      <div>
        <label
          htmlFor="ipk-akademik"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          IPK Terakhir 
        </label>
        <input
          id="ipk-akademik"
          type="text"
          inputMode="decimal"
          value={ipk ?? ""}
          onChange={(e) => {
            // Izinkan angka, titik, dan koma. Koma otomatis diubah menjadi titik.
            const val = e.target.value.replace(/,/g, ".").replace(/[^0-9.]/g, "");
            onIpkChange?.(val);
          }}
          placeholder="Contoh: 3.50"
          className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />
        {errors.ipk && (
          <p className="mt-1 text-xs text-red-500">{errors.ipk}</p>
        )}
        <p className="mt-1 text-xs text-gray-400">
          Masukkan IPK terakhir Anda sesuai data di portal akademik kampus (0.00 - 4.00).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="email"
          label="Email Pribadi"
          type="email"
          placeholder="nama@email.com"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          required
        />
        <Input
          id="email-kampus"
          label="Email Mahasiswa"
          type="email"
          placeholder="nama@mhs.itenas.ac.id"
          value={data.email_kampus}
          onChange={(e) => handleChange("email_kampus", e.target.value)}
          error={errors.email_kampus}
          helperText="Gunakan email kampus @mhs.itenas.ac.id"
          required
        />
      </div>

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
