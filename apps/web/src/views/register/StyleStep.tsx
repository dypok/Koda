'use client';

import React from 'react';
import Image from 'next/image';
import { StyleOption } from '@/models/register/register.model';
import { StyleCard } from './StyleCard';

interface StyleStepProps {
  options: StyleOption[];
  selectedStyleId: string | null;
  selectedTechName?: string;
  onSelectStyle: (id: string) => void;
}

export const StyleStep: React.FC<StyleStepProps> = ({
  options,
  selectedStyleId,
  selectedTechName,
  onSelectStyle,
}) => (
  <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
    {/* Koda Welcome & Header */}
    <div className="flex items-center gap-4 text-left">
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0">
        <Image
          src="/brand/koda-mascot-cartoon-2d.svg"
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
          ¿Cómo aprendes mejor?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {selectedTechName
            ? `Adaptaremos la estructura de tus lecciones de ${selectedTechName} a tu estilo preferido.`
            : 'Personalizaremos la metodología y retos interactivos para tu ritmo.'}
        </p>
      </div>
    </div>

    {/* Stack of Style Cards */}
    <div className="flex flex-col gap-3.5">
      {options.map((option) => (
        <StyleCard
          key={option.id}
          option={option}
          isSelected={selectedStyleId === option.id}
          onSelect={onSelectStyle}
        />
      ))}
    </div>
  </div>
);
