"use client";

/**
 * Login Page — Portal Autentikasi PSDM HIMASI
 * Mahasiswa login dengan NRP + PIN.
 * Admin login dengan username + PIN.
 * NRP/username diappend @himasi.local untuk Supabase email auth.
 */

import { useState, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
        const email = `${trimmedNrp}@himasi.local`;

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
          router.push("/mahasiswa/profile");
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-sm">
            <svg
              className="w-8 h-8 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PSDM HIMASI</h1>
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
                PIN <span className="text-red-500">*</span>
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
        <p className="text-center text-xs text-gray-400 mt-6">
          Akun dibuat oleh admin PSDM. Hubungi admin jika belum memiliki akun.
        </p>
      </div>
    </div>
  );
}
