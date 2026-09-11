'use client';

import React from 'react';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { RegisterHeaderBar } from '@/views/register/RegisterHeaderBar';
import { LanguageSelectionStep } from '@/views/register/LanguageSelectionStep';
import { ExperienceStep } from '@/views/register/ExperienceStep';
import { StyleStep } from '@/views/register/StyleStep';
import { GoalStep } from '@/views/register/GoalStep';
import { ProfileStep } from '@/views/register/ProfileStep';
import { RegisterSuccessModal } from '@/views/register/RegisterSuccessModal';
import { RegisterBottomBar } from '@/views/register/RegisterBottomBar';
import { useRegisterStepperController } from '@/controllers/register/useRegisterStepperController';
import { useRegisterProfileController } from '@/controllers/register/useRegisterProfileController';

export default function RegisterPage() {
  const stepper = useRegisterStepperController();
  const profile = useRegisterProfileController();

  const isLast = stepper.currentStep === 5;
  const canContinue = isLast ? profile.isFormValid : stepper.canContinue;
  const handleContinue = isLast ? profile.submit : stepper.nextStep;
  const continueText = isLast ? 'Crear cuenta y comenzar' : 'Continuar';

  return (
    <div className="relative isolate min-h-screen bg-transparent text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      <HeroSkyBackground starCount={160} interactive={true} className="fixed inset-0 pointer-events-none -z-10" />

      <RegisterHeaderBar
        currentStepIndex={stepper.currentStep}
        totalSteps={stepper.totalSteps}
        onPrevStep={stepper.prevStep}
      />

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
        {stepper.currentStep === 3 && (
          <StyleStep
            options={stepper.styleOptions}
            selectedStyleId={stepper.selectedStyleId}
            selectedTechName={stepper.selectedOption?.name}
            onSelectStyle={stepper.selectStyle}
          />
        )}
        {stepper.currentStep === 4 && (
          <GoalStep
            options={stepper.goalOptions}
            selectedGoalId={stepper.selectedGoalId}
            onSelectGoal={stepper.selectGoal}
          />
        )}
        {stepper.currentStep === 5 && (
          <ProfileStep
            techName={stepper.selectedOption?.name}
            experienceTitle={stepper.selectedExperience?.title}
            goalTitle={stepper.selectedGoal?.title}
            goalMinutes={stepper.selectedGoal?.minutes}
            profile={profile}
          />
        )}
      </main>

      <RegisterBottomBar
        canContinue={canContinue}
        onContinue={handleContinue}
        continueText={continueText}
        isLoading={profile.isSubmitting}
      />
      <RegisterSuccessModal
        isOpen={profile.isSuccess}
        studentName={profile.form.fullName}
        techName={stepper.selectedOption?.name}
        goalMinutes={stepper.selectedGoal?.minutes}
      />
    </div>
  );
}
