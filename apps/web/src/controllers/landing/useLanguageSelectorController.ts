import { useState, useRef, useEffect, useCallback } from 'react';
import { Language, SUPPORTED_LANGUAGES } from '@/models/landing/languages.model';

export interface UseLanguageSelectorProps {
  currentLanguageCode?: string;
  onLanguageChange?: (language: Language) => void;
}

export function useLanguageSelectorController({
  currentLanguageCode = 'es',
  onLanguageChange,
}: UseLanguageSelectorProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    () => SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguageCode) || SUPPORTED_LANGUAGES[0]
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
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
      setSelectedLanguage(lang);
      setIsOpen(false);
      onLanguageChange?.(lang);
    },
    [onLanguageChange]
  );

  return {
    isOpen,
    selectedLanguage,
    containerRef,
    toggleDropdown,
    selectLanguage,
    languages: SUPPORTED_LANGUAGES,
  };
}
