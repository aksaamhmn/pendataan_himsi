/**
 * API Route: Auth Logout
 * Server-side sign out via Supabase, lalu redirect ke /login.
 * POST /api/auth/logout
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    const url = new URL("/login", request.url);
    return NextResponse.redirect(url, { status: 302 });
  } catch {
    return NextResponse.json(
      { error: "Gagal logout" },
      { status: 500 }
    );
  }
}
