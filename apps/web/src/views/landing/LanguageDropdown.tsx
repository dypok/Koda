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

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0 },
};

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
    className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-xl shadow-[0_16px_40px_-8px_black] py-1.5 z-50 overflow-hidden"
    role="menu"
    aria-orientation="vertical"
    aria-label="Seleccionar idioma"
  >
    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/60">
      Idioma / Language
    </div>

    <motion.div variants={listVariants} initial="hidden" animate="show" className="p-1.5 space-y-0.5">
      {languages.map((language) => {
        const isSelected = language.code === selectedCode;
        const IconComponent = language.icon;
        return (
          <motion.button
            key={language.code}
            type="button"
            role="menuitemradio"
            aria-checked={isSelected}
            aria-disabled={language.comingSoon || undefined}
            variants={itemVariants}
            onClick={() => onSelect(language)}
            className={cn(
              'w-full flex items-center justify-between gap-2 px-3 py-2.5 min-h-[44px] rounded-xl text-sm transition-all text-left select-none',
              language.comingSoon
                ? 'text-slate-500 cursor-default'
                : 'cursor-pointer',
              isSelected
                ? 'bg-amber-500/15 text-amber-300 font-semibold'
                : !language.comingSoon && 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            )}
          >
            <div className="flex items-center gap-2.5">
              <IconComponent />
              <span>
                {language.name}
                <span className="block text-xs font-normal text-slate-500">{language.nativeName}</span>
              </span>
            </div>
            {isSelected ? (
              <span className="rounded-full bg-amber-400/15 border border-amber-400/30 p-1">
                <Check aria-hidden="true" className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              </span>
            ) : language.comingSoon ? (
              <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Pronto
              </span>
            ) : null}
          </motion.button>
        );
      })}
    </motion.div>

    <div className="px-3 py-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center gap-1.5">
      <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500/70" />
      3 idiomas más en camino
    </div>
  </motion.div>
);
