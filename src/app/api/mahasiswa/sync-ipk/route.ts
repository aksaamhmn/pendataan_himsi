/**
 * API Route: Save IPK ke Supabase
 *
 * POST /api/mahasiswa/sync-ipk
 * Body: { nrp: string, ipk: number }
 *
 * Menerima nilai IPK yang sudah di-fetch oleh browser client
 * (karena fetch dari serverless Netlify diblokir oleh ITENAS),
 * lalu menyimpannya ke tabel students di Supabase.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { nrp, ipk } = await request.json();

    if (!nrp || typeof nrp !== "string") {
      return NextResponse.json(
        { success: false, error: "NRP wajib diisi." },
        { status: 400 }
      );
    }

    if (ipk === undefined || ipk === null) {
      return NextResponse.json(
        { success: false, error: "Nilai IPK wajib diisi." },
        { status: 400 }
      );
    }

    const ipkValue = parseFloat(String(ipk));

    if (isNaN(ipkValue)) {
      return NextResponse.json(
        { success: false, error: `Nilai IPK tidak valid: "${ipk}"` },
        { status: 422 }
      );
    }

    // ─── Simpan IPK ke tabel students di Supabase ────────────
    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from("students")
      .update({ ipk: ipkValue })
      .eq("nim", nrp.trim());

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          error: `Gagal menyimpan IPK ke database: ${updateError.message}`,
          ipk: ipkValue,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ipk: ipkValue,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
