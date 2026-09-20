'use client';

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { WeatherLayer } from '@/components/landing/WeatherLayer';
import { RegisterHeaderBar } from '@/views/register/RegisterHeaderBar';
import { LanguageSelectionStep } from '@/views/register/LanguageSelectionStep';
import { ExperienceStep } from '@/views/register/ExperienceStep';
import { StyleStep } from '@/views/register/StyleStep';
import { GoalStep } from '@/views/register/GoalStep';
import { ProfileStep } from '@/views/register/ProfileStep';
import { RegisterOtpModal } from '@/views/register/RegisterOtpModal';
import { RegisterSuccessModal } from '@/views/register/RegisterSuccessModal';
import { RegisterBottomBar } from '@/views/register/RegisterBottomBar';
import { useRegisterStepperController } from '@/controllers/register/useRegisterStepperController';
import { useRegisterProfileController } from '@/controllers/register/useRegisterProfileController';

export default function RegisterPage() {
  const stepper = useRegisterStepperController();
  const profile = useRegisterProfileController();

  const onboardingData = {
    initialLanguageSlug: stepper.selectedLanguageId || 'python',
    experienceLevel: stepper.selectedExperienceId || 'beginner',
    learningStyle: stepper.selectedStyleId || 'hands-on',
    dailyGoalId: stepper.selectedGoalId || 'regular',
    dailyGoalMinutes: stepper.selectedGoal?.minutes || 10,
  };

  const isLast = stepper.currentStep === 5;
  const canContinue = isLast ? profile.isFormValid : stepper.canContinue;
  const handleContinue = isLast ? () => profile.submit(onboardingData) : stepper.nextStep;
  const STEP_CTA: Record<number, { text: string; hint: string }> = {
    1: { text: 'Explorar y continuar', hint: 'Elige tu tecnología para continuar' },
    2: { text: 'Confirmar mi nivel', hint: 'Elige tu nivel para continuar' },
    3: { text: 'Confirmar mi estilo', hint: 'Elige tu estilo para continuar' },
    4: { text: 'Fijar mi meta · 10 min/día', hint: 'Elige tu meta para continuar' },
    5: { text: 'Crear cuenta y comenzar', hint: 'Completa el formulario para continuar' },
  };
  const stepCta = STEP_CTA[stepper.currentStep] ?? STEP_CTA[1];
  const continueText = stepCta.text;
  const blockedHint = stepCta.hint;
  const reduceMotion = useReducedMotion();
  const prevStepRef = useRef(stepper.currentStep);
  const direction = stepper.currentStep >= prevStepRef.current ? 1 : -1;
  useEffect(() => {
    prevStepRef.current = stepper.currentStep;
  }, [stepper.currentStep]);

  return (
    <div className="relative isolate min-h-screen bg-transparent text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      <HeroSkyBackground starCount={140 + stepper.currentStep * 12} interactive={true} className="register-sky fixed inset-0 pointer-events-none -z-10" />
      <WeatherLayer type={stepper.currentStep >= 4 ? 'fireflies' : 'embers'} count={10} />

      <RegisterHeaderBar
        currentStepIndex={stepper.displayStep}
        totalSteps={stepper.totalSteps}
        onPrevStep={stepper.prevStep}
      />

      <main className="flex-1 flex flex-col justify-start items-center py-4 px-2 relative z-10 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepper.currentStep}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 48 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -48 * direction }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center"
          >
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
            onEditStep={stepper.goToStep}
            profile={profile}
            onboardingData={onboardingData}
          />
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      <RegisterBottomBar
        canContinue={canContinue}
        onContinue={handleContinue}
        continueText={continueText}
        blockedHint={blockedHint}
        isLoading={profile.isSubmitting}
      />
      <RegisterOtpModal
        isOpen={profile.isOtpModalOpen}
        email={profile.form.email}
        isVerifying={profile.isVerifyingOtp}
        isResending={profile.isResendingOtp}
        errorMessage={profile.otpError}
        onVerify={profile.verifyOtp}
        onResend={profile.resendOtp}
        onClose={profile.closeOtpModal}
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
