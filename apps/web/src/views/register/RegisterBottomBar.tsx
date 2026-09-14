'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CircleNotch } from '@phosphor-icons/react';
import { GradientButton } from '@/components/ui/gradient-button';

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
          <GradientButton
            onClick={onContinue}
            disabled={!canContinue || isLoading}
            aria-disabled={!canContinue || isLoading}
            size="lg"
            className="w-full sm:w-56 py-3 text-sm gap-2"
          >
            {isLoading ? (
              <>
                <CircleNotch aria-hidden="true" className="w-4 h-4 animate-spin stroke-[2.5]" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <span>{continueText}</span>
                <ArrowRight aria-hidden="true" className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </GradientButton>
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
