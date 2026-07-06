import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Next.js Middleware — Fase 4: Role-based Route Protection
 *
 * Alur:
 * 1. Public routes (/login, /api/*, static assets) → dilewati
 * 2. User belum login → redirect ke /login
 * 3. / → redirect sesuai role
 * 4. student akses /dashboard/* → redirect ke /mahasiswa/dashboard
 * 5. admin akses /mahasiswa/* → redirect ke /dashboard
 */

// Routes yang tidak memerlukan autentikasi
const PUBLIC_ROUTES = ["/login", "/api", "/progress"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip jika Supabase belum dikonfigurasi (dev tanpa env)
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  // Refresh session dan dapatkan user
  const { updateSession } = await import("@/lib/supabase/middleware");
  const { supabaseResponse, user } = await updateSession(request);

  // Public routes — langsung dilewati
  if (isPublicRoute(pathname)) {
    // Jika sudah login dan mengakses /login, redirect sesuai role
    if (pathname === "/login" && user) {
      const role = user.user_metadata?.role as string | undefined;
      const target = role === "admin" ? "/dashboard" : "/mahasiswa/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }
    return supabaseResponse;
  }

  // User belum login → redirect ke /login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const role = user.user_metadata?.role as string | undefined;

  // Root "/" → redirect sesuai role
  if (pathname === "/") {
    const target = role === "admin" ? "/dashboard" : "/mahasiswa/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Student mencoba akses dashboard → redirect ke portal mahasiswa
  if (role === "student" && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL("/mahasiswa/dashboard", request.url)
    );
  }

  // Admin mencoba akses portal mahasiswa → redirect ke dashboard
  if (role === "admin" && pathname.startsWith("/mahasiswa")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
