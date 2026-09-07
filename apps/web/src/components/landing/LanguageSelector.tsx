'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconWorld, IconChevronDown, IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

/**
 * Estructura de datos para los idiomas soportados.
 */
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

/**
 * Plantilla extensible de idiomas soportados.
 * Para añadir un nuevo idioma a KodaAcademy en el futuro,
 * simplemente añade un nuevo objeto a esta lista.
 */
export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'es',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  // --- PLANTILLA PARA NUEVOS IDIOMAS ---
  // {
  //   code: 'en',
  //   name: 'English',
  //   nativeName: 'English',
  //   flag: '🇺🇸',
  // },
  // {
  //   code: 'pt',
  //   name: 'Português',
  //   nativeName: 'Português',
  //   flag: '🇧🇷',
  // },
  // {
  //   code: 'fr',
  //   name: 'Français',
  //   nativeName: 'Français',
  //   flag: '🇫🇷',
  // },
];

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    () =>
      SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguageCode) ||
      SUPPORTED_LANGUAGES[0]
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera del componente o presionar Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
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

  const handleSelectLanguage = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    onLanguageChange?.(language);
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      {/* Botón Disparador del Menú Desplegable */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          'group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 select-none cursor-pointer',
          'bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 hover:text-white',
          'border border-slate-800 hover:border-slate-700 backdrop-blur-md shadow-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50',
          isOpen && 'border-amber-500/50 bg-slate-800/90 text-white ring-1 ring-amber-500/20'
        )}
      >
        <IconWorld className="w-4 h-4 text-amber-400/90 transition-transform group-hover:scale-110" />
        <span className="text-base leading-none" role="img" aria-label={selectedLanguage.name}>
          {selectedLanguage.flag}
        </span>
        <span className="hidden sm:inline font-medium tracking-tight">
          {selectedLanguage.name}
        </span>
        <IconChevronDown
          className={cn(
            'w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180 text-amber-400'
          )}
        />
      </button>

      {/* Menú Desplegable con Animación */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-slate-900/95 border border-slate-800 backdrop-blur-xl shadow-2xl py-1.5 z-50 overflow-hidden"
            role="menu"
            aria-orientation="vertical"
          >
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60">
              Idioma / Language
            </div>

            <div className="py-1">
              {SUPPORTED_LANGUAGES.map((language) => {
                const isSelected = language.code === selectedLanguage.code;
                return (
                  <button
                    key={language.code}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectLanguage(language)}
                    className={cn(
                      'w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-all text-left select-none cursor-pointer',
                      isSelected
                        ? 'bg-amber-500/15 text-amber-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none" role="img" aria-label={language.name}>
                        {language.flag}
                      </span>
                      <span>{language.name}</span>
                    </div>

                    {isSelected && (
                      <IconCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Indicador de expansión futura */}
            {SUPPORTED_LANGUAGES.length === 1 && (
              <div className="px-3 py-1.5 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500/70 animate-pulse" />
                Más idiomas próximamente
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
