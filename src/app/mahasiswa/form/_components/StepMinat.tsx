"use client";

/**
 * StepMinat — Step 2: Pemilihan Minat (Akademik & Non-Akademik)
 * Menggunakan toggle cards/badges untuk multi-select visual.
 * Data minat di-fetch dari Supabase atau menggunakan fallback statis.
 */

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FormInterestEntry, InterestCategory } from "@/types/database";

interface StepMinatProps {
  data: FormInterestEntry[];
  onChange: (data: FormInterestEntry[]) => void;
  errors: Record<string, string>;
}

interface InterestOption {
  id: string;
  name: string;
  category: InterestCategory;
}

/* Fallback data jika fetch gagal */
const FALLBACK_INTERESTS: InterestOption[] = [
  { id: "1", name: "Software Engineering", category: "akademik" },
  { id: "2", name: "Data Science & Analytics", category: "akademik" },
  { id: "3", name: "Artificial Intelligence & Machine Learning", category: "akademik" },
  { id: "4", name: "Cybersecurity", category: "akademik" },
  { id: "5", name: "Cloud & Distributed Computing", category: "akademik" },
  { id: "6", name: "Mobile App Development", category: "akademik" },
  { id: "7", name: "Web Development", category: "akademik" },
  { id: "8", name: "Internet of Things (IoT)", category: "akademik" },
  { id: "9", name: "Game Development", category: "akademik" },
  { id: "10", name: "Blockchain & Web3", category: "akademik" },
  { id: "11", name: "IT Governance & Audit", category: "akademik" },
  { id: "12", name: "Enterprise Systems (ERP)", category: "akademik" },
  { id: "13", name: "Database & Big Data", category: "akademik" },
  { id: "14", name: "UI/UX Research", category: "akademik" },
  { id: "15", name: "Riset Akademik / Jurnal", category: "akademik" },
  { id: "16", name: "Organisasi & Kepemimpinan", category: "non_akademik" },
  { id: "17", name: "Olahraga", category: "non_akademik" },
  { id: "18", name: "Seni & Musik", category: "non_akademik" },
  { id: "19", name: "Fotografi & Videografi", category: "non_akademik" },
  { id: "20", name: "Menulis & Konten Kreasi", category: "non_akademik" },
  { id: "21", name: "Volunteering / Sosial", category: "non_akademik" },
  { id: "22", name: "Entrepreneurship / Bisnis", category: "non_akademik" },
  { id: "23", name: "Debat & Public Speaking", category: "non_akademik" },
  { id: "24", name: "Travelling & Exploring", category: "non_akademik" },
  { id: "25", name: "Gaming & Esports", category: "non_akademik" },
  { id: "26", name: "Desain Grafis & Digital Art", category: "non_akademik" },
  { id: "27", name: "Event Organizing", category: "non_akademik" },
  { id: "28", name: "Competitive Programming", category: "non_akademik" },
  { id: "29", name: "Komunitas & Networking", category: "non_akademik" },
  { id: "30", name: "Self Development & Produktivitas", category: "non_akademik" },
];

const CATEGORY_CONFIG = {
  akademik: {
    label: "🎓 Minat Akademik",
    description: "Bidang studi dan topik akademis yang kamu minati",
    gradient: "from-blue-50/50 to-blue-50/50",
    border: "border-blue-200",
    activeBg: "bg-blue-100 border-blue-400 text-blue-700 shadow-sm",
    inactiveBg: "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400",
  },
  non_akademik: {
    label: "🎯 Minat Non-Akademik",
    description: "Kegiatan, hobi, dan minat di luar akademik",
    gradient: "from-purple-50/50 to-purple-50/50",
    border: "border-purple-200",
    activeBg: "bg-purple-100 border-purple-400 text-purple-700 shadow-sm",
    inactiveBg: "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400",
  },
};

export default function StepMinat({ data, onChange, errors }: StepMinatProps) {
  const [interests, setInterests] = useState<InterestOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch interests dari Supabase
  useEffect(() => {
    async function fetchInterests() {
      try {
        const supabase = createClient();
        const { data: rows, error } = await supabase
          .from("interests")
          .select("id, name, category")
          .order("name");

        if (error) throw error;
        setInterests(
          (rows || []).map((r) => ({
            id: r.id,
            name: r.name,
            category: r.category as InterestCategory,
          }))
        );
      } catch {
        setInterests(FALLBACK_INTERESTS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInterests();
  }, []);

  const selectedIds = new Set(data.map((d) => d.interest_id));

  const toggleInterest = useCallback(
    (interest: InterestOption) => {
      if (selectedIds.has(interest.id)) {
        onChange(data.filter((d) => d.interest_id !== interest.id));
      } else {
        onChange([
          ...data,
          {
            interest_id: interest.id,
            interest_name: interest.name,
            category: interest.category,
          },
        ]);
      }
    },
    [data, onChange, selectedIds]
  );

  const akademik = interests.filter((i) => i.category === "akademik");
  const nonAkademik = interests.filter((i) => i.category === "non_akademik");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memuat daftar minat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200 mb-3">
          <svg className="w-3.5 h-3.5 text-yellow-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <span className="text-xs font-medium text-yellow-700">Step 2 dari 4</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Minat & Bakat</h2>
        <p className="text-sm text-gray-500 mt-1">
          Pilih minat yang sesuai dengan dirimu. Kamu bisa memilih lebih dari satu.
        </p>
        {errors.interests && (
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {errors.interests}
          </p>
        )}
      </div>

      {/* Selected counter */}
      {data.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span className="text-sm text-green-700">
            <span className="font-semibold">{data.length}</span> minat dipilih
          </span>
        </div>
      )}

      {/* Categories */}
      {(["akademik", "non_akademik"] as const).map((category) => {
        const config = CATEGORY_CONFIG[category];
        const items = category === "akademik" ? akademik : nonAkademik;

        return (
          <div key={category} className={`rounded-xl border ${config.border} bg-gradient-to-br ${config.gradient} p-4 bg-white/50`}>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-900">{config.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((interest) => {
                const isSelected = selectedIds.has(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                      border transition-all duration-200 cursor-pointer
                      ${isSelected ? config.activeBg + " shadow-md" : config.inactiveBg}
                    `}
                  >
                    {isSelected && (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    )}
                    {interest.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
