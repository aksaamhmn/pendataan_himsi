/**
 * Data Fetching Layer — Dashboard PSDM HIMSI
 * Fungsi-fungsi untuk mengambil dan mengolah data dari Supabase
 * untuk keperluan dashboard admin.
 */

import { createClient } from "@/lib/supabase/server";

// ─── Types ─────────────────────────────────────────────────────

export interface DashboardStats {
  totalStudents: number;
  totalAspirations: number;
  topHardSkill: { name: string; count: number } | null;
  topSoftSkill: { name: string; count: number } | null;
  topMinatAkademik: { name: string; count: number } | null;
  topMinatNonAkademik: { name: string; count: number } | null;
  angkatanDistribution: { angkatan: number; count: number }[];
  skillDistribution: { name: string; category: string; count: number }[];
  interestDistribution: { name: string; category: string; count: number }[];
}

export interface StudentWithRelations {
  nim: string;
  nama: string;
  angkatan: number;
  email: string;
  email_kampus: string;
  whatsapp: string;
  ipk: number | null;
  created_at: string;
  skills: { name: string; category: string; level: string }[];
  interests: { name: string; category: string }[];
  aspirations: { feedback_text: string; created_at: string }[];
}

export interface AspirationWithStudent {
  id: string;
  feedback_text: string;
  created_at: string;
  student: {
    nama: string;
    nim: string;
    angkatan: number;
  } | null;
}

// ─── getDashboardStats ─────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // 1. Total students
  const { count: totalStudents } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true });

  // 2. Total aspirations
  const { count: totalAspirations } = await supabase
    .from("aspirations")
    .select("*", { count: "exact", head: true });

  // 3. Skill distribution (join student_skills → skills)
  const { data: skillRows } = await supabase
    .from("student_skills")
    .select("skill_id, skills(name, category)");

  const skillCounts = new Map<string, { name: string; category: string; count: number }>();
  (skillRows || []).forEach((row) => {
    const skill = row.skills as unknown as { name: string; category: string } | null;
    if (!skill) return;
    const existing = skillCounts.get(row.skill_id);
    if (existing) {
      existing.count++;
    } else {
      skillCounts.set(row.skill_id, { name: skill.name, category: skill.category, count: 1 });
    }
  });

  const skillDistribution = Array.from(skillCounts.values()).sort((a, b) => b.count - a.count);
  const topHardSkill = skillDistribution.find((s) => s.category === "hard_skill") ?? null;
  const topSoftSkill = skillDistribution.find((s) => s.category === "soft_skill") ?? null;

  // 4. Interest distribution (join student_interests → interests)
  const { data: interestRows } = await supabase
    .from("student_interests")
    .select("interest_id, interests(name, category)");

  const interestCounts = new Map<string, { name: string; category: string; count: number }>();
  (interestRows || []).forEach((row) => {
    const interest = row.interests as unknown as { name: string; category: string } | null;
    if (!interest) return;
    const existing = interestCounts.get(row.interest_id);
    if (existing) {
      existing.count++;
    } else {
      interestCounts.set(row.interest_id, { name: interest.name, category: interest.category, count: 1 });
    }
  });

  const interestDistribution = Array.from(interestCounts.values()).sort((a, b) => b.count - a.count);
  const topMinatAkademik = interestDistribution.find((i) => i.category === "akademik") ?? null;
  const topMinatNonAkademik = interestDistribution.find((i) => i.category === "non_akademik") ?? null;

  // 5. Angkatan distribution
  const { data: angkatanRows } = await supabase
    .from("students")
    .select("angkatan");

  const angkatanCounts = new Map<number, number>();
  (angkatanRows || []).forEach((row) => {
    angkatanCounts.set(row.angkatan, (angkatanCounts.get(row.angkatan) || 0) + 1);
  });
  const angkatanDistribution = Array.from(angkatanCounts.entries())
    .map(([angkatan, count]) => ({ angkatan, count }))
    .sort((a, b) => b.angkatan - a.angkatan);

  return {
    totalStudents: totalStudents ?? 0,
    totalAspirations: totalAspirations ?? 0,
    topHardSkill: topHardSkill ? { name: topHardSkill.name, count: topHardSkill.count } : null,
    topSoftSkill: topSoftSkill ? { name: topSoftSkill.name, count: topSoftSkill.count } : null,
    topMinatAkademik: topMinatAkademik ? { name: topMinatAkademik.name, count: topMinatAkademik.count } : null,
    topMinatNonAkademik: topMinatNonAkademik ? { name: topMinatNonAkademik.name, count: topMinatNonAkademik.count } : null,
    angkatanDistribution,
    skillDistribution: skillDistribution.slice(0, 10),
    interestDistribution: interestDistribution.slice(0, 10),
  };
}

// ─── getStudentsData ───────────────────────────────────────────

export async function getStudentsData(): Promise<StudentWithRelations[]> {
  const supabase = await createClient();

  const { data: students } = await supabase
    .from("students")
    .select(`
      nim,
      nama,
      angkatan,
      email,
      email_kampus,
      whatsapp,
      ipk,
      created_at,
      student_skills(level, skills(name, category)),
      student_interests(interests(name, category)),
      aspirations(feedback_text, created_at)
    `)
    .order("created_at", { ascending: false });

  if (!students) return [];

  return students.map((s) => {
    const studentSkills = s.student_skills as unknown as
      { level: string; skills: { name: string; category: string } | null }[] | null;
    const studentInterests = s.student_interests as unknown as
      { interests: { name: string; category: string } | null }[] | null;
    const studentAspirations = s.aspirations as unknown as
      { feedback_text: string; created_at: string }[] | null;

    return {
      nim: s.nim,
      nama: s.nama,
      angkatan: s.angkatan,
      email: s.email,
      email_kampus: s.email_kampus,
      whatsapp: s.whatsapp,
      ipk: s.ipk,
      created_at: s.created_at,
      skills: (studentSkills || [])
        .filter((sk) => sk.skills)
        .map((sk) => ({
          name: sk.skills!.name,
          category: sk.skills!.category,
          level: sk.level,
        })),
      interests: (studentInterests || [])
        .filter((si) => si.interests)
        .map((si) => ({
          name: si.interests!.name,
          category: si.interests!.category,
        })),
      aspirations: (studentAspirations || []).map((a) => ({
        feedback_text: a.feedback_text,
        created_at: a.created_at,
      })),
    };
  });
}

// ─── getAspirations ────────────────────────────────────────────

export async function getAspirations(): Promise<AspirationWithStudent[]> {
  const supabase = await createClient();

  const { data: aspirations, error } = await supabase
    .from("aspirations")
    .select("id, feedback_text, created_at, students(nama, nim, angkatan)")
    .order("created_at", { ascending: false });

  if (error || !aspirations) return [];

  return aspirations.map((a) => {
    const student = a.students as unknown as { nama: string; nim: string; angkatan: number } | null;
    return {
      id: a.id,
      feedback_text: a.feedback_text,
      created_at: a.created_at,
      student,
    };
  });
}

// ─── getStudentByNim ───────────────────────────────────────────

export async function getStudentByNim(nim: string): Promise<StudentWithRelations | null> {
  const supabase = await createClient();

  const { data: student, error } = await supabase
    .from("students")
    .select(`
      nim,
      nama,
      angkatan,
      email,
      email_kampus,
      whatsapp,
      ipk,
      created_at,
      student_skills(level, skills(name, category)),
      student_interests(interests(name, category)),
      aspirations(feedback_text, created_at)
    `)
    .eq("nim", nim)
    .maybeSingle();

  if (error || !student) return null;

  const studentSkills = student.student_skills as unknown as
    { level: string; skills: { name: string; category: string } | null }[] | null;
  const studentInterests = student.student_interests as unknown as
    { interests: { name: string; category: string } | null }[] | null;
  const studentAspirations = student.aspirations as unknown as
    { feedback_text: string; created_at: string }[] | null;

  return {
    nim: student.nim,
    nama: student.nama,
    angkatan: student.angkatan,
    email: student.email,
    email_kampus: student.email_kampus,
    whatsapp: student.whatsapp,
    ipk: student.ipk,
    created_at: student.created_at,
    skills: (studentSkills || [])
      .filter((sk) => sk.skills)
      .map((sk) => ({
        name: sk.skills!.name,
        category: sk.skills!.category,
        level: sk.level,
      })),
    interests: (studentInterests || [])
      .filter((si) => si.interests)
      .map((si) => ({
        name: si.interests!.name,
        category: si.interests!.category,
      })),
    aspirations: (studentAspirations || []).map((a) => ({
      feedback_text: a.feedback_text,
      created_at: a.created_at,
    })),
  };
}
