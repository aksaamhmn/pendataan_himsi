import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Progres Pendataan — SITALENT",
  description: "Lihat progres pengisian formulir pendataan mahasiswa HIMSI.",
};

export default async function ProgressPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 font-medium">Sistem belum dikonfigurasi (Missing Supabase Keys).</p>
      </div>
    );
  }

  // 1. Fetch all auth users using Admin API
  const adminAuthClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  
  const { data: authData, error: authError } = await adminAuthClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 font-medium">Gagal memuat data akun: {authError.message}</p>
      </div>
    );
  }

  // Filter only students (exclude admin) based on role metadata or email pattern
  const studentUsers = authData.users.filter(u => {
    const role = u.user_metadata?.role;
    // Jika tidak ada role admin dan email berakhiran @himsi.local
    return role !== "admin" && u.email && u.email.endsWith("@himsi.local");
  });

  const totalUsers = studentUsers.length;

  // 2. Fetch all students who have filled the form
  const supabase = await createServerClient();
  const { data: filledStudents, error: dbError } = await supabase
    .from("students")
    .select("nim, nama");

  if (dbError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 font-medium">Gagal memuat data form: {dbError.message}</p>
      </div>
    );
  }

  const filledCount = filledStudents?.length || 0;
  const percentage = totalUsers > 0 ? Math.round((filledCount / totalUsers) * 100) : 0;

  // 3. Map status for each user
  const filledMap = new Map<string, string>();
  filledStudents?.forEach((s) => filledMap.set(s.nim, s.nama));

  const progressList = studentUsers.map((u) => {
    const nim = u.email!.replace("@himsi.local", "");
    const isFilled = filledMap.has(nim);
    return {
      nim,
      nama: isFilled ? filledMap.get(nim)! : "-",
      status: isFilled,
    };
  });

  // Sort by NIM ascending
  progressList.sort((a, b) => a.nim.localeCompare(b.nim));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header & Back Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Login
          </Link>
          
          <div className="flex items-center gap-3">
            <Image
              src="/logo_himsi.png"
              alt="Logo HIMSI"
              width={32}
              height={32}
              className="object-contain"
            />
            <h1 className="text-xl font-bold text-gray-900">Progres Pendataan Mahasiswa</h1>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pengisian</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {filledCount} <span className="text-lg font-medium text-gray-400">/ {totalUsers}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                {percentage}% Selesai
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-900">Daftar Akun Mahasiswa</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50">NIM</th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50">Nama</th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {progressList.map((item) => (
                  <tr key={item.nim} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono whitespace-nowrap">
                      {item.nim}
                    </td>
                    <td className={`px-6 py-4 text-sm whitespace-nowrap ${item.status ? 'text-gray-900' : 'text-gray-400 italic'}`}>
                      {item.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {item.status ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            Sudah
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            Belum
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {progressList.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                      Belum ada data akun.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
