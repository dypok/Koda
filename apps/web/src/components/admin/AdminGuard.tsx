'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAdmin) {
      // Redirigir automáticamente al roadmap (o login si no está autenticado)
      router.replace(isAuthenticated ? '/' : '/login');
    }
  }, [hasHydrated, isAdmin, isAuthenticated, router]);

  if (!hasHydrated || !isAdmin) {
    return (
      <KodaLoadingScreen
        title={!hasHydrated ? 'Verificando Protocolo de Administracion...' : 'Redirigiendo al Roadmap...'}
        subtitle={
          !hasHydrated
            ? 'Validando credenciales encriptadas y permisos de rol...'
            : 'Esta sección requiere permisos de administrador. Volviendo a la plataforma de estudiantes...'
        }
        terminalHint={!hasHydrated ? '> auth :: check_admin_privileges' : '> auth :: redirect_unauthorized -> /'}
      />
    );
  }

  return <>{children}</>;
};
