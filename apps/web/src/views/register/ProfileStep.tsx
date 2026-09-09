'use client';

import React from 'react';
import Image from 'next/image';
import { ProfileSummaryBadge } from './ProfileSummaryBadge';
import { ProfileSocialAuth } from './ProfileSocialAuth';
import { ProfileFormFields } from './ProfileFormFields';
import type { useRegisterProfileController } from '@/controllers/register/useRegisterProfileController';

interface ProfileStepProps {
  techName?: string;
  experienceTitle?: string;
  goalTitle?: string;
  goalMinutes?: number;
  profile: ReturnType<typeof useRegisterProfileController>;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  techName,
  experienceTitle,
  goalTitle,
  goalMinutes,
  profile,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Step Header with Koda */}
      <div className="flex items-center gap-3.5 mb-4 text-left w-full">
        <div className="w-12 h-12 shrink-0 relative drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
          <Image
            src="/brand/koda-mascot-cartoon-2d.svg"
            alt="Koda"
            width={48}
            height={48}
            className="w-full h-full object-contain select-none"
          />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ¡Crea tu perfil para guardar tu progreso!
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Guarda tus lecciones de {techName || 'programación'} y no pierdas tu avance.
          </p>
        </div>
      </div>

      {/* Summary Badge of Choices */}
      <ProfileSummaryBadge
        techName={techName}
        experienceTitle={experienceTitle}
        goalTitle={goalTitle}
        goalMinutes={goalMinutes}
      />

      {/* Social Auth Options */}
      <ProfileSocialAuth disabled={profile.isSubmitting} />

      {/* Direct Registration Form Fields */}
      <ProfileFormFields
        fullName={profile.form.fullName}
        email={profile.form.email}
        password={profile.form.password}
        showPassword={profile.showPassword}
        onFullNameChange={profile.setFullName}
        onEmailChange={profile.setEmail}
        onPasswordChange={profile.setPassword}
        onToggleShowPassword={profile.toggleShowPassword}
        disabled={profile.isSubmitting}
      />
    </div>
  );
};
