"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleFormStatus(isOpen: boolean) {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from("app_settings")
    .update({ setting_value: isOpen })
    .eq("setting_key", "is_form_open");

  if (error) {
    throw new Error("Gagal mengubah status form: " + error.message);
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/mahasiswa/form");
  
  return { success: true };
}
