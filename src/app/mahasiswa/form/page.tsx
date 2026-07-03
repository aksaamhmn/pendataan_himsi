/**
 * Form page — Entry point untuk formulir pendataan mahasiswa PSDM HIMSI.
 * Server component yang merender FormPageClient atau Blocker.
 * Mendukung mode=edit untuk mengedit data yang sudah ada.
 */

import type { Metadata } from "next";
import FormPageClient from "./_components/FormPageClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { FormData } from "@/types/database";

export const metadata: Metadata = {
  title: "Formulir Pendataan — PSDM HIMSI",
  description:
    "Formulir online untuk mendata minat, bakat, hard skills, soft skills, dan aspirasi mahasiswa Sistem Informasi.",
};

export const dynamic = "force-dynamic";

export default async function FormPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const supabase = await createClient();
  const { mode } = await searchParams;
  const isEditMode = mode === "edit";

  // Dapatkan user dari session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Extract NRP dari email dummy (nrp@himsi.local → nrp)
  const email = user.email || "";
  const nrp = email.replace("@himsi.local", "");

  // Cek apakah data sudah ada (sudah mengisi)
  const { data: student } = await supabase
    .from("students")
    .select(`
      nim, nama, angkatan, email, whatsapp,
      student_skills(level, skills(id, name, category)),
      student_interests(interests(id, name, category)),
      aspirations(feedback_text)
    `)
    .eq("nim", nrp)
    .single();

  // ─── Cek Status Form Terbuka/Tertutup ──────────────────────
  const { data: setting } = await (supabase as any)
    .from("app_settings")
    .select("setting_value")
    .eq("setting_key", "is_form_open")
    .single();

  const isFormOpen = setting?.setting_value === true;

  // ─── Blocker State: Form Tertutup (bukan mode edit) ────────
  if (!isFormOpen && !isEditMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Formulir Ditutup
          </h2>
          <p className="text-gray-500 mb-8">
            Periode pendataan telah ditutup. Hubungi admin PSDM untuk informasi lebih lanjut.
          </p>
          <Link href="/mahasiswa/dashboard" className="block w-full">
            <Button variant="primary" className="w-full">
              Kembali ke Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // ─── Mode Edit: Hydrate form dengan data lama ────────────────
  if (isEditMode && student) {
    const skillsList = (student.student_skills as unknown as any[]) || [];
    const interestsList = (student.student_interests as unknown as any[]) || [];
    const aspirationsList = (student.aspirations as unknown as any[]) || [];

    const initialData: FormData = {
      biodata: {
        nim: student.nim,
        nama: student.nama,
        angkatan: student.angkatan,
        email: student.email,
        whatsapp: student.whatsapp,
      },
      skills: skillsList
        .filter((s: any) => s.skills)
        .map((s: any) => ({
          skill_id: s.skills.id,
          skill_name: s.skills.name,
          category: s.skills.category,
          level: s.level,
        })),
      interests: interestsList
        .filter((i: any) => i.interests)
        .map((i: any) => ({
          interest_id: i.interests.id,
          interest_name: i.interests.name,
          category: i.interests.category,
        })),
      aspiration: {
        feedback_text: aspirationsList[0]?.feedback_text || "",
      },
      newInterests: [],
      newSkills: [],
    };

    return <FormPageClient sessionNim={nrp} initialData={initialData} />;
  }

  // ─── Blocker State: Sudah mengisi dan BUKAN mode edit ────────
  if (student && !isEditMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Formulir Sudah Diisi
          </h2>
          <p className="text-gray-500 mb-8">
            Anda sudah berpartisipasi dalam pendataan ini. Terima kasih atas
            waktu Anda!
          </p>
          <Link href="/mahasiswa/profile" className="block w-full">
            <Button variant="secondary" className="w-full">
              Lihat Profile Saya
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Render form jika belum mengisi
  return <FormPageClient sessionNim={nrp} />;
}
