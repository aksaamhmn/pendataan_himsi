/**
 * API Route: Form Submission
 * Endpoint untuk menerima dan menyimpan data formulir mahasiswa.
 * POST /api/form
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { FormData } from "@/types/database";

export async function POST(request: Request) {
  try {
    const body: FormData = await request.json();
    const supabase = await createClient();

    // 1. Insert data mahasiswa
    const { error: studentError } = await supabase
      .from("students")
      .insert({
        nim: body.biodata.nim,
        nama: body.biodata.nama,
        angkatan: body.biodata.angkatan,
        email: body.biodata.email,
        whatsapp: body.biodata.whatsapp,
      });

    if (studentError) {
      // Jika NIM sudah ada, kembalikan error yang informatif
      if (studentError.code === "23505") {
        return NextResponse.json(
          { error: "NIM sudah terdaftar. Setiap mahasiswa hanya dapat mengisi formulir satu kali." },
          { status: 409 }
        );
      }
      throw studentError;
    }

    // 2. Insert student_skills (batch)
    if (body.skills.length > 0) {
      const skillsToInsert = body.skills.map((s) => ({
        student_id: body.biodata.nim,
        skill_id: s.skill_id,
        level: s.level,
      }));

      const { error: skillsError } = await supabase
        .from("student_skills")
        .insert(skillsToInsert);

      if (skillsError) throw skillsError;
    }

    // 3. Insert student_interests (batch)
    if (body.interests.length > 0) {
      const interestsToInsert = body.interests.map((i) => ({
        student_id: body.biodata.nim,
        interest_id: i.interest_id,
      }));

      const { error: interestsError } = await supabase
        .from("student_interests")
        .insert(interestsToInsert);

      if (interestsError) throw interestsError;
    }

    // 4. Insert aspiration
    if (body.aspiration.feedback_text.trim()) {
      const { error: aspirationError } = await supabase
        .from("aspirations")
        .insert({
          student_id: body.biodata.nim,
          feedback_text: body.aspiration.feedback_text,
        });

      if (aspirationError) throw aspirationError;
    }

    return NextResponse.json(
      { message: "Data berhasil disimpan!", nim: body.biodata.nim },
      { status: 201 }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
