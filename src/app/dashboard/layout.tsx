import type { Metadata } from "next";
import DashboardShell from "./_components/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard Admin — PSDM HIMASI",
  description: "Dashboard rekapitulasi data minat, bakat, dan skills mahasiswa Sistem Informasi.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
