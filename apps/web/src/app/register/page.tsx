'use client';

import React from 'react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { RegisterHeaderBar } from '@/views/register/RegisterHeaderBar';
import { LanguageSelectionStep } from '@/views/register/LanguageSelectionStep';
import { ExperienceStep } from '@/views/register/ExperienceStep';
import { RegisterBottomBar } from '@/views/register/RegisterBottomBar';
import { useRegisterStepperController } from '@/controllers/register/useRegisterStepperController';

export default function RegisterPage() {
  const stepper = useRegisterStepperController();

  return (
    <div className="relative isolate min-h-screen bg-transparent text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Fondo cósmico del Hero con estrellas interactivas */}
      <HeroSkyBackground starCount={160} interactive={true} className="fixed inset-0 pointer-events-none -z-10" />

      {/* Header with Dynamic Progress Bar (Paso X de 5) */}
      <RegisterHeaderBar
        currentStepIndex={stepper.currentStep}
        totalSteps={stepper.totalSteps}
        onPrevStep={stepper.prevStep}
      />

      {/* Dynamic Step Content */}
      <main className="flex-1 flex flex-col justify-start items-center py-4 px-2 relative z-10">
        {stepper.currentStep === 1 && (
          <LanguageSelectionStep
            languages={stepper.languages}
            categories={stepper.categories}
            selectedCategory={stepper.selectedCategory}
            onSelectCategory={stepper.setSelectedCategory}
            selectedLanguageId={stepper.selectedLanguageId}
            onSelectLanguage={stepper.selectLanguage}
          />
        )}

        {stepper.currentStep === 2 && (
          <ExperienceStep
            options={stepper.experienceOptions}
            selectedExperienceId={stepper.selectedExperienceId}
            selectedTechName={stepper.selectedOption?.name}
            onSelectExperience={stepper.selectExperience}
          />
        )}
      </main>

      {/* Bottom Sticky Action Bar */}
      <RegisterBottomBar
        canContinue={stepper.canContinue}
        onContinue={stepper.nextStep}
        continueText="Continuar"
      />
    </div>
  );
}

