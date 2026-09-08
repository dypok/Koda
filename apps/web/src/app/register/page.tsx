'use client';

import React, { useState } from 'react';
import { RegisterHeaderBar } from '@/views/register/RegisterHeaderBar';
import { LanguageSelectionStep } from '@/views/register/LanguageSelectionStep';
import { RegisterBottomBar } from '@/views/register/RegisterBottomBar';
import { useLanguageSelectionController } from '@/controllers/register/useLanguageSelectionController';
import { LanguageOption } from '@/models/register/register.model';

export default function RegisterPage() {
  const [confirmedLanguage, setConfirmedLanguage] = useState<LanguageOption | null>(null);

  const controller = useLanguageSelectionController('python', (selected) => {
    setConfirmedLanguage(selected);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header with Duolingo Progress Bar */}
      <RegisterHeaderBar currentStepIndex={1} totalSteps={2} />

      {/* Step 1: Language Selection */}
      <main className="flex-1 flex flex-col justify-center items-center py-4">
        <LanguageSelectionStep
          languages={controller.languages}
          selectedLanguageId={controller.selectedLanguageId}
          notice={controller.notice}
          onSelectLanguage={controller.selectLanguage}
        />

        {/* Confirmation feedback when continuing */}
        {confirmedLanguage && (
          <div className="mx-4 mt-2 p-4 max-w-md rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center animate-in fade-in zoom-in-95 duration-200">
            <span className="font-bold">¡Excelente elección!</span> Has seleccionado{' '}
            <span className="underline font-semibold">{confirmedLanguage.name}</span> como tu ruta de inicio. Paso 1 completado exitosamente.
          </div>
        )}
      </main>

      {/* Bottom Sticky Action Bar */}
      <RegisterBottomBar
        canContinue={controller.canContinue}
        onContinue={controller.handleContinue}
        continueText="Continuar"
      />
    </div>
  );
}
