'use client';

import { useState, useMemo, useCallback } from 'react';
import { AVAILABLE_LANGUAGES, TECH_CATEGORIES, EXPERIENCE_OPTIONS } from '@/models/register/register.constants';
import { TechCategory } from '@/models/register/register.model';

export function useRegisterStepperController() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('python');
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>('all');
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);

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

  const canContinue = useMemo(() => {
    if (currentStep === 1) return Boolean(selectedOption && selectedOption.isAvailable);
    if (currentStep === 2) return Boolean(selectedExperienceId);
    return true;
  }, [currentStep, selectedOption, selectedExperienceId]);

  const nextStep = useCallback(() => {
    if (!canContinue) return;
    setCurrentStep((prev) => Math.min(5, prev + 1));
  }, [canContinue]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  }, []);

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
    canContinue,
    selectLanguage,
    selectExperience,
    nextStep,
    prevStep,
  };
}
