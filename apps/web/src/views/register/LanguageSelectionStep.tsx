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
            ¿Qué lenguaje quieres aprender?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Aprende desde cero con desafíos interactivos y feedback en tiempo real.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
