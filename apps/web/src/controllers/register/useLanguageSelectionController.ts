'use client';

import { useState, useMemo, useCallback } from 'react';
import { AVAILABLE_LANGUAGES } from '@/models/register/register.constants';
import { LanguageOption } from '@/models/register/register.model';

export function useLanguageSelectionController(
  initialLanguageId: string = 'python',
  onContinueStep?: (selectedLanguage: LanguageOption) => void
) {
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(initialLanguageId);
  const [notice, setNotice] = useState<string | null>(null);

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
      setNotice(`La ruta de ${chosen.name} está en desarrollo. Python 3.12 está disponible ahora.`);
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
    languages: AVAILABLE_LANGUAGES,
    selectedLanguageId,
    selectedOption,
    canContinue,
    notice,
    selectLanguage,
    handleContinue,
  };
}
