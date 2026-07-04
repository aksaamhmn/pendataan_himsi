/**
 * API Route: Sync IPK dari Sistem Akademik Kampus
 *
 * POST /api/mahasiswa/sync-ipk
 * Body: { nrp: string }
 *
 * Melakukan server-side fetch ke API kampus (bypass CORS),
 * mengambil data IPK, dan menyimpannya ke tabel students di Supabase.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Semester aktif — letakkan di variabel agar mudah diubah nanti
const ACTIVE_SEMESTER = "20252";

export async function POST(request: Request) {
  try {
    const { nrp } = await request.json();

    if (!nrp || typeof nrp !== "string") {
      return NextResponse.json(
        { success: false, error: "NRP wajib diisi." },
        { status: 400 }
      );
    }

    const trimmedNrp = nrp.trim();

    // ─── Fetch data dari API Akademik Kampus ─────────────────
    const apiUrl = `https://mahasiswa.itenas.ac.id/mahasiswa/AKT258-11-header-mahasiswa?nimhs=${trimmedNrp}&thsms=${ACTIVE_SEMESTER}`;

    let akademikData: any;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          Referer: "https://mahasiswa.itenas.ac.id/",
        },
        // Tidak cache agar selalu fresh
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API kampus mengembalikan status ${response.status}`);
      }

      akademikData = await response.json();
    } catch (fetchError: any) {
      return NextResponse.json(
        {
          success: false,
          error: `Gagal mengambil data dari sistem akademik: ${fetchError.message}`,
        },
        { status: 502 }
      );
    }

    // ─── Parse data IPK ──────────────────────────────────────
    if (
      !akademikData ||
      !Array.isArray(akademikData.data) ||
      akademikData.data.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Data akademik tidak ditemukan untuk NRP tersebut.",
          ipk: null,
        },
        { status: 404 }
      );
    }

    const rawIpk = akademikData.data[0]?.disp_IPK;

    if (rawIpk === undefined || rawIpk === null) {
      return NextResponse.json(
        {
          success: false,
          error: "Kolom IPK tidak tersedia pada data akademik.",
          ipk: null,
        },
        { status: 404 }
      );
    }

    const ipkValue = parseFloat(String(rawIpk));

    if (isNaN(ipkValue)) {
      return NextResponse.json(
        {
          success: false,
          error: `Nilai IPK tidak valid: "${rawIpk}"`,
          ipk: null,
        },
        { status: 422 }
      );
    }

    // ─── Simpan IPK ke tabel students di Supabase ────────────
    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from("students")
      .update({ ipk: ipkValue })
      .eq("nim", trimmedNrp);

    if (updateError) {
      // Jika kolom ipk belum ada, beri pesan yang jelas
      return NextResponse.json(
        {
          success: false,
          error: `Gagal menyimpan IPK ke database: ${updateError.message}`,
          ipk: ipkValue,
        },
        { status: 500 }
      );
    }

    // ─── Kembalikan hasil sukses ──────────────────────────────
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
