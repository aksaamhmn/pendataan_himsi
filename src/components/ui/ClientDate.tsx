"use client";

import { useEffect, useState } from "react";

interface ClientDateProps {
  isoString: string;
  className?: string;
  prefix?: string;
}

export default function ClientDate({ isoString, className = "", prefix = "" }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <span className={className}>{prefix}Memuat...</span>;
  }
  
  const date = new Date(isoString);
  const formatted = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(/\./g, ":"); // Ubah 06.04 menjadi 06:04 (opsional) atau biarkan default

  return <span className={className}>{prefix}{formatted}</span>;
}
