'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { StudentRoadmapView } from '@/views/roadmap/StudentRoadmapView';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';

/**
 * Página Principal de la Aplicación (Subdominio: app.localhost:3000 / app.koda.com)
 * Muestra el Roadmap del estudiante si está autenticado, o redirige a /login.
 */
export default function AppPage() {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      if (hash && (hash.includes('access_token=') || hash.includes('error='))) {
        router.replace(`/login${hash}`);
      } else {
        router.replace('/login');
      }
    } else if (user && user.onboardingCompleted === false) {
      router.replace('/register');
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  if (!hasHydrated) {
    return (
      <KodaLoadingScreen
        title="Cargando tu Roadmap..."
        subtitle="Verificando tu sesión de aprendizaje..."
        terminalHint="> auth :: verificando sesion"
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <KodaLoadingScreen
        title="Redirigiendo al inicio de sesión..."
        subtitle="Acceso al espacio de aprendizaje de Koda..."
        terminalHint="> auth :: redirigiendo a /login"
      />
    );
  }

  if (user?.onboardingCompleted === false) {
    return (
      <KodaLoadingScreen
        title="Completando registro..."
        subtitle="Te estamos redirigiendo para finalizar tu configuración..."
        terminalHint="> onboarding :: redirigiendo"
      />
    );
  }

  return <StudentRoadmapView />;
}
