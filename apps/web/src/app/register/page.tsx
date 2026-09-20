'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
import { AuthService } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export default function RegisterPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, hasHydrated, initAuth } = useAuthStore();
  const isOAuthUser = Boolean(token && user && !user.onboardingCompleted);
  const totalSteps = isOAuthUser ? 4 : 5;
  const stepper = useRegisterStepperController(totalSteps);
  const profile = useRegisterProfileController();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Si el usuario ya completó el onboarding, redirigirlo a la ruta
  useEffect(() => {
    if (hasHydrated && isAuthenticated && user?.onboardingCompleted === true) {
      router.replace('/app/ruta');
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  const onboardingData = {
    initialLanguageSlug: stepper.selectedLanguageId || 'python',
    experienceLevel: stepper.selectedExperienceId || 'beginner',
    learningStyle: stepper.selectedStyleId || 'hands-on',
    dailyGoalId: stepper.selectedGoalId || 'regular',
    dailyGoalMinutes: stepper.selectedGoal?.minutes || 10,
  };

  // Escuchar retorno de OAuth (Google / GitHub)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;

    if (!hash) return;
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken) {
      const pendingRaw = localStorage.getItem('koda_pending_onboarding');
      let pending: any = null;
      if (pendingRaw) {
        try {
          pending = JSON.parse(pendingRaw);
        } catch {
          // ignore
        }
      }

      const syncOAuthUser = async () => {
        try {
          if (pending) {
            await AuthService.completeOnboarding(
              {
                initialLanguageSlug: pending.initialLanguageSlug || 'python',
                experienceLevel: pending.experienceLevel || 'beginner',
                learningStyle: pending.learningStyle || 'hands-on',
                dailyGoalId: pending.dailyGoalId || 'regular',
                dailyGoalMinutes: Number(pending.dailyGoalMinutes) || 10,
              },
              accessToken
            );
            localStorage.removeItem('koda_pending_onboarding');
          }

          const session = await AuthService.verifySession(accessToken);
          useAuthStore.getState().setUserSession(session, accessToken, refreshToken || undefined);
          window.history.replaceState(null, '', window.location.pathname);
          if (session.onboardingCompleted) {
            router.replace('/app/ruta');
          }
        } catch {
          // Si falla, limpiar estado
        }
      };

      void syncOAuthUser();
    }
  }, [router]);

  const handleSocial = (provider: 'google' | 'github') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('koda_pending_onboarding', JSON.stringify(onboardingData));
      window.location.href = AuthService.getOAuthRedirectUrl(provider, `${window.location.origin}/register`);
    }
  };

  const isLast = stepper.currentStep === totalSteps;
  const canContinue = isLast && !isOAuthUser ? profile.isFormValid : stepper.canContinue;
  const handleContinue = isLast ? () => profile.submit(onboardingData) : stepper.nextStep;
  const STEP_CTA: Record<number, { text: string; hint: string }> = {
    1: { text: 'Explorar y continuar', hint: 'Elige tu tecnología para continuar' },
    2: { text: 'Confirmar mi nivel', hint: 'Elige tu nivel para continuar' },
    3: { text: 'Confirmar mi estilo', hint: 'Elige tu estilo para continuar' },
    4: {
      text: isOAuthUser ? 'Fijar mi meta y comenzar mi ruta' : 'Fijar mi meta · 10 min/día',
      hint: 'Elige tu meta para continuar',
    },
    5: {
      text: 'Crear cuenta y comenzar',
      hint: 'Completa el formulario para continuar',
    },
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
            onSocialClick={handleSocial}
          />
        )}
          </motion.div>
        </AnimatePresence>
      </main>

      {profile.submitError && (
        <div className="mx-auto mb-4 max-w-md w-[90%] p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-center text-xs font-semibold text-rose-200 shadow-xl backdrop-blur-md">
          {profile.submitError}
        </div>
      )}

      <RegisterBottomBar
        canContinue={canContinue}
        onContinue={handleContinue}
        continueText={continueText}
        blockedHint={blockedHint}
        isLoading={profile.isSubmitting}
        isOAuthUser={isOAuthUser}
        userEmail={user?.email}
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
        studentName={profile.form.fullName || user?.fullName || 'Estudiante'}
        techName={stepper.selectedOption?.name}
        goalMinutes={stepper.selectedGoal?.minutes}
      />
    </div>
  );
}
