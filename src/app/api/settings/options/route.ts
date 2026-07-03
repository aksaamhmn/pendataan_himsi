/**
 * API Route: Manajemen Opsi Master Formulir
 * Mengelola tabel `skills` dan `interests`.
 * 
 * - POST: Menambah opsi baru.
 * - PUT: Mengupdate nama opsi.
 * - DELETE: Soft delete (is_active = false).
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { type, name, category } = await request.json();

    if (!type || !name || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const table = type === "skills" ? "skills" : "interests";

    const { data, error } = await supabase
      .from(table)
      .insert({ name, category, is_active: true })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { type, id, name } = await request.json();

    if (!type || !id || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const table = type === "skills" ? "skills" : "interests";

    const { data, error } = await supabase
      .from(table)
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { type, id } = await request.json();

    if (!type || !id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const table = type === "skills" ? "skills" : "interests";

    // SOFT DELETE: Update is_active = false instead of actual delete
    const { data, error } = await supabase
      .from(table)
      .update({ is_active: false })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
