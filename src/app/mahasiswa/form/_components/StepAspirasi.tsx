"use client";

/**
 * StepAspirasi — Step 4: Aspirasi & Review + Submit
 * Textarea untuk aspirasi + ringkasan data + submit.
 */

import { useMemo } from "react";
import type { FormData, FormAspiration } from "@/types/database";

interface StepAspirasiProps {
  aspiration: FormAspiration;
  formData: FormData;
  onChangeAspiration: (data: FormAspiration) => void;
  errors: Record<string, string>;
  ipk?: string;
}

const LEVEL_LABELS: Record<string, { label: string; }> = {
  pemula: { label: "Pemula"},
  menengah: { label: "Menengah"},
  mahir: { label: "Mahir"},
};

export default function StepAspirasi({
  aspiration,
  formData,
  onChangeAspiration,
  errors,
  ipk,
}: StepAspirasiProps) {
  const charCount = aspiration.feedback_text.length;

  // Group skills by category
  const { hardSkills, softSkills } = useMemo(() => {
    const hard = formData.skills.filter((s) => s.category === "hard_skill");
    const soft = formData.skills.filter((s) => s.category === "soft_skill");
    return { hardSkills: hard, softSkills: soft };
  }, [formData.skills]);

  // Group interests by category
  const { akademik, nonAkademik } = useMemo(() => {
    const ak = formData.interests.filter((i) => i.category === "akademik");
    const na = formData.interests.filter((i) => i.category === "non_akademik");
    return { akademik: ak, nonAkademik: na };
  }, [formData.interests]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200 mb-3">
          <svg className="w-3.5 h-3.5 text-green-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          <span className="text-xs font-medium text-green-700">Step 4 dari 4</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Aspirasi & Review</h2>
        <p className="text-sm text-gray-500 mt-1">
          Sampaikan aspirasimu dan pastikan data yang kamu isi sudah benar.
        </p>
      </div>

      {/* Textarea Aspirasi */}
      <div className="space-y-1.5">
        <label htmlFor="aspirasi" className="block text-sm font-medium text-gray-700">
          Aspirasi / Feedback untuk HIMSI atau Program Studi Sistem Informasi
        </label>
        <textarea
          id="aspirasi"
          rows={4}
          placeholder="Tuliskan aspirasi, masukan, harapan, atau saranmu untuk pengembangan divisi PSDM dan HIMSI ke depannya..."
          value={aspiration.feedback_text}
          onChange={(e) => onChangeAspiration({ feedback_text: e.target.value })}
          className={`
            w-full px-4 py-3 rounded-lg resize-none
            bg-white border text-gray-900 text-sm
            placeholder:text-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white
            ${errors.aspiration
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
            }
          `}
        />
        <div className="flex justify-between items-center">
          {errors.aspiration ? (
            <p className="text-sm text-red-500">{errors.aspiration}</p>
          ) : (
            <p className="text-xs text-gray-500">Opsional, tapi sangat dihargai</p>
          )}
          <p className={`text-xs ${charCount > 1000 ? "text-red-500" : "text-gray-500"}`}>
            {charCount} karakter
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-gray-500 uppercase tracking-wider">Ringkasan Data</span>
        </div>
      </div>

      {/* Review Summary */}
      <div className="space-y-4">
        {/* Biodata */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Data Diri
          </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Nama</p>
                <p className="text-sm font-medium text-gray-900">{formData.biodata.nama || "-"}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">NIM</p>
                <p className="text-sm font-medium text-gray-900">{formData.biodata.nim || "-"}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Angkatan</p>
                <p className="text-sm font-medium text-gray-900">{formData.biodata.angkatan || "-"}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">IPK</p>
                <p className="text-sm font-medium text-gray-900">{ipk || "-"}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">WhatsApp</p>
                <p className="text-sm font-medium text-gray-900">{formData.biodata.whatsapp || "-"}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Email</p>
                <p className="text-sm font-medium text-gray-900 truncate">{formData.biodata.email || "-"}</p>
              </div>
            </div>
        </div>

        {/* Minat */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            Minat ({formData.interests.length})
          </h4>
          {formData.interests.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Belum ada minat yang dipilih</p>
          ) : (
            <div className="space-y-2">
              {akademik.length > 0 && (
                <div>
                  <p className="text-xs text-blue-700 font-medium mb-1">Akademik</p>
                  <div className="flex flex-wrap gap-1.5">
                    {akademik.map((i) => (
                      <span key={i.interest_id} className="inline-flex px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">
                        {i.interest_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {nonAkademik.length > 0 && (
                <div>
                  <p className="text-xs text-purple-700 font-medium mb-1">Non-Akademik</p>
                  <div className="flex flex-wrap gap-1.5">
                    {nonAkademik.map((i) => (
                      <span key={i.interest_id} className="inline-flex px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 border border-purple-200">
                        {i.interest_name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
            Keterampilan ({formData.skills.length})
          </h4>
          {formData.skills.length === 0 ? (
            <p className="text-sm text-gray-500 italic">Belum ada keterampilan yang dipilih</p>
          ) : (
            <div className="space-y-2">
              {hardSkills.length > 0 && (
                <div>
                  <p className="text-xs text-blue-700 font-medium mb-1">Hard Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {hardSkills.map((s) => {
                      const lvl = LEVEL_LABELS[s.level];
                      return (
                        <span key={s.skill_id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">
                          {s.skill_name}
                          <span className="opacity-75">·  {lvl.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {softSkills.length > 0 && (
                <div>
                  <p className="text-xs text-yellow-700 font-medium mb-1">Soft Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {softSkills.map((s) => {
                      const lvl = LEVEL_LABELS[s.level];
                      return (
                        <span key={s.skill_id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 border border-yellow-200">
                          {s.skill_name}
                          <span className="opacity-75">· {lvl.label}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
