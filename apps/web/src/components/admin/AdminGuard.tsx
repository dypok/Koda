'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, WarningCircle, ArrowRight, Lock } from '@phosphor-icons/react';
import { useAuthStore } from '@/stores/auth.store';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (!hasHydrated) {
    return (
      <KodaLoadingScreen
        title="Verificando Protocolo de Administracion..."
        subtitle="Validando credenciales encriptadas y permisos de rol..."
        terminalHint="> auth :: check_admin_privileges"
      />
    );
  }

  const isAdmin = Boolean(
    isAuthenticated &&
    (user?.role === 'admin' || user?.email?.toLowerCase().includes('admin'))
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Grilla tactica de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <span>Acceso Restringido</span>
            </h1>
            <p className="text-sm text-slate-400">
              Esta seccion requiere permisos verificados de Administrador de Koda Academy.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-left text-xs font-mono space-y-1">
            <div className="text-slate-500">terminal status:</div>
            <div className="text-rose-400 flex items-center gap-1.5">
              <WarningCircle className="w-4 h-4 shrink-0" />
              <span>ERR_UNAUTHORIZED: Rol insuficiente</span>
            </div>
            <div className="text-slate-400">
              Usuario activo: {user?.email || 'No autenticado'}
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Iniciar con Credenciales Admin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              Volver a Plataforma de Estudiantes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
