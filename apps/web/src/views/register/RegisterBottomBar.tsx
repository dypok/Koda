'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CircleNotch } from '@phosphor-icons/react';
import { WipeButton } from '@/components/ui/wipe-button';

interface RegisterBottomBarProps {
  canContinue: boolean;
  onContinue: () => void;
  continueText?: string;
  blockedHint?: string;
  isLoading?: boolean;
  isOAuthUser?: boolean;
  userEmail?: string;
}

export const RegisterBottomBar: React.FC<RegisterBottomBarProps> = ({
  canContinue,
  onContinue,
  continueText = 'Continuar',
  blockedHint = 'Elige una opción para continuar',
  isLoading = false,
  isOAuthUser = false,
  userEmail,
}) => {
  return (
    <footer className="sticky bottom-0 z-30 w-full bg-slate-950/85 backdrop-blur-md border-t border-slate-800/60 py-3.5 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Continue Action */}
        <div className="w-full sm:w-auto flex flex-col items-stretch sm:items-end justify-end order-1 sm:order-2 gap-1.5">
          {/* Wipe diagonal simétrico: mismo CTA en los 5 pasos */}
          <WipeButton
            onClick={onContinue}
            disabled={!canContinue || isLoading}
            className="w-full sm:w-56 py-3 text-sm gap-2"
          >
            {isLoading ? (
              <>
                <CircleNotch aria-hidden="true" className="w-4 h-4 animate-spin stroke-[2.5]" />
                <span>{isOAuthUser ? 'Guardando preferencias...' : 'Creando cuenta...'}</span>
              </>
            ) : (
              <>
                <span>{continueText}</span>
                <ArrowRight aria-hidden="true" className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </WipeButton>
          {!canContinue && !isLoading && (
            <p aria-live="polite" className="text-[11px] text-slate-500">
              {blockedHint}
            </p>
          )}
        </div>

        {/* Existing account link o Indicador de Sesión Activa */}
        {isOAuthUser ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 order-2 sm:order-1 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>
              Sesión activa como <strong className="text-slate-200">{userEmail}</strong>
            </span>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors order-2 sm:order-1 py-2"
          >
            ¿Ya tienes una cuenta registrada?{' '}
            <span className="text-amber-400 hover:underline">Iniciar Sesión</span>
          </Link>
        )}

      </div>
    </footer>
  );
};
