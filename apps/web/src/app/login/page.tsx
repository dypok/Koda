'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { KodaMascot } from '../../components/mascot/KodaMascot';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la página principal
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
          {/* Mascot in thinking/welcoming mode */}
          <div className="flex justify-center -my-3">
            <KodaMascot size={150} mood="thinking" interactive={true} />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              <Sparkles className="w-3 h-3" />
              Próximamente
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Inicio de Sesión
            </h1>
            <p className="text-xs text-slate-400">
              Campus Educativo de Koda · Python 3.12
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed text-left sm:text-center">
            El sistema de autenticación de estudiantes se encuentra en su fase final de integración técnica y aseguramiento de calidad. Estará habilitado próximamente para el acceso oficial a la plataforma.
          </p>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-left space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sincronización de progreso y estrellas en la nube</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cuaderno de errores persistente con remediación</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sesiones seguras con cifrado de credenciales</span>
            </div>
          </div>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            Entendido, volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
