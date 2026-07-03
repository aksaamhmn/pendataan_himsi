/**
 * Root page — redirect ke /login.
 * Middleware sudah handle redirect berdasarkan role jika user sudah login.
 */

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
