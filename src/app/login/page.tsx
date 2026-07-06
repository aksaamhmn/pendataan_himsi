"use client";

/**
 * Login Page — Portal Autentikasi PSDM HIMSI
 * Mahasiswa login dengan NRP + PIN.
 * Admin login dengan username + PIN.
 * NRP/username diappend @himsi.local untuk Supabase email auth.
 */

import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [nrp, setNrp] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      const trimmedNrp = nrp.trim();
      const trimmedPin = pin.trim();

      if (!trimmedNrp) {
        setError("NRP / Username wajib diisi");
        setIsLoading(false);
        return;
      }
      if (!trimmedPin) {
        setError("PIN wajib diisi");
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const email = `${trimmedNrp}@himsi.local`;

        const { data, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password: trimmedPin,
          });

        if (authError) {
          setError("NRP atau PIN salah. Silakan coba lagi.");
          setIsLoading(false);
          return;
        }

        // Redirect berdasarkan role
        const role = data.user?.user_metadata?.role as string | undefined;
        if (role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/mahasiswa/dashboard");
        }
        router.refresh();
      } catch {
        setError("Terjadi kesalahan. Silakan coba lagi.");
        setIsLoading(false);
      }
    },
    [nrp, pin, router]
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Image
              src="/logo_himsi.png"
              alt="Logo HIMSI"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SITALENT</h1>
          <p className="text-sm text-gray-500 mt-1">
            Masuk ke portal pendataan mahasiswa
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="nrp-login"
              label="NRP / Username"
              placeholder="Masukkan NRP atau username"
              value={nrp}
              onChange={(e) => setNrp(e.target.value)}
              required
              autoComplete="username"
            />

            <div>
              <label
                htmlFor="pin-login"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                PIN 
              </label>
              <input
                id="pin-login"
                type="password"
                placeholder="Masukkan PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200">
                <svg
                  className="w-4 h-4 text-red-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              {isLoading ? "Memverifikasi..." : "Masuk"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-3">
          <Link 
            href="/progress" 
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            Lihat Progres Pendataan
          </Link>
          
          <p className="text-xs text-gray-400">
            Akun dibuat oleh admin PSDM. Hubungi admin jika belum memiliki akun.
          </p>
        </div>
      </div>
    </div>
  );
}
