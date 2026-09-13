import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Language } from '@/models/landing/languages.model';

interface LanguageDropdownProps {
  languages: Language[];
  selectedCode: string;
  onSelect: (lang: Language) => void;
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  languages,
  selectedCode,
  onSelect,
}) => (
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
      {languages.map((language) => {
        const isSelected = language.code === selectedCode;
        const IconComponent = language.icon;
        return (
          <button
            key={language.code}
            type="button"
            role="menuitem"
            onClick={() => onSelect(language)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm transition-all text-left select-none cursor-pointer',
              isSelected
                ? 'bg-amber-500/15 text-amber-400 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            )}
          >
            <div className="flex items-center gap-2.5">
              <IconComponent className="w-4 h-4" />
              <span>{language.name}</span>
            </div>
            {isSelected && <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />}
          </button>
        );
      })}
    </div>

    {languages.length === 1 && (
      <div className="px-3 py-1.5 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500/70 animate-pulse" />
        Más idiomas próximamente
      </div>
    )}
  </motion.div>
);
