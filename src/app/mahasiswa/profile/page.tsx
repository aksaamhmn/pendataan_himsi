/**
 * Mahasiswa Profile Page — Halaman profil komprehensif.
 * Menarik seluruh relasi data (skills, interests, aspirations)
 * dan menampilkannya dalam format CV/Portofolio.
 * Server Component.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Profile Portofolio — Portal Mahasiswa PSDM HIMSI",
  description: "Halaman profil dan portofolio mahasiswa PSDM HIMSI.",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  // Dapatkan user dari session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Extract NRP
  const email = user.email || "";
  const nrp = email.replace("@himsi.local", "");

  // Query JOIN komprehensif
  const { data: student, error } = await supabase
    .from("students")
    .select(`
      *,
      student_skills (
        level,
        skills (*)
      ),
      student_interests (
        interests (*)
      ),
      aspirations (*)
    `)
    .eq("nim", nrp)
    .single();

  // EMPTY STATE
  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-100 border border-yellow-200 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-600"
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
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Data Profil Belum Tersedia
          </h2>
          <p className="text-gray-500 mb-8">
            Anda belum mengisi formulir pendataan, sehingga profil Anda masih kosong.
          </p>
          <Link href="/mahasiswa/form" className="block w-full">
            <Button variant="primary" className="w-full">
              Isi Formulir Sekarang
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // POPULATED STATE (CV/Portfolio Layout)
  const skillsList = (student.student_skills as unknown as any[]) || [];
  const hardSkills = skillsList.filter(
    (s: any) => s.skills?.category === "hard_skill"
  );
  const softSkills = skillsList.filter(
    (s: any) => s.skills?.category === "soft_skill"
  );

  const interestsList = (student.student_interests as unknown as any[]) || [];
  const akademikInterests = interestsList.filter(
    (i: any) => i.interests?.category === "akademik"
  );
  const nonAkademikInterests = interestsList.filter(
    (i: any) => i.interests?.category === "non_akademik"
  );

  const aspirationsList = (student.aspirations as unknown as any[]) || [];
  const aspiration = aspirationsList[0]; // Asumsi 1:1

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Info */}
      <Card padding="lg" className="border-t-4 border-t-yellow-400">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="w-24 h-24 rounded-2xl bg-yellow-100 border border-yellow-200 flex items-center justify-center shrink-0">
            <svg
              className="w-12 h-12 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {student.nama}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                </svg>
                {student.nim}
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
                Angkatan {student.angkatan}
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                </svg>
                IPK {student.ipk || "-"}
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                {student.email}
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                {student.whatsapp}
              </div>
            </div>
          </div>
          {/* Edit Profil Button */}
          <Link href="/mahasiswa/form?mode=edit" className="shrink-0">
            <Button variant="ghost" className="border border-yellow-300 text-yellow-700 hover:bg-yellow-50">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Edit Profil
            </Button>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Keterampilan (Skills) */}
        <Card className="flex flex-col">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.492-3.396m-2.492 3.396-3.396 2.492a2.25 2.25 0 0 1-2.062-.056L2.25 20.25l1.35-1.35M2.25 20.25l1.35-1.35m0 0 2.492-3.396m-2.492 3.396L3.6 18.9m0 0 1.35-1.35m-1.35 1.35-1.35 1.35m4.242-7.152L8.4 10.65M8.4 10.65l3.396-2.492m-3.396 2.492 2.492-3.396m4.148 5.485L15 12m-6 3-1.094 1.094m4.531-10.452L15 2.25M15 2.25l1.35 1.35M15 2.25l-1.35 1.35m1.35-1.35 2.492 3.396m-2.492-3.396-3.396 2.492" />
              </svg>
              Keterampilan
            </h2>
          </div>
          <div className="p-5 space-y-6 flex-1">
            {/* Hard Skills */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Hard Skills
              </h3>
              {hardSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {hardSkills.map((s: any, idx: number) => (
                    <Badge key={idx} variant="warning" className="capitalize">
                      {s.skills?.name} • <span className="opacity-75 ml-1">{s.level}</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Belum ada data hard skills.</p>
              )}
            </div>
            
            {/* Soft Skills */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Soft Skills
              </h3>
              {softSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {softSkills.map((s: any, idx: number) => (
                    <Badge key={idx} variant="warning" className="capitalize">
                      {s.skills?.name} • <span className="opacity-75 ml-1">{s.level}</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Belum ada data soft skills.</p>
              )}
            </div>
          </div>
        </Card>

        {/* Minat (Interests) */}
        <Card className="flex flex-col">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
              </svg>
              Minat & Bakat
            </h2>
          </div>
          <div className="p-5 space-y-6 flex-1">
            {/* Akademik */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Akademik
              </h3>
              {akademikInterests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {akademikInterests.map((i: any, idx: number) => (
                    <Badge key={idx} variant="info" className="capitalize">
                      {i.interests?.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Belum ada data minat akademik.</p>
              )}
            </div>

            {/* Non-Akademik */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Non-Akademik
              </h3>
              {nonAkademikInterests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {nonAkademikInterests.map((i: any, idx: number) => (
                    <Badge key={idx} variant="default" className="capitalize border-gray-300">
                      {i.interests?.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Belum ada data minat non-akademik.</p>
              )}
            </div>
          </div>
        </Card>

        {/* Aspirasi (Full Width) */}
        <Card className="md:col-span-2">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              Aspirasi
            </h2>
          </div>
          <div className="p-5">
            {aspiration?.feedback_text ? (
              <blockquote className="border-l-4 border-yellow-400 pl-4 py-1 text-gray-700 italic bg-yellow-50/50 rounded-r-lg">
                &ldquo;{aspiration.feedback_text}&rdquo;
              </blockquote>
            ) : (
              <p className="text-sm text-gray-400 italic">Belum ada aspirasi yang disampaikan.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
