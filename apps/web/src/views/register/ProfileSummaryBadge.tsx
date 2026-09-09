'use client';

import React from 'react';
import { IconFlame, IconCode, IconCompass } from '@tabler/icons-react';

interface ProfileSummaryBadgeProps {
  techName?: string;
  experienceTitle?: string;
  goalTitle?: string;
  goalMinutes?: number;
}

export const ProfileSummaryBadge: React.FC<ProfileSummaryBadgeProps> = ({
  techName = 'Python',
  experienceTitle = 'Principiante',
  goalTitle = 'Regular',
  goalMinutes = 10,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-6 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
        Tu plan de aprendizaje configurado
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <IconCode className="w-3.5 h-3.5" />
          {techName}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
          <IconCompass className="w-3.5 h-3.5" />
          {experienceTitle}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <IconFlame className="w-3.5 h-3.5 text-orange-400" />
          {goalTitle} ({goalMinutes} min/día)
        </span>
      </div>
    </div>
  );
};
