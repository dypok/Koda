'use client';

import React from 'react';
import Image from 'next/image';
import { ExperienceOption } from '@/models/register/register.model';
import { ExperienceCard } from './ExperienceCard';

interface ExperienceStepProps {
  options: ExperienceOption[];
  selectedExperienceId: string | null;
  selectedTechName?: string;
  onSelectExperience: (id: string) => void;
}

export const ExperienceStep: React.FC<ExperienceStepProps> = ({
  options,
  selectedExperienceId,
  selectedTechName,
  onSelectExperience,
}) => (
  <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
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
          ¿Cuánto sabes de programación?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {selectedTechName
            ? `Calibraremos tus lecciones de ${selectedTechName} al punto ideal.`
            : 'Personalizaremos los desafíos prácticos para tu ritmo de aprendizaje.'}
        </p>
      </div>
    </div>

    {/* Stack of Experience Cards */}
    <div className="flex flex-col gap-3.5">
      {options.map((option) => (
        <ExperienceCard
          key={option.id}
          option={option}
          isSelected={selectedExperienceId === option.id}
          onSelect={onSelectExperience}
        />
      ))}
    </div>
  </div>
);
