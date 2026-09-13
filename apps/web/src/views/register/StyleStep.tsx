'use client';

import React from 'react';
import { StyleOption } from '@/models/register/register.model';
import { SelectableCard } from './SelectableCard';
import { StepLayout } from './StepLayout';

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
  <StepLayout
    title="¿Cómo aprendes mejor?"
    subtitle={
      selectedTechName
        ? `Adaptaremos la estructura de tus lecciones de ${selectedTechName} a tu estilo preferido.`
        : 'Personalizaremos la metodología y retos interactivos para tu ritmo.'
    }
    groupLabel="Estilo de aprendizaje"
    kodaSay="Cada mente aprende distinto ✨"
  >
    {options.map((option) => (
      <SelectableCard
        key={option.id}
        option={option}
        isSelected={selectedStyleId === option.id}
        onSelect={onSelectStyle}
      />
    ))}
  </StepLayout>
);
