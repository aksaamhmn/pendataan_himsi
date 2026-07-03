/**
 * Form page — Entry point untuk formulir pendataan mahasiswa PSDM HIMASI.
 * Server component yang merender FormPageClient.
 */

import type { Metadata } from "next";
import FormPageClient from "./_components/FormPageClient";

export const metadata: Metadata = {
  title: "Formulir Pendataan — PSDM HIMASI",
  description:
    "Formulir online untuk mendata minat, bakat, hard skills, soft skills, dan aspirasi mahasiswa Sistem Informasi.",
};

export default function FormPage() {
  return <FormPageClient />;
}
