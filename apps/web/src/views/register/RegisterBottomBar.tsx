'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CircleNotch } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface RegisterBottomBarProps {
  canContinue: boolean;
  onContinue: () => void;
  continueText?: string;
  blockedHint?: string;
  isLoading?: boolean;
}

export const RegisterBottomBar: React.FC<RegisterBottomBarProps> = ({
  canContinue,
  onContinue,
  continueText = 'Continuar',
  blockedHint = 'Elige una opción para continuar',
  isLoading = false,
}) => {
  return (
    <footer className="sticky bottom-0 z-30 w-full bg-slate-950/85 backdrop-blur-md border-t border-slate-800/60 py-3.5 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Continue Action */}
        <div className="w-full sm:w-auto flex flex-col items-stretch sm:items-end justify-end order-1 sm:order-2 gap-1.5">
          {/* Wipe diagonal multicapa: mismo CTA en los 5 pasos */}
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue || isLoading}
            aria-disabled={!canContinue || isLoading}
            className={cn(
              'group relative w-full sm:w-56 min-h-[48px] overflow-hidden rounded-xl px-4 py-3 text-sm font-bold',
              'bg-amber-400 text-slate-950 shadow-[0_4px_20px_-2px_rgba(249,115,22,0.45)]',
              'transition-all duration-300 hover:shadow-[0_8px_32px_-2px_rgba(249,115,22,0.65)] active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300',
              'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none'
            )}
          >
            {isLoading ? (
              <span className="relative z-10 flex items-center justify-center gap-2">
                <CircleNotch aria-hidden="true" className="w-4 h-4 animate-spin stroke-[2.5]" />
                <span>Creando cuenta...</span>
              </span>
            ) : (
              <>
                <span className="relative z-10 flex items-center justify-center gap-2 transition-opacity duration-300 group-hover:opacity-0">
                  <span>{continueText}</span>
                  <ArrowRight aria-hidden="true" className="w-4 h-4 stroke-[2.5]" />
                </span>
                {canContinue && (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute -left-4 -top-10 h-40 w-[130%] origin-left rotate-12 scale-x-0 bg-amber-200 transition-transform duration-500 group-hover:scale-x-100"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -left-4 -top-10 h-40 w-[130%] origin-left rotate-12 scale-x-0 bg-amber-500 transition-transform duration-700 group-hover:scale-x-100"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -left-4 -top-10 h-40 w-[130%] origin-left rotate-12 scale-x-0 bg-amber-600 transition-transform duration-1000 group-hover:scale-x-100"
                    />
                    <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:duration-1000">
                      <span>{continueText}</span>
                      <ArrowRight aria-hidden="true" className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </>
                )}
              </>
            )}
          </button>
          {!canContinue && !isLoading && (
            <p aria-live="polite" className="text-[11px] text-slate-500">
              {blockedHint}
            </p>
          )}
        </div>

        {/* Existing account link */}
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors order-2 sm:order-1 py-2"
        >
          ¿Ya tienes una cuenta registrada?{' '}
          <span className="text-amber-400 hover:underline">Iniciar Sesión</span>
        </Link>

      </div>
    </footer>
  );
};
