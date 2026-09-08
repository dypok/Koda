'use client';

import React from 'react';
import Link from 'next/link';
import {
  IconArrowLeft,
  IconSparkles,
  IconCircleCheck,
  IconShieldCheck,
} from '@tabler/icons-react';
import { GradientButton } from '@/components/ui/gradient-button';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Main Container */}
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <IconArrowLeft className="w-4 h-4" />
          Volver a la página principal
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              <IconSparkles className="w-3 h-3" />
              Próximamente
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Inicio de Sesión
            </h1>
            <p className="text-xs text-slate-400">
              Campus Oficial de KodaAcademy
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed text-left sm:text-center">
            El sistema de autenticación de estudiantes de KodaAcademy se encuentra en su fase final de integración técnica y aseguramiento de calidad. Estará habilitado próximamente para el acceso oficial a la plataforma.
          </p>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <IconCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sincronización de progreso y estrellas en la nube</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cuaderno de errores persistente con remediación</span>
            </div>
            <div className="flex items-center gap-2">
              <IconShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sesiones seguras con cifrado de credenciales</span>
            </div>
          </div>

          <GradientButton asChild className="w-full text-sm py-3">
            <Link href="/">
              Entendido, volver al inicio
            </Link>
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
