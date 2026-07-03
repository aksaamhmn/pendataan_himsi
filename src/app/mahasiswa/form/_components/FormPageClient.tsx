"use client";

/**
 * FormPageClient — Halaman utama formulir pendataan PSDM HIMASI.
 * Komponen client yang mengorkestrasi multi-step form.
 */

import { useState, useCallback } from "react";
import { useMultiStepForm, STEP_LABELS } from "@/hooks/useMultiStepForm";
import Button from "@/components/ui/Button";
import StepBiodata from "./StepBiodata";
import StepMinat from "./StepMinat";
import StepSkill from "./StepSkill";
import StepAspirasi from "./StepAspirasi";
import type { FormBiodata, FormInterestEntry, FormSkillEntry, FormAspiration } from "@/types/database";

/** Icons untuk step indicator */
const STEP_ICON_PATHS = [
  // User icon (Biodata)
  "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
  // Heart icon (Minat)
  "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
  // Code icon (Keterampilan)
  "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
  // Message icon (Aspirasi)
  "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z",
];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function FormPageClient() {
  const form = useMultiStepForm();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState("");

  // ─── Validation ──────────────────────────────────────────────

  const validateBiodata = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    const b = form.formData.biodata;

    if (!b.nama.trim()) errs.nama = "Nama lengkap wajib diisi";
    if (!b.nim.trim()) errs.nim = "NIM wajib diisi";
    else if (!/^\d{6,15}$/.test(b.nim.trim())) errs.nim = "NIM harus berupa angka (6-15 digit)";
    if (!b.email.trim()) errs.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim())) errs.email = "Format email tidak valid";
    if (!b.whatsapp.trim()) errs.whatsapp = "Nomor WhatsApp wajib diisi";
    else if (!/^(\+62|08)\d{8,13}$/.test(b.whatsapp.trim())) errs.whatsapp = "Format nomor tidak valid (08xx atau +628xx)";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form.formData.biodata]);

  const validateMinat = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (form.formData.interests.length === 0) {
      errs.interests = "Pilih minimal satu minat";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form.formData.interests]);

  const validateSkill = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (form.formData.skills.length === 0) {
      errs.skills = "Pilih minimal satu keterampilan";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form.formData.skills]);

  // ─── Navigation ──────────────────────────────────────────────

  const handleNext = useCallback(() => {
    let isValid = true;
    switch (form.currentStep) {
      case 0:
        isValid = validateBiodata();
        break;
      case 1:
        isValid = validateMinat();
        break;
      case 2:
        isValid = validateSkill();
        break;
    }
    if (isValid) {
      setErrors({});
      form.nextStep();
    }
  }, [form, validateBiodata, validateMinat, validateSkill]);

  const handlePrev = useCallback(() => {
    setErrors({});
    form.prevStep();
  }, [form]);

  // ─── Submit ──────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    setSubmitStatus("submitting");
    setSubmitError("");

    try {
      const res = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan");
      }

      setSubmitStatus("success");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim data");
      setSubmitStatus("error");
    }
  }, [form.formData]);

  // ─── Data update handlers ────────────────────────────────────

  const handleBiodataChange = useCallback(
    (biodata: FormBiodata) => form.updateFormData({ biodata }),
    [form]
  );

  const handleInterestsChange = useCallback(
    (interests: FormInterestEntry[]) => form.updateFormData({ interests }),
    [form]
  );

  const handleSkillsChange = useCallback(
    (skills: FormSkillEntry[]) => form.updateFormData({ skills }),
    [form]
  );

  const handleAspirationChange = useCallback(
    (aspiration: FormAspiration) => form.updateFormData({ aspiration }),
    [form]
  );

  // ─── Success Screen ─────────────────────────────────────────

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg">
            {/* Success checkmark animation */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600 animate-in zoom-in-50 duration-500 delay-200" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Data Berhasil Disimpan! 🎉
            </h2>
            <p className="text-gray-500 mb-6">
              Terima kasih telah mengisi formulir pendataan PSDM HIMASI.
              Data minat, keterampilan, dan aspirasimu sudah tercatat.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">NIM</p>
              <p className="text-lg font-mono font-semibold text-gray-900">
                {form.formData.biodata.nim}
              </p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => {
                form.resetForm();
                setSubmitStatus("idle");
                setErrors({});
              }}
            >
              Isi Formulir Baru
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Form UI ────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">Formulir Pendataan</h1>
              <p className="text-xs text-gray-500">PSDM HIMASI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-6 pb-2">
        <div className="flex items-center justify-between relative">
          {/* Progress bar background */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 rounded-full" />
          {/* Progress bar fill */}
          <div
            className="absolute top-4 left-6 h-0.5 bg-yellow-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((form.currentStep) / (form.totalSteps - 1)) * 100}%`, maxWidth: "calc(100% - 48px)" }}
          />

          {STEP_LABELS.map((label, index) => {
            const isActive = index === form.currentStep;
            const isCompleted = index < form.currentStep;

            return (
              <div key={label} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (index < form.currentStep) {
                      setErrors({});
                      form.goToStep(index);
                    }
                  }}
                  disabled={index > form.currentStep}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2
                    ${isActive
                      ? "bg-yellow-400 border-yellow-500 shadow-sm scale-110"
                      : isCompleted
                        ? "bg-yellow-100 border-yellow-300 cursor-pointer hover:scale-105"
                        : "bg-white border-gray-300 cursor-default"
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-3.5 h-3.5 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className={`w-3.5 h-3.5 ${isActive ? "text-gray-900" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={STEP_ICON_PATHS[index]} />
                    </svg>
                  )}
                </button>
                <span className={`mt-2 text-[10px] font-medium tracking-wide ${isActive ? "text-yellow-600" : isCompleted ? "text-gray-500" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm min-h-[400px]">
          {form.currentStep === 0 && (
            <StepBiodata
              data={form.formData.biodata}
              onChange={handleBiodataChange}
              errors={errors}
            />
          )}
          {form.currentStep === 1 && (
            <StepMinat
              data={form.formData.interests}
              onChange={handleInterestsChange}
              errors={errors}
            />
          )}
          {form.currentStep === 2 && (
            <StepSkill
              data={form.formData.skills}
              onChange={handleSkillsChange}
              errors={errors}
            />
          )}
          {form.currentStep === 3 && (
            <StepAspirasi
              aspiration={form.formData.aspiration}
              formData={form.formData}
              onChangeAspiration={handleAspirationChange}
              errors={errors}
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-md sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Error message */}
          {submitStatus === "error" && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            {/* Back button */}
            <Button
              variant="ghost"
              size="lg"
              onClick={handlePrev}
              disabled={form.isFirstStep || submitStatus === "submitting"}
              className={form.isFirstStep ? "invisible" : ""}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Kembali
            </Button>

            {/* Step counter (mobile-visible) */}
            <span className="text-xs text-gray-500 hidden sm:block">
              {form.currentStep + 1} / {form.totalSteps}
            </span>

            {/* Next / Submit button */}
            {form.isLastStep ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                isLoading={submitStatus === "submitting"}
                className="min-w-[140px]"
              >
                {submitStatus === "submitting" ? (
                  "Mengirim..."
                ) : (
                  <>
                    Kirim Data
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                className="min-w-[140px]"
              >
                Selanjutnya
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
