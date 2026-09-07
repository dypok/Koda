'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconWorld, IconChevronDown, IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

/**
 * Iconos Vectoriales Nítidos para Idiomas (sin emojis del sistema)
 */
export const IconFlagSpain: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 32 32"
    className={cn('rounded-full overflow-hidden shrink-0 ring-1 ring-white/10', className)}
    aria-hidden="true"
  >
    <rect width="32" height="32" fill="#c60b1e" />
    <rect y="8" width="32" height="16" fill="#ffc400" />
  </svg>
);

export const IconFlagUS: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 32 32"
    className={cn('rounded-full overflow-hidden shrink-0 ring-1 ring-white/10', className)}
    aria-hidden="true"
  >
    <rect width="32" height="32" fill="#b22234" />
    <rect y="4" width="32" height="3.5" fill="#ffffff" />
    <rect y="11" width="32" height="3.5" fill="#ffffff" />
    <rect y="18" width="32" height="3.5" fill="#ffffff" />
    <rect y="25" width="32" height="3.5" fill="#ffffff" />
    <rect width="16" height="16" fill="#3c3b6e" />
  </svg>
);

export const IconFlagBrazil: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 32 32"
    className={cn('rounded-full overflow-hidden shrink-0 ring-1 ring-white/10', className)}
    aria-hidden="true"
  >
    <rect width="32" height="32" fill="#009c3b" />
    <polygon points="16,4 28,16 16,28 4,16" fill="#ffdf00" />
    <circle cx="16" cy="16" r="6" fill="#002776" />
  </svg>
);

export const IconFlagFrance: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 32 32"
    className={cn('rounded-full overflow-hidden shrink-0 ring-1 ring-white/10', className)}
    aria-hidden="true"
  >
    <rect width="11" height="32" fill="#0055a5" />
    <rect x="11" width="10" height="32" fill="#ffffff" />
    <rect x="21" width="11" height="32" fill="#ef4135" />
  </svg>
);

/**
 * Estructura de datos para los idiomas soportados.
 */
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  icon: React.ComponentType<{ className?: string }>;
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
    icon: IconFlagSpain,
  },
  // --- PLANTILLA EXTENSIBLE PARA NUEVOS IDIOMAS ---
  // {
  //   code: 'en',
  //   name: 'English',
  //   nativeName: 'English',
  //   icon: IconFlagUS,
  // },
  // {
  //   code: 'pt',
  //   name: 'Português',
  //   nativeName: 'Português',
  //   icon: IconFlagBrazil,
  // },
  // {
  //   code: 'fr',
  //   name: 'Français',
  //   nativeName: 'Français',
  //   icon: IconFlagFrance,
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
      {/* Botón Disparador Integrado al Navbar (sin estilo card, sin emojis) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
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

      {/* Menú Desplegable con Animación (aquí se muestran los iconos) */}
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
                const IconComponent = language.icon;
                return (
                  <button
                    key={language.code}
                    type="button"
                    role="menuitem"
                    onClick={() => handleSelectLanguage(language)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-sm transition-all text-left select-none cursor-pointer',
                      isSelected
                        ? 'bg-amber-500/15 text-amber-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Icono vectorial nítido mostrado solo en el menú desplegado */}
                      <IconComponent className="w-4 h-4" />
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
