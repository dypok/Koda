'use client';

import React from 'react';
import Image from 'next/image';
import { IconInfoCircle } from '@tabler/icons-react';
import { LanguageOption, TechCategory } from '@/models/register/register.model';
import { LanguageCard } from './LanguageCard';
import { cn } from '@/lib/utils';

interface LanguageSelectionStepProps {
  languages: LanguageOption[];
  categories: { id: TechCategory; label: string }[];
  selectedCategory: TechCategory;
  onSelectCategory: (cat: TechCategory) => void;
  selectedLanguageId: string;
  notice: string | null;
  onSelectLanguage: (id: string) => void;
}

export const LanguageSelectionStep: React.FC<LanguageSelectionStepProps> = ({
  languages, categories, selectedCategory, onSelectCategory,
  selectedLanguageId, notice, onSelectLanguage,
}) => (
  <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-5 animate-fadeIn">
    {/* Koda Welcome & Header */}
    <div className="flex items-center gap-4 text-left">
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0">
        <Image
          src="/brand/koda-mascot.png"
          alt="Koda Mascot"
          width={64}
          height={64}
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
          priority
        />
      </div>
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          ¿Qué tecnología quieres aprender?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Aprende desde cero o potencia tu stack con lecciones interactivas.
        </p>
      </div>
    </div>

    {/* Category Pills */}
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelectCategory(cat.id)}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
            selectedCategory === cat.id
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>

    {/* Notice Banner */}
    {notice && (
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
        <IconInfoCircle className="w-4 h-4 shrink-0" />
        <span>{notice}</span>
      </div>
    )}

    {/* Grid of Technologies */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {languages.map((item) => (
        <LanguageCard
          key={item.id}
          option={item}
          isSelected={selectedLanguageId === item.id}
          onSelect={onSelectLanguage}
        />
      ))}
    </div>
  </div>
);
