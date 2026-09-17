'use client';

import React from 'react';
import { Code, Compass, Flame, PencilSimple } from '@phosphor-icons/react';

interface ProfileSummaryBadgeProps {
  techName?: string;
  experienceTitle?: string;
  goalTitle?: string;
  goalMinutes?: number;
  onEditStep?: (step: number) => void;
}

/** Tu plan: resumen revisable con salto al paso correspondiente. */
export const ProfileSummaryBadge: React.FC<ProfileSummaryBadgeProps> = ({
  techName,
  experienceTitle,
  goalTitle,
  goalMinutes,
  onEditStep,
}) => {
  const rows = [
    { icon: Code, label: 'Tecnología', value: techName ?? 'Sin elegir', step: 1, cls: 'text-amber-300 border-amber-500/35 bg-amber-500/15', iconCls: 'text-amber-400' },
    { icon: Compass, label: 'Nivel', value: experienceTitle ?? 'Sin elegir', step: 2, cls: 'text-blue-300 border-blue-500/35 bg-blue-500/15', iconCls: 'text-blue-400' },
    {
      icon: Flame,
      label: 'Meta diaria',
      value: goalTitle ? `${goalTitle}${goalMinutes ? ` · ${goalMinutes} min` : ''}` : 'Sin elegir',
      step: 4,
      cls: 'text-orange-300 border-orange-500/35 bg-orange-500/15',
      iconCls: 'text-orange-400',
    },
  ];

  return (
    <div className="pt-1">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Tu plan</p>
      <ul className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <li
            key={row.label}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${row.cls}`}
          >
            <row.icon aria-hidden="true" className={`w-3.5 h-3.5 shrink-0 ${row.iconCls}`} />
            <span className="text-slate-400 font-medium">{row.label}:</span>
            <span className="flex-1 truncate">{row.value}</span>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(row.step)}
                aria-label={`Editar ${row.label.toLowerCase()}`}
                className="inline-flex min-h-[28px] min-w-[28px] items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
              >
                <PencilSimple aria-hidden="true" className="w-3.5 h-3.5" />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
