'use client';

import React from 'react';
import Image from 'next/image';
import { IconInfoCircle } from '@tabler/icons-react';
import { LanguageOption } from '@/models/register/register.model';
import { LanguageCard } from './LanguageCard';

interface LanguageSelectionStepProps {
  languages: LanguageOption[];
  selectedLanguageId: string;
  notice: string | null;
  onSelectLanguage: (id: string) => void;
}

export const LanguageSelectionStep: React.FC<LanguageSelectionStepProps> = ({
  languages,
  selectedLanguageId,
  notice,
  onSelectLanguage,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-fadeIn">
      {/* Koda Welcome & Header */}
      <div className="flex items-center gap-4 text-left">
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0">
          <Image
            src="/brand/koda-mascot.png"
            alt="Koda Mascot"
            width={80}
            height={80}
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ¿Qué lenguaje quieres aprender?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Aprende paso a paso con desafíos interactivos en vivo y feedback instantáneo.
          </p>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <IconInfoCircle className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Grid of Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {languages.map((lang) => (
          <LanguageCard
            key={lang.id}
            option={lang}
            isSelected={selectedLanguageId === lang.id}
            onSelect={onSelectLanguage}
          />
        ))}
      </div>
    </div>
  );
};
