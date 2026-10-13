'use client';

import React from 'react';
import { GoalOption } from '@/models/register/register.model';
import { SelectableCard } from './SelectableCard';
import { StepLayout } from './StepLayout';

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
  <StepLayout
    title="¿Cuál es tu meta diaria de estudio?"
    subtitle="Establecer una meta diaria te ayudará a crear un hábito constante. Puedes cambiarla en cualquier momento."
    groupLabel="Meta diaria"
    kodaSay="> 15min/dia :: habito_en_construccion"
  >
    {options.map((option) => (
      <SelectableCard
        key={option.id}
        option={{ ...option, meta: option.timeText }}
        isSelected={selectedGoalId === option.id}
        onSelect={onSelectGoal}
      />
    ))}
  </StepLayout>
);
