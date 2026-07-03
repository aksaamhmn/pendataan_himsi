/**
 * Multi-Step Form — Custom Hook
 * Mengelola state navigasi form multi-step (step aktif, next, prev, dll.)
 * Mendukung initialData untuk mode edit (data hydration).
 */

import { useState, useCallback } from "react";
import type { FormData } from "@/types/database";

/** State awal form kosong */
function createInitialFormData(initialNim: string = ""): FormData {
  return {
    biodata: {
      nim: initialNim,
      nama: "",
      angkatan: new Date().getFullYear(),
      email: "",
      whatsapp: "",
    },
    skills: [],
    interests: [],
    aspiration: {
      feedback_text: "",
    },
    newInterests: [],
    newSkills: [],
  };
}

/** Total jumlah step dalam form */
const TOTAL_STEPS = 4;

/** Label untuk setiap step */
export const STEP_LABELS = [
  "Biodata",
  "Minat",
  "Keterampilan",
  "Aspirasi",
] as const;

/** Icon identifiers untuk setiap step */
export const STEP_ICONS = [
  "user",
  "heart",
  "code",
  "message",
] as const;

export interface UseMultiStepFormReturn {
  /** Step saat ini (0-indexed) */
  currentStep: number;
  /** Total step */
  totalSteps: number;
  /** Label step saat ini */
  currentStepLabel: string;
  /** Semua label step */
  stepLabels: readonly string[];
  /** Icon identifiers */
  stepIcons: readonly string[];
  /** Data form keseluruhan */
  formData: FormData;
  /** Apakah di step pertama */
  isFirstStep: boolean;
  /** Apakah di step terakhir */
  isLastStep: boolean;
  /** Progress percentage (0-100) */
  progress: number;
  /** Navigasi ke step berikutnya */
  nextStep: () => void;
  /** Navigasi ke step sebelumnya */
  prevStep: () => void;
  /** Navigasi ke step tertentu */
  goToStep: (step: number) => void;
  /** Update data form */
  updateFormData: (data: Partial<FormData>) => void;
  /** Reset form ke state awal */
  resetForm: () => void;
}

export function useMultiStepForm(
  initialNim: string = "",
  initialData?: FormData
): UseMultiStepFormReturn {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(
    () => initialData || createInitialFormData(initialNim)
  );

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const currentStepLabel = STEP_LABELS[currentStep];

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setCurrentStep(0);
    setFormData(initialData || createInitialFormData(initialNim));
  }, [initialNim, initialData]);

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    currentStepLabel,
    stepLabels: STEP_LABELS,
    stepIcons: STEP_ICONS,
    formData,
    isFirstStep,
    isLastStep,
    progress,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    resetForm,
  };
}
