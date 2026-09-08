'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { IconWorld, IconChevronDown } from '@tabler/icons-react';
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
  const { isOpen, selectedLanguage, containerRef, toggleDropdown, selectLanguage, languages } =
    useLanguageSelectorController({ currentLanguageCode, onLanguageChange });

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          'group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors select-none cursor-pointer',
          'text-slate-400 hover:text-white hover:bg-slate-900/60',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500/40',
          isOpen && 'text-white bg-slate-900/80'
        )}
      >
        <IconWorld className="w-4 h-4 text-slate-400 transition-colors group-hover:text-amber-400" />
        <span className="tracking-tight">{selectedLanguage.name}</span>
        <IconChevronDown
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
