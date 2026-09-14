'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from '@phosphor-icons/react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

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
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Back button */}
        {currentStepIndex > 1 && onPrevStep ? (
          <button
            type="button"
            onClick={onPrevStep}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Volver al paso anterior"
          >
            <ArrowLeft aria-hidden="true" className="w-5 h-5" />
          </button>
        ) : (
          <Link
            href="/"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Volver a la página principal"
          >
            <ArrowLeft aria-hidden="true" className="w-5 h-5" />
          </Link>
        )}

        {/* Duolingo-style Progress Bar */}
        <div className="flex-1 max-w-md">
          <div
            role="progressbar"
            aria-label={`Paso ${currentStepIndex} de ${totalSteps}`}
            aria-valuenow={currentStepIndex}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            className="h-3.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60"
          >
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Brand Icon & Step Counter */}
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider tabular-nums">
            Paso <AnimatedCounter to={currentStepIndex} duration={0.6} className="inline-flex" /> de {totalSteps}
          </span>
          <Image
            src="/icon.svg"
            alt="Koda"
            width={48}
            height={36}
            className="h-6 w-auto object-contain select-none"
          />
        </div>
      </div>
    </header>
  );
};
