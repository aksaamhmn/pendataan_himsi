/**
 * API Route: Bulk Create Users
 *
 * Endpoint rahasia untuk membuat ratusan akun Supabase Auth secara
 * sekuensial menggunakan Service Role Key (melewati rate limit).
 *
 * POST /api/admin/bulk-create-users
 * Body: [{ nrp: string, pin: string }, ...]
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface UserInput {
  nrp: string;
  pin: string;
}

interface FailedEntry {
  nrp: string;
  reason: string;
}

export async function POST(request: Request) {
  try {
    // ─── Validasi environment variables ───────────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server belum dikonfigurasi dengan benar (missing env vars)." },
        { status: 500 }
      );
    }

    // ─── Buat Supabase Admin Client ───────────────────────────
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // ─── Parse & validasi request body ────────────────────────
    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: "Request body harus berupa array JSON yang tidak kosong. Format: [{ nrp, pin }]" },
        { status: 400 }
      );
    }

    // Validasi setiap entry
    for (const item of body) {
      if (!item.nrp || !item.pin) {
        return NextResponse.json(
          { error: `Setiap item harus memiliki 'nrp' dan 'pin'. Item tidak valid ditemukan.` },
          { status: 400 }
        );
      }
    }

    // ─── Proses pembuatan user secara sekuensial ──────────────
    const success: string[] = [];
    const failed: FailedEntry[] = [];

    for (const item of body as UserInput[]) {
      const email = `${item.nrp.trim()}@himsi.local`;
      const password = item.pin.trim();

      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { role: "mahasiswa" },
        });

        if (error) {
          failed.push({
            nrp: item.nrp,
            reason: error.message || "Unknown auth error",
          });
          continue;
        }

        success.push(item.nrp);
      } catch (err: any) {
        failed.push({
          nrp: item.nrp,
          reason: err.message || "Unexpected error",
        });
        continue;
      }
    }

    // ─── Return ringkasan hasil ───────────────────────────────
    return NextResponse.json({
      total: body.length,
      success_count: success.length,
      failed_count: failed.length,
      success,
      failed,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
