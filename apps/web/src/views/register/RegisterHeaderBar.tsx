'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconArrowLeft } from '@tabler/icons-react';

interface RegisterHeaderBarProps {
  currentStepIndex?: number;
  totalSteps?: number;
  onPrevStep?: () => void;
}

export const RegisterHeaderBar: React.FC<RegisterHeaderBarProps> = ({
  currentStepIndex = 1,
  totalSteps = 5,
  onPrevStep,
}) => {
  const progressPercent = Math.min(100, Math.max(10, (currentStepIndex / totalSteps) * 100));

  return (
    <header className="sticky top-0 z-30 w-full bg-transparent">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Back button */}
        {currentStepIndex > 1 && onPrevStep ? (
          <button
            type="button"
            onClick={onPrevStep}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Volver al paso anterior"
          >
            <IconArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <Link
            href="/"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            aria-label="Volver a la página principal"
          >
            <IconArrowLeft className="w-5 h-5" />
          </Link>
        )}

        {/* Duolingo-style Progress Bar */}
        <div className="flex-1 max-w-md">
          <div className="h-3.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Brand Icon & Step Counter */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-wider">
            Paso {currentStepIndex} de {totalSteps}
          </span>
          <div className="h-8 w-8 rounded-lg bg-[#182030] border border-slate-800 flex items-center justify-center overflow-hidden">
            <Image src="/logo.png" alt="Koda" width={24} height={24} className="object-contain" />
          </div>
        </div>
      </div>
    </header>
  );
};
