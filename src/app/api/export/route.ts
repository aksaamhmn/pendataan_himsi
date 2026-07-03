/**
 * API Route: Export Data to CSV
 * Endpoint untuk mengunduh data mahasiswa dalam format CSV.
 * GET /api/export
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Query semua mahasiswa dengan relasi skills, interests, dan aspirations
    const { data: students, error } = await supabase
      .from("students")
      .select(`
        nim,
        nama,
        angkatan,
        email,
        whatsapp,
        created_at,
        student_skills(level, skills(name, category)),
        student_interests(interests(name, category)),
        aspirations(feedback_text)
      `)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    if (!students || students.length === 0) {
      return new NextResponse("Belum ada data mahasiswa", { status: 404 });
    }

    // CSV Header
    const headers = [
      "No",
      "NIM",
      "Nama",
      "Angkatan",
      "Email",
      "WhatsApp",
      "Hard Skills",
      "Soft Skills",
      "Minat Akademik",
      "Minat Non-Akademik",
      "Aspirasi",
      "Tanggal Daftar",
    ];

    // Format rows
    const rows = students.map((student, index) => {
      const studentSkills = student.student_skills as unknown as { level: string; skills: { name: string; category: string } | null }[] | null;
      const studentInterests = student.student_interests as unknown as { interests: { name: string; category: string } | null }[] | null;
      const studentAspirations = student.aspirations as unknown as { feedback_text: string }[] | null;

      const skills = (studentSkills || []).filter(sk => sk.skills).map(sk => ({
        name: sk.skills!.name,
        category: sk.skills!.category,
        level: sk.level,
      }));

      const interests = (studentInterests || []).filter(i => i.interests).map(i => ({
        name: i.interests!.name,
        category: i.interests!.category,
      }));

      const hardSkills = skills.filter(s => s.category === "hard_skill").map(s => `${s.name} (${s.level})`).join("; ");
      const softSkills = skills.filter(s => s.category === "soft_skill").map(s => `${s.name} (${s.level})`).join("; ");
      
      const minatAkademik = interests.filter(i => i.category === "akademik").map(i => i.name).join("; ");
      const minatNonAkademik = interests.filter(i => i.category === "non_akademik").map(i => i.name).join("; ");

      const aspirasi = studentAspirations && studentAspirations.length > 0 
        ? studentAspirations[0].feedback_text.replace(/"/g, '""').replace(/\n/g, ' ') // Escape quotes and newlines for CSV
        : "";

      const tanggalDaftar = new Date(student.created_at).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Format as CSV row
      return [
        index + 1,
        student.nim,
        `"${student.nama}"`,
        student.angkatan,
        student.email,
        student.whatsapp,
        `"${hardSkills}"`,
        `"${softSkills}"`,
        `"${minatAkademik}"`,
        `"${minatNonAkademik}"`,
        `"${aspirasi}"`,
        `"${tanggalDaftar}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="data_mahasiswa_himsi.csv"',
      },
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return new NextResponse("Gagal melakukan export data", { status: 500 });
  }
}
