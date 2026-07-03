-- ============================================================
-- PSDM HIMSI — Database Schema Migration
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. CUSTOM ENUM TYPES
-- ============================================================

-- Kategori skill: hard skill atau soft skill
CREATE TYPE skill_category AS ENUM ('hard_skill', 'soft_skill');

-- Level kemampuan mahasiswa pada suatu skill
CREATE TYPE skill_level AS ENUM ('pemula', 'menengah', 'mahir');

-- Kategori minat: akademik atau non-akademik
CREATE TYPE interest_category AS ENUM ('akademik', 'non_akademik');


-- ============================================================
-- 2. TABEL UTAMA: students
-- NIM digunakan sebagai primary key (satu mahasiswa = satu entri)
-- ============================================================

CREATE TABLE students (
  nim         TEXT        PRIMARY KEY,
  nama        TEXT        NOT NULL,
  angkatan    INTEGER     NOT NULL CHECK (angkatan >= 2000 AND angkatan <= 2099),
  email       TEXT        NOT NULL UNIQUE,
  whatsapp    TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk query berdasarkan angkatan
CREATE INDEX idx_students_angkatan ON students (angkatan);

COMMENT ON TABLE students IS 'Data mahasiswa Sistem Informasi yang mengisi formulir PSDM';
COMMENT ON COLUMN students.nim IS 'Nomor Induk Mahasiswa (Primary Key)';
COMMENT ON COLUMN students.angkatan IS 'Tahun angkatan masuk (format: 2023, 2024, dst.)';
COMMENT ON COLUMN students.whatsapp IS 'Nomor WhatsApp aktif mahasiswa';


-- ============================================================
-- 3. TABEL: skills
-- Daftar master hard skills dan soft skills
-- ============================================================

CREATE TABLE skills (
  id        UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT              NOT NULL UNIQUE,
  category  skill_category    NOT NULL,
  created_at TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- Index untuk filter berdasarkan kategori
CREATE INDEX idx_skills_category ON skills (category);

COMMENT ON TABLE skills IS 'Daftar master hard skills dan soft skills';


-- ============================================================
-- 4. TABEL JUNCTION: student_skills
-- Relasi many-to-many antara students dan skills + level
-- ============================================================

CREATE TABLE student_skills (
  student_id  TEXT          NOT NULL REFERENCES students(nim) ON DELETE CASCADE,
  skill_id    UUID          NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level       skill_level   NOT NULL DEFAULT 'pemula',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  PRIMARY KEY (student_id, skill_id)
);

-- Index untuk query skill tertentu di semua mahasiswa
CREATE INDEX idx_student_skills_skill_id ON student_skills (skill_id);

COMMENT ON TABLE student_skills IS 'Relasi mahasiswa ↔ skill beserta level kemampuan';


-- ============================================================
-- 5. TABEL: interests
-- Daftar master minat akademik dan non-akademik
-- ============================================================

CREATE TABLE interests (
  id        UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT                NOT NULL UNIQUE,
  category  interest_category   NOT NULL,
  created_at TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

-- Index untuk filter berdasarkan kategori
CREATE INDEX idx_interests_category ON interests (category);

COMMENT ON TABLE interests IS 'Daftar master minat akademik dan non-akademik';


-- ============================================================
-- 6. TABEL JUNCTION: student_interests
-- Relasi many-to-many antara students dan interests
-- ============================================================

CREATE TABLE student_interests (
  student_id    TEXT    NOT NULL REFERENCES students(nim) ON DELETE CASCADE,
  interest_id   UUID   NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (student_id, interest_id)
);

-- Index untuk query interest tertentu di semua mahasiswa
CREATE INDEX idx_student_interests_interest_id ON student_interests (interest_id);

COMMENT ON TABLE student_interests IS 'Relasi mahasiswa ↔ minat';


-- ============================================================
-- 7. TABEL: aspirations
-- Aspirasi/feedback dari mahasiswa
-- ============================================================

CREATE TABLE aspirations (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    TEXT        NOT NULL REFERENCES students(nim) ON DELETE CASCADE,
  feedback_text TEXT        NOT NULL CHECK (char_length(feedback_text) > 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk query aspirasi per mahasiswa
CREATE INDEX idx_aspirations_student_id ON aspirations (student_id);

COMMENT ON TABLE aspirations IS 'Aspirasi dan feedback dari mahasiswa untuk PSDM';


-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- Enable RLS pada semua tabel, dengan policy permissive
-- untuk internal use (bisa diperketat nanti jika perlu auth)
-- ============================================================

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE aspirations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for anon and authenticated users (internal use)
-- Catatan: Perketat policy ini saat menambahkan autentikasi

CREATE POLICY "Allow all access to students"
  ON students FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to skills"
  ON skills FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to student_skills"
  ON student_skills FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to interests"
  ON interests FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to student_interests"
  ON student_interests FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to aspirations"
  ON aspirations FOR ALL
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- 9. SEED DATA: Hard Skills
-- ============================================================

INSERT INTO skills (name, category) VALUES
  -- Hard Skills — Programming & Development
  ('JavaScript/TypeScript', 'hard_skill'),
  ('Python', 'hard_skill'),
  ('Java', 'hard_skill'),
  ('PHP', 'hard_skill'),
  ('C/C++', 'hard_skill'),
  ('Golang', 'hard_skill'),
  ('Kotlin', 'hard_skill'),
  ('Swift', 'hard_skill'),
  ('SQL & Database Management', 'hard_skill'),
  ('HTML & CSS', 'hard_skill'),

  -- Hard Skills — Frameworks & Tools
  ('React / Next.js', 'hard_skill'),
  ('Laravel', 'hard_skill'),
  ('Flutter / Dart', 'hard_skill'),
  ('Node.js / Express', 'hard_skill'),
  ('Spring Boot', 'hard_skill'),

  -- Hard Skills — Data & AI
  ('Data Analysis & Visualization', 'hard_skill'),
  ('Machine Learning / AI', 'hard_skill'),
  ('Business Intelligence (BI)', 'hard_skill'),

  -- Hard Skills — Infrastructure & DevOps
  ('Cloud Computing (AWS/GCP/Azure)', 'hard_skill'),
  ('Docker & Containerization', 'hard_skill'),
  ('Linux & System Administration', 'hard_skill'),
  ('Git & Version Control', 'hard_skill'),
  ('CI/CD Pipeline', 'hard_skill'),

  -- Hard Skills — Security & Networking
  ('Cybersecurity', 'hard_skill'),
  ('Network Administration', 'hard_skill'),

  -- Hard Skills — Design & Media
  ('UI/UX Design (Figma/Adobe XD)', 'hard_skill'),
  ('Graphic Design (Photoshop/Illustrator)', 'hard_skill'),
  ('Video Editing', 'hard_skill'),

  -- Hard Skills — Business & Management
  ('Project Management', 'hard_skill'),
  ('Business Process Modeling', 'hard_skill'),
  ('ERP Systems (SAP/Odoo)', 'hard_skill'),
  ('IT Governance (COBIT/ITIL)', 'hard_skill');


-- ============================================================
-- 10. SEED DATA: Soft Skills
-- ============================================================

INSERT INTO skills (name, category) VALUES
  ('Komunikasi', 'soft_skill'),
  ('Kepemimpinan (Leadership)', 'soft_skill'),
  ('Kerja Tim (Teamwork)', 'soft_skill'),
  ('Problem Solving', 'soft_skill'),
  ('Critical Thinking', 'soft_skill'),
  ('Time Management', 'soft_skill'),
  ('Public Speaking', 'soft_skill'),
  ('Kreativitas', 'soft_skill'),
  ('Adaptabilitas', 'soft_skill'),
  ('Negosiasi', 'soft_skill'),
  ('Emotional Intelligence', 'soft_skill'),
  ('Conflict Resolution', 'soft_skill'),
  ('Mentoring / Coaching', 'soft_skill'),
  ('Networking', 'soft_skill'),
  ('Decision Making', 'soft_skill');


-- ============================================================
-- 11. SEED DATA: Interests (Akademik)
-- ============================================================

INSERT INTO interests (name, category) VALUES
  -- Minat Akademik
  ('Software Engineering', 'akademik'),
  ('Data Science & Analytics', 'akademik'),
  ('Artificial Intelligence & Machine Learning', 'akademik'),
  ('Cybersecurity', 'akademik'),
  ('Cloud & Distributed Computing', 'akademik'),
  ('Mobile App Development', 'akademik'),
  ('Web Development', 'akademik'),
  ('Internet of Things (IoT)', 'akademik'),
  ('Game Development', 'akademik'),
  ('Blockchain & Web3', 'akademik'),
  ('IT Governance & Audit', 'akademik'),
  ('Enterprise Systems (ERP)', 'akademik'),
  ('Database & Big Data', 'akademik'),
  ('UI/UX Research', 'akademik'),
  ('Riset Akademik / Jurnal', 'akademik'),

  -- Minat Non-Akademik
  ('Organisasi & Kepemimpinan', 'non_akademik'),
  ('Olahraga', 'non_akademik'),
  ('Seni & Musik', 'non_akademik'),
  ('Fotografi & Videografi', 'non_akademik'),
  ('Menulis & Konten Kreasi', 'non_akademik'),
  ('Volunteering / Sosial', 'non_akademik'),
  ('Entrepreneurship / Bisnis', 'non_akademik'),
  ('Debat & Public Speaking', 'non_akademik'),
  ('Travelling & Exploring', 'non_akademik'),
  ('Gaming & Esports', 'non_akademik'),
  ('Desain Grafis & Digital Art', 'non_akademik'),
  ('Event Organizing', 'non_akademik'),
  ('Competitive Programming', 'non_akademik'),
  ('Komunitas & Networking', 'non_akademik'),
  ('Self Development & Produktivitas', 'non_akademik');


-- ============================================================
-- SELESAI! 🎉
-- Verifikasi: Jalankan query berikut untuk memastikan semua tabel terbuat
-- ============================================================

-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;
