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
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {/* Badge Tecnología */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-bold">
        <IconCode className="w-3.5 h-3.5 text-amber-400" />
        <span>{techName}</span>
      </span>

      {/* Badge Nivel de Experiencia */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/35 text-blue-300 text-xs font-semibold">
        <IconCompass className="w-3.5 h-3.5 text-blue-400" />
        <span>{experienceTitle}</span>
      </span>

      {/* Badge Meta Diaria */}
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/35 text-orange-300 text-xs font-bold">
        <IconFlame className="w-3.5 h-3.5 text-orange-400 fill-orange-500/30" />
        <span>{goalTitle} · {goalMinutes} min/día</span>
      </span>
    </div>
  );
};
