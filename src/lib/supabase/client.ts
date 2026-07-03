import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseConfig } from "./config";

/**
 * Supabase client untuk digunakan di Client Components (browser).
 * Gunakan ini di komponen yang memiliki "use client" directive.
 */
export function createClient() {
  const { url, key } = getSupabaseConfig();
  return createBrowserClient<Database>(url, key);
}
