/**
 * API Route: Form Submission
 * Endpoint untuk menerima dan menyimpan data formulir mahasiswa.
 * POST /api/form
 *
 * Mendukung:
 * - isEdit=false: Insert baru (alur normal)
 * - isEdit=true: Wipe & Replace (update biodata, hapus relasi lama, insert relasi baru)
 * - newInterests / newSkills: check-then-insert ke master
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { FormData } from "@/types/database";

interface SubmitPayload extends FormData {
  isEdit?: boolean;
}

export async function POST(request: Request) {
  try {
    const body: SubmitPayload = await request.json();
    const supabase = await createClient();
    const isEdit = body.isEdit === true;

    // ─── 1. Resolve custom interests (check-then-insert) ───────
    const allInterestIds: string[] = body.interests.map((i) => i.interest_id);

    if (body.newInterests && body.newInterests.length > 0) {
      for (const item of body.newInterests) {
        const { data: existing, error: lookupError } = await supabase
          .from("interests")
          .select("id")
          .ilike("name", item.name)
          .maybeSingle();

        if (lookupError) throw lookupError;

        if (existing) {
          allInterestIds.push(existing.id);
        } else {
          const { data: inserted, error: insertError } = await supabase
            .from("interests")
            .insert({ name: item.name, category: item.category })
            .select("id")
            .single();

          if (insertError) throw insertError;
          allInterestIds.push(inserted.id);
        }
      }
    }

    // ─── 2. Resolve custom skills (check-then-insert) ──────────
    interface SkillWithLevel {
      id: string;
      level: string;
    }

    const allSkillEntries: SkillWithLevel[] = body.skills.map((s) => ({
      id: s.skill_id,
      level: s.level,
    }));

    if (body.newSkills && body.newSkills.length > 0) {
      for (const item of body.newSkills) {
        const { data: existing, error: lookupError } = await supabase
          .from("skills")
          .select("id")
          .ilike("name", item.name)
          .maybeSingle();

        if (lookupError) throw lookupError;

        if (existing) {
          allSkillEntries.push({ id: existing.id, level: item.level });
        } else {
          const { data: inserted, error: insertError } = await supabase
            .from("skills")
            .insert({ name: item.name, category: item.category })
            .select("id")
            .single();

          if (insertError) throw insertError;
          allSkillEntries.push({ id: inserted.id, level: item.level });
        }
      }
    }

    // ─── 3. Insert atau Update data mahasiswa ───────────────────
    if (isEdit) {
      // UPDATE biodata
      const { error: updateError } = await supabase
        .from("students")
        .update({
          nama: body.biodata.nama,
          angkatan: body.biodata.angkatan,
          email: body.biodata.email,
          whatsapp: body.biodata.whatsapp,
        })
        .eq("nim", body.biodata.nim);

      if (updateError) throw updateError;

      // WIPE relasi lama
      const { error: delSkillsErr } = await supabase
        .from("student_skills")
        .delete()
        .eq("student_id", body.biodata.nim);
      if (delSkillsErr) throw delSkillsErr;

      const { error: delInterestsErr } = await supabase
        .from("student_interests")
        .delete()
        .eq("student_id", body.biodata.nim);
      if (delInterestsErr) throw delInterestsErr;

      // UPDATE aspirasi (upsert: hapus lama, insert baru)
      const { error: delAspErr } = await supabase
        .from("aspirations")
        .delete()
        .eq("student_id", body.biodata.nim);
      if (delAspErr) throw delAspErr;

    } else {
      // INSERT baru
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
        if (studentError.code === "23505") {
          return NextResponse.json(
            { error: "NIM sudah terdaftar. Setiap mahasiswa hanya dapat mengisi formulir satu kali." },
            { status: 409 }
          );
        }
        throw studentError;
      }
    }

    // ─── 4. Insert student_interests (gabungan lama + baru) ─────
    if (allInterestIds.length > 0) {
      const interestsToInsert = allInterestIds.map((interestId) => ({
        student_id: body.biodata.nim,
        interest_id: interestId,
      }));

      const { error: interestsError } = await supabase
        .from("student_interests")
        .insert(interestsToInsert);

      if (interestsError) throw interestsError;
    }

    // ─── 5. Insert student_skills (gabungan lama + baru) ────────
    if (allSkillEntries.length > 0) {
      const skillsToInsert = allSkillEntries.map((entry) => ({
        student_id: body.biodata.nim,
        skill_id: entry.id,
        level: entry.level,
      }));

      const { error: skillsError } = await supabase
        .from("student_skills")
        .insert(skillsToInsert);

      if (skillsError) throw skillsError;
    }

    // ─── 6. Insert aspiration ───────────────────────────────────
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
      {
        message: isEdit ? "Data berhasil diperbarui!" : "Data berhasil disimpan!",
        nim: body.biodata.nim,
      },
      { status: isEdit ? 200 : 201 }
    );
  } catch (error: any) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
