'use client';

import React from 'react';
import Image from 'next/image';
import { GoalOption } from '@/models/register/register.model';
import { GoalCard } from './GoalCard';

interface GoalStepProps {
  options: GoalOption[];
  selectedGoalId: string | null;
  onSelectGoal: (id: string) => void;
}

export const GoalStep: React.FC<GoalStepProps> = ({
  options,
  selectedGoalId,
  onSelectGoal,
}) => (
  <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
    {/* Koda Mascot & Header */}
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
          ¿Cuál es tu meta diaria de estudio?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Establecer una meta diaria te ayudará a crear un hábito constante. Puedes cambiarla en cualquier momento.
        </p>
      </div>
    </div>

    {/* Stack of Goal Cards */}
    <div className="flex flex-col gap-3.5">
      {options.map((option) => (
        <GoalCard
          key={option.id}
          option={option}
          isSelected={selectedGoalId === option.id}
          onSelect={onSelectGoal}
        />
      ))}
    </div>
  </div>
);
