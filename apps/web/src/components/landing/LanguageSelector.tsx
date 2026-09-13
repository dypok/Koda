'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Language } from '@/models/landing/languages.model';
import { useLanguageSelectorController } from '@/controllers/landing/useLanguageSelectorController';
import { LanguageDropdown } from '@/views/landing/LanguageDropdown';

export * from '@/models/landing/languages.model';

export interface LanguageSelectorProps {
  currentLanguageCode?: string;
  onLanguageChange?: (language: Language) => void;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguageCode = 'es',
  onLanguageChange,
  className,
}) => {
  const { isOpen, selectedLanguage, containerRef, triggerRef, toggleDropdown, selectLanguage, languages } =
    useLanguageSelectorController({ currentLanguageCode, onLanguageChange });
  const SelectedFlag = selectedLanguage.icon;

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Idioma actual: ${selectedLanguage.name}`}
        className={cn(
          'group flex h-9 items-center gap-2 px-3 rounded-full text-sm font-medium transition-colors select-none cursor-pointer',
          'text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-amber-500/40',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/40',
          isOpen && 'text-white bg-white/10 border-amber-500/40'
        )}
      >
        <SelectedFlag className="w-5 h-3.5" />
        <span className="tracking-tight font-bold">{selectedLanguage.code.toUpperCase()}</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-slate-500 transition-transform duration-200 group-hover:text-slate-300',
            isOpen && 'rotate-180 text-amber-400'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <LanguageDropdown
            languages={languages}
            selectedCode={selectedLanguage.code}
            onSelect={selectLanguage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
