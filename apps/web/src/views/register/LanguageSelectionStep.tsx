'use client';

import React from 'react';
import Image from 'next/image';
import { LanguageOption, TechCategory } from '@/models/register/register.model';
import { LanguageCard } from './LanguageCard';
import { cn } from '@/lib/utils';

interface LanguageSelectionStepProps {
  languages: LanguageOption[];
  categories: { id: TechCategory; label: string }[];
  selectedCategory: TechCategory;
  onSelectCategory: (cat: TechCategory) => void;
  selectedLanguageId: string;
  onSelectLanguage: (id: string) => void;
}

export const LanguageSelectionStep: React.FC<LanguageSelectionStepProps> = ({
  languages, categories, selectedCategory, onSelectCategory,
  selectedLanguageId, onSelectLanguage,
}) => (
  <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 space-y-6 animate-fadeIn">
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
            'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
            selectedCategory === cat.id
              ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.35)]'
              : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:text-white hover:border-slate-600'
          )}

        >
          {cat.label}
        </button>
      ))}
    </div>

    {/* Grid of Technologies ampliado horizontalmente */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
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
