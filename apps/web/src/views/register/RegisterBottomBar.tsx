'use client';

import React from 'react';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface RegisterBottomBarProps {
  canContinue: boolean;
  onContinue: () => void;
  continueText?: string;
}

export const RegisterBottomBar: React.FC<RegisterBottomBarProps> = ({
  canContinue,
  onContinue,
  continueText = 'Continuar',
}) => {
  return (
    <footer className="sticky bottom-0 z-30 w-full bg-transparent py-3.5 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Existing account link */}
        <Link
          href="/login"
          className="text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors order-2 sm:order-1"
        >
          ¿Ya tienes una cuenta registrada?{' '}
          <span className="text-amber-400 hover:underline">Iniciar Sesión</span>
        </Link>

        {/* Continue Action */}
        <div className="w-full sm:w-auto flex justify-end order-1 sm:order-2">
          <GradientButton
            onClick={onContinue}
            disabled={!canContinue}
            size="lg"
            className="w-full sm:w-48 py-3 text-sm font-black gap-2 text-black"
          >
            <span className="text-black font-black">{continueText}</span>
            <IconArrowRight className="w-4 h-4 stroke-[2.5] text-black" />
          </GradientButton>
        </div>

      </div>
    </footer>
  );
};
