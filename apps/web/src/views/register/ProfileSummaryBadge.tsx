'use client';

import React from 'react';
import { IconFlame, IconCode, IconCompass, IconSparkles, IconCheck } from '@tabler/icons-react';

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
    <div className="w-full mb-6 rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
      {/* Encabezado integrado de la tarjeta */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/70">
        <div className="flex items-center gap-2">
          <IconSparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Tu plan de aprendizaje configurado
          </span>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
          <IconCheck className="w-3 h-3 stroke-[3]" />
          Listo para guardar
        </span>
      </div>

      {/* Contenido con filas integradas al sistema */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Tecnología */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tecnología
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <IconCode className="w-3.5 h-3.5 text-amber-400" />
              {techName}
            </span>
          </div>

          {/* Meta diaria */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Meta diaria
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold">
              <IconFlame className="w-3.5 h-3.5 text-orange-400 fill-orange-500/40" />
              {goalTitle} ({goalMinutes} min/día)
            </span>
          </div>
        </div>

        {/* Nivel de Experiencia (ancho completo sin truncado) */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/70">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Nivel
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <IconCompass className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>{experienceTitle}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
