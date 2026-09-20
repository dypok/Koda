'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ProfileSummaryBadge } from './ProfileSummaryBadge';
import { ProfileSocialAuth } from './ProfileSocialAuth';
import { ProfileFormFields } from './ProfileFormFields';
import type { useRegisterProfileController } from '@/controllers/register/useRegisterProfileController';

interface ProfileStepProps {
  techName?: string;
  experienceTitle?: string;
  goalTitle?: string;
  goalMinutes?: number;
  onEditStep?: (step: number) => void;
  profile: ReturnType<typeof useRegisterProfileController>;
  onboardingData?: {
    initialLanguageSlug?: string;
    experienceLevel?: string;
    learningStyle?: string;
    dailyGoalId?: string;
    dailyGoalMinutes?: number;
  };
  onSocialClick?: (provider: 'google' | 'github') => void;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  techName,
  experienceTitle,
  goalTitle,
  goalMinutes,
  onEditStep,
  profile,
  onboardingData,
  onSocialClick,
}) => {
  const reduceMotion = useReducedMotion();
  const [focusField, setFocusField] = useState<string | null>(null);
  const validCount =
    (profile.errors.fullName === null && profile.form.fullName ? 1 : 0) +
    (profile.errors.email === null && profile.form.email ? 1 : 0) +
    (profile.errors.password === null && profile.form.password ? 1 : 0);
  const eyeX = focusField === 'register-fullname' ? -5 : focusField === 'register-password' ? 5 : 0;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Step Header with Koda and Integrated Badges */}
      <div className="flex items-start gap-4 mb-6 text-left w-full">
        <div className="shrink-0 flex flex-col items-center">
          <motion.div
            key={`hop-${validCount}`}
            animate={reduceMotion ? {} : { y: [0, -9, 0] }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-12 h-12 sm:w-14 sm:h-14 relative drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]"
          >
            <Image
              src="/brand/koda-mascot-cartoon-2d.svg"
              alt="Koda"
              width={56}
              height={56}
              className="w-full h-full object-contain select-none"
            />
            {!reduceMotion && (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[38%] flex gap-1.5 transition-transform duration-200"
                style={{ transform: `translate(calc(-50% + ${eyeX}px), 0)` }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
              </span>
            )}
          </motion.div>
          <span aria-hidden="true" className="mt-1 max-w-[110px] rounded-xl rounded-tl-sm border border-amber-400/30 bg-amber-400/10 px-2 py-1 text-center text-[10px] font-bold leading-tight text-amber-200">
            {'> perfil_casi_listo'}
          </span>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ¡Crea tu perfil para guardar tu progreso!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Guarda tus lecciones de {techName || 'programación'} y asegura tu racha desde hoy.
            </p>
          </div>

          {/* Badges integradas orgánicamente al header sin contenedor de card */}
          <ProfileSummaryBadge
            techName={techName}
            experienceTitle={experienceTitle}
            goalTitle={goalTitle}
            goalMinutes={goalMinutes}
            onEditStep={onEditStep}
          />
        </div>
      </div>

      {/* Social Auth Options */}
      <ProfileSocialAuth onSocialClick={onSocialClick} disabled={profile.isSubmitting} />

      {/* Direct Registration Form Fields */}
      <form
        className="w-full"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          profile.submit(onboardingData);
        }}
        onFocusCapture={(e) => {
          const id = (e.target as HTMLElement).id;
          setFocusField(id.startsWith('register-') ? id : null);
        }}
        onBlurCapture={() => setFocusField(null)}
      >
        <ProfileFormFields
          fullName={profile.form.fullName}
          email={profile.form.email}
          password={profile.form.password}
          showPassword={profile.showPassword}
          errors={profile.errors}
          passwordStrength={profile.passwordStrength}
          onFullNameChange={profile.setFullName}
          onEmailChange={profile.setEmail}
          onPasswordChange={profile.setPassword}
          onToggleShowPassword={profile.toggleShowPassword}
          onBlurField={profile.touch}
          disabled={profile.isSubmitting}
        />
      </form>
    </div>
  );
};
