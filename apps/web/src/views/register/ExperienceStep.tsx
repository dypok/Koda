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
  onOpenDiagnostic?: () => void;
  diagnosticCompleted?: boolean;
  recommendedModuleCode?: string;
}

export const ExperienceStep: React.FC<ExperienceStepProps> = ({
  options,
  selectedExperienceId,
  selectedTechName,
  onSelectExperience,
  onOpenDiagnostic,
  diagnosticCompleted,
  recommendedModuleCode,
}) => {
  const isNonBeginner =
    Boolean(selectedExperienceId && selectedExperienceId !== 'beginner');

  return (
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

      {/* Invitación a prueba diagnóstica si seleccionó experiencia previa */}
      {isNonBeginner && onOpenDiagnostic && (
        <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left space-y-2">
          {diagnosticCompleted ? (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span>✓</span>
              <span>
                Diagnóstico completado: Se ha recomendado iniciar en{' '}
                <strong>{recommendedModuleCode || 'M04'}</strong>.
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-300 font-mono">
                  Evaluación diagnóstica
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Responde 12 preguntas para validar tu nivel y calibrar tu ruta de aprendizaje.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenDiagnostic}
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition-colors shadow-sm cursor-pointer"
              >
                Iniciar test
              </button>
            </div>
          )}
        </div>
      )}
    </StepLayout>
  );
};
