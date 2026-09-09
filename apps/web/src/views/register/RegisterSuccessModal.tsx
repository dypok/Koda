'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IconSparkles, IconArrowRight, IconFlame } from '@tabler/icons-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface RegisterSuccessModalProps {
  isOpen: boolean;
  studentName?: string;
  techName?: string;
  goalMinutes?: number;
}

export const RegisterSuccessModal: React.FC<RegisterSuccessModalProps> = ({
  isOpen,
  studentName = 'Estudiante',
  techName = 'Python',
  goalMinutes = 10,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center space-y-5">
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
          <Image
            src="/brand/koda-mascot-cartoon-2d.svg"
            alt="Koda celebrando"
            width={120}
            height={120}
            className="w-full h-full object-contain relative z-10 select-none animate-bounce"
          />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            <IconSparkles className="w-3.5 h-3.5" />
            ¡Perfil Guardado con Éxito!
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            ¡Bienvenido, {studentName}!
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
            Tu viaje para dominar <strong className="text-amber-400">{techName}</strong> ha comenzado. Hemos activado tu racha y tu meta diaria de {goalMinutes} min.
          </p>
        </div>

        <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-center gap-4 text-xs font-semibold text-slate-300">
          <span className="flex items-center gap-1.5 text-orange-400">
            <IconFlame className="w-4 h-4 fill-orange-500" />
            Racha: 1 día iniciada
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400">XP Inicial: +50 XP</span>
        </div>

        <GradientButton asChild className="w-full py-3 text-sm gap-2">
          <Link href="/">
            <span>Comenzar a Programar</span>
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </GradientButton>
      </div>
    </div>
  );
};
