'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  AVAILABLE_LANGUAGES, TECH_CATEGORIES, EXPERIENCE_OPTIONS, STYLE_OPTIONS, GOAL_OPTIONS
} from '@/models/register/register.constants';
import { TechCategory } from '@/models/register/register.model';

const STORAGE_KEY = 'koda-register-progress';

interface PersistedProgress {
  currentStep: number;
  selectedLanguageId: string;
  selectedCategory: TechCategory;
  selectedExperienceId: string | null;
  selectedStyleId: string | null;
  selectedGoalId: string | null;
}

function loadProgress(): Partial<PersistedProgress> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<PersistedProgress>;
    if (typeof parsed.currentStep !== 'number' || parsed.currentStep < 1 || parsed.currentStep > 5) {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

export function useRegisterStepperController() {
  const [restored] = useState<PersistedProgress | null>(() =>
    typeof window === 'undefined' ? null : (loadProgress() as PersistedProgress | null)
  );
  const [currentStep, setCurrentStep] = useState<number>(restored?.currentStep ?? 1);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(restored?.selectedLanguageId ?? 'python');
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>(restored?.selectedCategory ?? 'all');
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(restored?.selectedExperienceId ?? null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(restored?.selectedStyleId ?? null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(restored?.selectedGoalId ?? 'regular');

  useEffect(() => {
    try {
      const data: PersistedProgress = {
        currentStep,
        selectedLanguageId,
        selectedCategory,
        selectedExperienceId,
        selectedStyleId,
        selectedGoalId,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // sin almacenamiento, la sesión sigue funcionando
    }
  }, [currentStep, selectedLanguageId, selectedCategory, selectedExperienceId, selectedStyleId, selectedGoalId]);

  const filteredLanguages = useMemo(() => {
    if (selectedCategory === 'all') return AVAILABLE_LANGUAGES;
    return AVAILABLE_LANGUAGES.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const selectedOption = useMemo(
    () => AVAILABLE_LANGUAGES.find((lang) => lang.id === selectedLanguageId) || null,
    [selectedLanguageId]
  );

  const selectLanguage = useCallback((id: string) => {
    const chosen = AVAILABLE_LANGUAGES.find((lang) => lang.id === id);
    if (chosen && chosen.isAvailable) {
      setSelectedLanguageId(id);
    }
  }, []);

  const selectExperience = useCallback((id: string) => {
    setSelectedExperienceId(id);
  }, []);

  const selectStyle = useCallback((id: string) => {
    setSelectedStyleId(id);
  }, []);

  const selectGoal = useCallback((id: string) => {
    setSelectedGoalId(id);
  }, []);

  const canContinue = useMemo(() => {
    if (currentStep === 1) return Boolean(selectedOption && selectedOption.isAvailable);
    if (currentStep === 2) return Boolean(selectedExperienceId);
    if (currentStep === 3) return Boolean(selectedStyleId);
    if (currentStep === 4) return Boolean(selectedGoalId);
    return true;
  }, [currentStep, selectedOption, selectedExperienceId, selectedStyleId, selectedGoalId]);

  const nextStep = useCallback(() => {
    if (!canContinue) return;
    setCurrentStep((prev) => Math.min(5, prev + 1));
  }, [canContinue]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.min(5, Math.max(1, Math.round(step))));
  }, []);

  // Flechas del teclado para navegar (fuera de inputs).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (e.key === 'ArrowRight') nextStep();
      else if (e.key === 'ArrowLeft') prevStep();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextStep, prevStep]);

  const selectedExperience = useMemo(
    () => EXPERIENCE_OPTIONS.find((e) => e.id === selectedExperienceId),
    [selectedExperienceId]
  );
  const selectedGoal = useMemo(
    () => GOAL_OPTIONS.find((g) => g.id === selectedGoalId),
    [selectedGoalId]
  );

  return {
    currentStep,
    totalSteps: 5,
    categories: TECH_CATEGORIES,
    selectedCategory,
    setSelectedCategory,
    languages: filteredLanguages,
    selectedLanguageId,
    selectedOption,
    experienceOptions: EXPERIENCE_OPTIONS,
    selectedExperienceId,
    selectedExperience,
    styleOptions: STYLE_OPTIONS,
    selectedStyleId,
    goalOptions: GOAL_OPTIONS,
    selectedGoalId,
    selectedGoal,
    canContinue,
    selectLanguage,
    selectExperience,
    selectStyle,
    selectGoal,
    nextStep,
    prevStep,
    goToStep,
  };
}
