'use client';

import React from 'react';
import { ExperienceOption } from '@/models/register/register.model';
import { SelectableCard } from './SelectableCard';
import { StepLayout } from './StepLayout';

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
  <StepLayout
    title="¿Cuánto sabes de programación?"
    subtitle={
      selectedTechName
        ? `Calibraremos tus lecciones de ${selectedTechName} al punto ideal.`
        : 'Personalizaremos los desafíos prácticos para tu ritmo de aprendizaje.'
    }
    groupLabel="Nivel de experiencia"
    kodaSay="> nivel_inicial :: sin_juicio"
  >
    {options.map((option) => (
      <SelectableCard
        key={option.id}
        option={option}
        isSelected={selectedExperienceId === option.id}
        onSelect={onSelectExperience}
      />
    ))}
  </StepLayout>
);
