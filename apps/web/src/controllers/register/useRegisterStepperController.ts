'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  AVAILABLE_LANGUAGES, TECH_CATEGORIES, EXPERIENCE_OPTIONS, STYLE_OPTIONS, GOAL_OPTIONS, techAvailability
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
  // false en el primer render (igual que el servidor); se hidrata en efecto.
  const [isExpress, setIsExpress] = useState(false);
  useEffect(() => {
    const express = new URLSearchParams(window.location.search).get('v') === 'express';
    setIsExpress(express);
    // Puerta a A/B real: variante visible en consola hasta tener analytics.
    // eslint-disable-next-line no-console
    console.info('[analytics] register_variant', express ? 'express' : 'full');
  }, []);
  // Defaults deterministas en el primer render (igual que el servidor); se hidratan en efecto.
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('python');
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>('all');
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>('regular');

  useEffect(() => {
    const saved = loadProgress();
    if (saved.currentStep != null) setCurrentStep(saved.currentStep);
    if (saved.selectedLanguageId) setSelectedLanguageId(saved.selectedLanguageId);
    if (saved.selectedCategory) setSelectedCategory(saved.selectedCategory);
    if (saved.selectedExperienceId !== undefined) setSelectedExperienceId(saved.selectedExperienceId);
    if (saved.selectedStyleId !== undefined) setSelectedStyleId(saved.selectedStyleId);
    if (saved.selectedGoalId !== undefined) setSelectedGoalId(saved.selectedGoalId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, []);
  // Express: defaults visibles en el resumen (pasos 2-4 colapsados).
  const expressDefaults = isExpress;
  const effectiveExperienceId = selectedExperienceId ?? (expressDefaults ? 'beginner' : null);

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
    document.body.dataset.registerStep = String(currentStep);
    return () => {
      delete document.body.dataset.registerStep;
    };
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
    if (techAvailability(id).isAvailable) {
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
    setCurrentStep((prev) => (isExpress && prev === 1 ? 5 : Math.min(5, prev + 1)));
  }, [canContinue, isExpress]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (isExpress && prev === 5 ? 1 : Math.max(1, prev - 1)));
  }, [isExpress]);

  // En express, goToStep recibe el número visible (1-3) y salta al real.
  const goToStep = useCallback((step: number) => {
    const real = isExpress ? (step >= 3 ? 5 : 1) : step;
    setCurrentStep(Math.min(5, Math.max(1, Math.round(real))));
  }, [isExpress]);

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
    () => EXPERIENCE_OPTIONS.find((e) => e.id === effectiveExperienceId),
    [effectiveExperienceId]
  );
  const selectedGoal = useMemo(
    () => GOAL_OPTIONS.find((g) => g.id === selectedGoalId),
    [selectedGoalId]
  );

  return {
    currentStep,
    displayStep: isExpress ? (currentStep === 5 ? 3 : 1) : currentStep,
    totalSteps: isExpress ? 3 : 5,
    isExpress,
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
