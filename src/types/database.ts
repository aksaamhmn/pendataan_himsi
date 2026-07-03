// ============================================================
// Database Type Definitions untuk PSDM HIMSI
// Auto-generated berdasarkan schema SQL migration
// ============================================================

// ============================================================
// Enum Types
// ============================================================

/** Kategori skill: hard_skill atau soft_skill */
export type SkillCategory = "hard_skill" | "soft_skill";

/** Level kemampuan pada suatu skill */
export type SkillLevel = "pemula" | "menengah" | "mahir";

/** Kategori minat: akademik atau non_akademik */
export type InterestCategory = "akademik" | "non_akademik";

// ============================================================
// Row Types (sesuai tabel di database)
// ============================================================

/** Data mahasiswa Sistem Informasi */
export interface Student {
  nim: string;
  nama: string;
  angkatan: number;
  email: string;
  whatsapp: string;
  created_at: string;
}

/** Daftar master hard skills dan soft skills */
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  created_at: string;
}

/** Relasi mahasiswa ↔ skill beserta level kemampuan */
export interface StudentSkill {
  student_id: string;
  skill_id: string;
  level: SkillLevel;
  created_at: string;
}

/** Daftar master minat akademik dan non-akademik */
export interface Interest {
  id: string;
  name: string;
  category: InterestCategory;
  created_at: string;
}

/** Relasi mahasiswa ↔ minat */
export interface StudentInterest {
  student_id: string;
  interest_id: string;
  created_at: string;
}

/** Aspirasi dan feedback dari mahasiswa */
export interface Aspiration {
  id: string;
  student_id: string;
  feedback_text: string;
  created_at: string;
}

// ============================================================
// Insert Types (untuk operasi INSERT — tanpa auto-generated fields)
// ============================================================

export type StudentInsert = Omit<Student, "created_at">;

export type SkillInsert = Omit<Skill, "id" | "created_at">;

export type StudentSkillInsert = Omit<StudentSkill, "created_at">;

export type StudentInterestInsert = Omit<StudentInterest, "created_at">;

export type AspirationInsert = Omit<Aspiration, "id" | "created_at">;

// ============================================================
// Database Type untuk Supabase Client Generic
// ============================================================

export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          nim: string;
          nama: string;
          angkatan: number;
          email: string;
          whatsapp: string;
          created_at: string;
        };
        Insert: {
          nim: string;
          nama: string;
          angkatan: number;
          email: string;
          whatsapp: string;
          created_at?: string;
        };
        Update: {
          nim?: string;
          nama?: string;
          angkatan?: number;
          email?: string;
          whatsapp?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_skills_student_id_fkey";
            columns: ["nim"];
            isOneToOne: false;
            referencedRelation: "student_skills";
            referencedColumns: ["student_id"];
          },
          {
            foreignKeyName: "student_interests_student_id_fkey";
            columns: ["nim"];
            isOneToOne: false;
            referencedRelation: "student_interests";
            referencedColumns: ["student_id"];
          },
          {
            foreignKeyName: "aspirations_student_id_fkey";
            columns: ["nim"];
            isOneToOne: false;
            referencedRelation: "aspirations";
            referencedColumns: ["student_id"];
          },
        ];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      student_skills: {
        Row: {
          student_id: string;
          skill_id: string;
          level: string;
          created_at: string;
        };
        Insert: {
          student_id: string;
          skill_id: string;
          level?: string;
          created_at?: string;
        };
        Update: {
          student_id?: string;
          skill_id?: string;
          level?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_skills_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["nim"];
          },
          {
            foreignKeyName: "student_skills_skill_id_fkey";
            columns: ["skill_id"];
            isOneToOne: false;
            referencedRelation: "skills";
            referencedColumns: ["id"];
          },
        ];
      };
      interests: {
        Row: {
          id: string;
          name: string;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      student_interests: {
        Row: {
          student_id: string;
          interest_id: string;
          created_at: string;
        };
        Insert: {
          student_id: string;
          interest_id: string;
          created_at?: string;
        };
        Update: {
          student_id?: string;
          interest_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_interests_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["nim"];
          },
          {
            foreignKeyName: "student_interests_interest_id_fkey";
            columns: ["interest_id"];
            isOneToOne: false;
            referencedRelation: "interests";
            referencedColumns: ["id"];
          },
        ];
      };
      aspirations: {
        Row: {
          id: string;
          student_id: string;
          feedback_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          feedback_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          feedback_text?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "aspirations_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["nim"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      skill_category: SkillCategory;
      skill_level: SkillLevel;
      interest_category: InterestCategory;
    };
    CompositeTypes: Record<string, never>;
  };
};

// ============================================================
// Form Data Types (untuk Multi-Step Form state)
// ============================================================

/** Data dari Step 1: Biodata Mahasiswa */
export interface FormBiodata {
  nim: string;
  nama: string;
  angkatan: number;
  email: string;
  whatsapp: string;
}

/** Data dari Step 2: Skills (Hard & Soft) */
export interface FormSkillEntry {
  skill_id: string;
  skill_name: string;
  category: SkillCategory;
  level: SkillLevel;
}

/** Data dari Step 3: Interests */
export interface FormInterestEntry {
  interest_id: string;
  interest_name: string;
  category: InterestCategory;
}

/** Data dari Step 4: Aspirations */
export interface FormAspiration {
  feedback_text: string;
}

/** Custom minat baru yang diinput mahasiswa */
export interface NewInterestEntry {
  name: string;
  category: InterestCategory;
}

/** Custom skill baru yang diinput mahasiswa */
export interface NewSkillEntry {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

/** Keseluruhan state form multi-step */
export interface FormData {
  biodata: FormBiodata;
  skills: FormSkillEntry[];
  interests: FormInterestEntry[];
  aspiration: FormAspiration;
  newInterests: NewInterestEntry[];
  newSkills: NewSkillEntry[];
}
