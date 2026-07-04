"use client";

/**
 * StepSkill — Step 3: Pendataan Hard Skill & Soft Skill
 * Saat skill dipilih, muncul opsi level penguasaan (Pemula/Menengah/Mahir).
 * Data skill di-fetch dari Supabase atau menggunakan fallback statis.
 */

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { FormSkillEntry, SkillCategory, SkillLevel, NewSkillEntry } from "@/types/database";

interface StepSkillProps {
  data: FormSkillEntry[];
  onChange: (data: FormSkillEntry[]) => void;
  newSkills: NewSkillEntry[];
  onNewSkillsChange: (data: NewSkillEntry[]) => void;
  errors: Record<string, string>;
}

interface SkillOption {
  id: string;
  name: string;
  category: SkillCategory;
}

const LEVEL_OPTIONS: { value: SkillLevel; label: string; color: string }[] = [
  { value: "pemula", label: "Pemula", color: "border-green-200 bg-green-100 text-green-700" },
  { value: "menengah", label: "Menengah", color: "border-yellow-200 bg-yellow-100 text-yellow-700" },
  { value: "mahir", label: "Mahir", color: "border-purple-200 bg-purple-100 text-purple-700" },
];

const INACTIVE_LEVEL = "border-gray-200 bg-white text-gray-500 hover:bg-gray-50";

/* Fallback data */
const FALLBACK_HARD_SKILLS: SkillOption[] = [
  { id: "hs1", name: "JavaScript/TypeScript", category: "hard_skill" },
  { id: "hs2", name: "Python", category: "hard_skill" },
  { id: "hs3", name: "Java", category: "hard_skill" },
  { id: "hs4", name: "PHP", category: "hard_skill" },
  { id: "hs5", name: "C/C++", category: "hard_skill" },
  { id: "hs6", name: "SQL & Database Management", category: "hard_skill" },
  { id: "hs7", name: "HTML & CSS", category: "hard_skill" },
  { id: "hs8", name: "React / Next.js", category: "hard_skill" },
  { id: "hs9", name: "Laravel", category: "hard_skill" },
  { id: "hs10", name: "Flutter / Dart", category: "hard_skill" },
  { id: "hs11", name: "Data Analysis & Visualization", category: "hard_skill" },
  { id: "hs12", name: "Machine Learning / AI", category: "hard_skill" },
  { id: "hs13", name: "Cloud Computing (AWS/GCP/Azure)", category: "hard_skill" },
  { id: "hs14", name: "Git & Version Control", category: "hard_skill" },
  { id: "hs15", name: "UI/UX Design (Figma/Adobe XD)", category: "hard_skill" },
  { id: "hs16", name: "Project Management", category: "hard_skill" },
];

const FALLBACK_SOFT_SKILLS: SkillOption[] = [
  { id: "ss1", name: "Komunikasi", category: "soft_skill" },
  { id: "ss2", name: "Kepemimpinan (Leadership)", category: "soft_skill" },
  { id: "ss3", name: "Kerja Tim (Teamwork)", category: "soft_skill" },
  { id: "ss4", name: "Problem Solving", category: "soft_skill" },
  { id: "ss5", name: "Critical Thinking", category: "soft_skill" },
  { id: "ss6", name: "Time Management", category: "soft_skill" },
  { id: "ss7", name: "Public Speaking", category: "soft_skill" },
  { id: "ss8", name: "Kreativitas", category: "soft_skill" },
  { id: "ss9", name: "Adaptabilitas", category: "soft_skill" },
  { id: "ss10", name: "Decision Making", category: "soft_skill" },
];

const CATEGORY_CONFIG = {
  hard_skill: {
    label: "💻 Hard Skills",
    description: "Keterampilan teknis yang kamu kuasai",
    gradient: "from-blue-50/50 to-blue-50/50",
    border: "border-blue-200",
    activeBg: "bg-blue-100 border-blue-400 ring-1 ring-blue-400/30",
    activeText: "text-blue-700",
  },
  soft_skill: {
    label: "🤝 Soft Skills",
    description: "Keterampilan interpersonal dan kemampuan non-teknis",
    gradient: "from-yellow-50/50 to-yellow-50/50",
    border: "border-yellow-200",
    activeBg: "bg-yellow-100 border-yellow-400 ring-1 ring-yellow-400/30",
    activeText: "text-yellow-700",
  },
};

export default function StepSkill({ data, onChange, newSkills, onNewSkillsChange, errors }: StepSkillProps) {
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customInputs, setCustomInputs] = useState<Record<string, { name: string; level: SkillLevel }>>({
    hard_skill: { name: "", level: "pemula" },
    soft_skill: { name: "", level: "pemula" },
  });

  useEffect(() => {
    async function fetchSkills() {
      try {
        const supabase = createClient();
        const { data: rows, error } = await supabase
          .from("skills")
          .select("id, name, category")
          .eq("is_active", true)
          .order("name");

        if (error) throw error;
        setSkills(
          (rows || []).map((r) => ({
            id: r.id,
            name: r.name,
            category: r.category as SkillCategory,
          }))
        );
      } catch {
        setSkills([...FALLBACK_HARD_SKILLS, ...FALLBACK_SOFT_SKILLS]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSkills();
  }, []);

  const selectedMap = new Map(data.map((d) => [d.skill_id, d]));

  const toggleSkill = useCallback(
    (skill: SkillOption) => {
      if (selectedMap.has(skill.id)) {
        onChange(data.filter((d) => d.skill_id !== skill.id));
      } else {
        onChange([
          ...data,
          {
            skill_id: skill.id,
            skill_name: skill.name,
            category: skill.category,
            level: "pemula",
          },
        ]);
      }
    },
    [data, onChange, selectedMap]
  );

  const updateLevel = useCallback(
    (skillId: string, level: SkillLevel) => {
      onChange(data.map((d) => (d.skill_id === skillId ? { ...d, level } : d)));
    },
    [data, onChange]
  );

  const addCustomSkill = useCallback(
    (category: SkillCategory) => {
      const input = customInputs[category];
      const name = input?.name?.trim();
      if (!name) return;
      const exists = newSkills.some(
        (ns) => ns.name.toLowerCase() === name.toLowerCase() && ns.category === category
      );
      if (exists) return;
      onNewSkillsChange([...newSkills, { name, category, level: input.level }]);
      setCustomInputs((prev) => ({ ...prev, [category]: { name: "", level: "pemula" } }));
    },
    [customInputs, newSkills, onNewSkillsChange]
  );

  const removeCustomSkill = useCallback(
    (index: number) => {
      onNewSkillsChange(newSkills.filter((_, i) => i !== index));
    },
    [newSkills, onNewSkillsChange]
  );

  const hardSkills = skills.filter((s) => s.category === "hard_skill");
  const softSkills = skills.filter((s) => s.category === "soft_skill");

  const totalSelected = data.length + newSkills.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memuat daftar keterampilan...</p>
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
          <span className="text-xs font-medium text-yellow-700">Step 3 dari 4</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Keterampilan</h2>
        <p className="text-sm text-gray-500 mt-1">
          Pilih skill yang kamu miliki, lalu tentukan level penguasaanmu. Atau tambahkan sendiri.
        </p>
        {errors.skills && (
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {errors.skills}
          </p>
        )}
      </div>

      {/* Selected counter */}
      {totalSelected > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span className="text-sm text-green-700">
            <span className="font-semibold">{totalSelected}</span> keterampilan dipilih
          </span>
        </div>
      )}

      {/* Skill Categories */}
      {(["hard_skill", "soft_skill"] as const).map((category) => {
        const config = CATEGORY_CONFIG[category];
        const items = category === "hard_skill" ? hardSkills : softSkills;
        const customForCategory = newSkills.filter((ns) => ns.category === category);

        return (
          <div key={category} className={`rounded-xl border ${config.border} bg-gradient-to-br ${config.gradient} p-4 bg-white/50`}>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">{config.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
            </div>

            <div className="space-y-2">
              {items.map((skill) => {
                const selected = selectedMap.get(skill.id);
                const isSelected = !!selected;

                return (
                  <div key={skill.id} className="space-y-2">
                    {/* Skill toggle button */}
                    <button
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`
                        w-full text-left px-3.5 py-2.5 rounded-lg border transition-all duration-200
                        flex items-center justify-between group
                        ${isSelected
                          ? `${config.activeBg}`
                          : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        }
                      `}
                    >
                      <span className={`text-sm font-medium ${isSelected ? config.activeText : "text-gray-600"}`}>
                        {skill.name}
                      </span>
                      <div
                        className={`
                          w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                          ${isSelected
                            ? "border-current bg-current/10"
                            : "border-gray-300 group-hover:border-gray-400"
                          }
                        `}
                      >
                        {isSelected && (
                          <svg className={`w-3 h-3 ${config.activeText}`} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                    </button>

                    {/* Level selector (hanya tampil jika skill dipilih) */}
                    {isSelected && (
                      <div className="flex gap-2 pl-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {LEVEL_OPTIONS.map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() => updateLevel(skill.id, level.value)}
                            className={`
                              flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium
                              border transition-all duration-200
                              ${selected.level === level.value ? level.color : INACTIVE_LEVEL}
                            `}
                          >
                            <span>{level.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Custom skill badges */}
              {customForCategory.map((cs, idx) => {
                const globalIdx = newSkills.findIndex(
                  (ns) => ns.name === cs.name && ns.category === cs.category
                );
                const levelOption = LEVEL_OPTIONS.find((l) => l.value === cs.level);
                return (
                  <div
                    key={`custom-${idx}`}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border-2 border-dashed border-yellow-500 bg-yellow-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-yellow-800">{cs.name}</span>
                      <span className="text-xs text-yellow-600"> {levelOption?.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCustomSkill(globalIdx)}
                      className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-yellow-200 transition-colors text-yellow-700"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Custom input "Lainnya" */}
            <div className="mt-3 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Tambah skill lainnya..."
                value={customInputs[category]?.name || ""}
                onChange={(e) =>
                  setCustomInputs((prev) => ({
                    ...prev,
                    [category]: { ...prev[category], name: e.target.value },
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomSkill(category);
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
              <div className="flex gap-2">
                <select
                  value={customInputs[category]?.level || "pemula"}
                  onChange={(e) =>
                    setCustomInputs((prev) => ({
                      ...prev,
                      [category]: { ...prev[category], level: e.target.value as SkillLevel },
                    }))
                  }
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  <option value="pemula">Pemula</option>
                  <option value="menengah">Menengah</option>
                  <option value="mahir">Mahir</option>
                </select>
                <button
                  type="button"
                  onClick={() => addCustomSkill(category)}
                  disabled={!customInputs[category]?.name?.trim()}
                  className="px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  + Tambah
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
