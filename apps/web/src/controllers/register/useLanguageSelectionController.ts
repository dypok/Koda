'use client';

import { useState, useMemo, useCallback } from 'react';
import { AVAILABLE_LANGUAGES, TECH_CATEGORIES } from '@/models/register/register.constants';
import { LanguageOption, TechCategory } from '@/models/register/register.model';

export function useLanguageSelectionController(
  initialLanguageId: string = 'python',
  onContinueStep?: (selectedLanguage: LanguageOption) => void
) {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(initialLanguageId);
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>('all');
  const [notice, setNotice] = useState<string | null>(null);

  const filteredLanguages = useMemo(() => {
    if (selectedCategory === 'all') return AVAILABLE_LANGUAGES;
    return AVAILABLE_LANGUAGES.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const selectedOption = useMemo(
    () => AVAILABLE_LANGUAGES.find((lang) => lang.id === selectedLanguageId) || null,
    [selectedLanguageId]
  );

  const canContinue = useMemo(() => {
    return Boolean(selectedOption && selectedOption.isAvailable);
  }, [selectedOption]);

  const selectLanguage = useCallback((id: string) => {
    setSelectedLanguageId(id);
    const chosen = AVAILABLE_LANGUAGES.find((lang) => lang.id === id);
    if (chosen && !chosen.isAvailable) {
      setNotice(`La ruta de ${chosen.name} está en desarrollo. Python está disponible ahora para comenzar.`);
    } else {
      setNotice(null);
    }
  }, []);

  const handleContinue = useCallback(() => {
    if (!canContinue || !selectedOption) return;
    if (onContinueStep) {
      onContinueStep(selectedOption);
    }
  }, [canContinue, selectedOption, onContinueStep]);

  return {
    categories: TECH_CATEGORIES,
    selectedCategory,
    setSelectedCategory,
    languages: filteredLanguages,
    selectedLanguageId,
    selectedOption,
    canContinue,
    notice,
    selectLanguage,
    handleContinue,
  };
}
