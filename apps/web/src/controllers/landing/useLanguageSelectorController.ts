import { useState, useRef, useEffect, useCallback } from 'react';
import { Language, SUPPORTED_LANGUAGES } from '@/models/landing/languages.model';

export interface UseLanguageSelectorProps {
  currentLanguageCode?: string;
  onLanguageChange?: (language: Language) => void;
}

const STORAGE_KEY = 'koda-lang';

export function useLanguageSelectorController({
  currentLanguageCode = 'es',
  onLanguageChange,
}: UseLanguageSelectorProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  // Default determinista en el primer render (igual que el servidor); se hidrata en efecto.
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    () =>
      SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguageCode && !lang.comingSoon) ||
      SUPPORTED_LANGUAGES[0]
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const bySaved = SUPPORTED_LANGUAGES.find((lang) => lang.code === saved && !lang.comingSoon);
      if (bySaved) setSelectedLanguage(bySaved);
    } catch {
      // sin almacenamiento, se queda el default
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const selectLanguage = useCallback(
    (lang: Language) => {
      if (lang.comingSoon) return;
      setSelectedLanguage(lang);
      setIsOpen(false);
      try {
        window.localStorage.setItem(STORAGE_KEY, lang.code);
      } catch {
        // almacenamiento no disponible, se ignora
      }
      triggerRef.current?.focus();
      onLanguageChange?.(lang);
    },
    [onLanguageChange]
  );

  return {
    isOpen,
    selectedLanguage,
    containerRef,
    triggerRef,
    toggleDropdown,
    selectLanguage,
    languages: SUPPORTED_LANGUAGES,
  };
}
