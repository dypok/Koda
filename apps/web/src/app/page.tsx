'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { StudentRoadmapView } from '@/views/roadmap/StudentRoadmapView';
import { LandingPageView } from '@/views/landing/LandingPageView';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, hasEverLoggedIn, hasHydrated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!hasHydrated) return;

    // Si el usuario llega explicitamente solicitando la landing (ej. desde 404, error o login)
    const isExplicitLanding = typeof window !== 'undefined' && window.location.search.includes('landing=true');
    if (isExplicitLanding) {
      return;
    }

    if (isAuthenticated) {
      if (user && user.onboardingCompleted === false && user?.role !== 'admin') {
        router.replace('/register');
      }
    } else if (hasEverLoggedIn) {
      // Un usuario que ya ha iniciado sesión antes va al login por defecto
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, hasEverLoggedIn, user, router]);

  const isExplicitLanding = typeof window !== 'undefined' && window.location.search.includes('landing=true');

  if (!hasHydrated) {
    return (
      <KodaLoadingScreen
        title="Cargando Koda..."
        subtitle="Verificando tu sesión de aprendizaje..."
        terminalHint="> auth :: verificando sesion"
      />
    );
  }

  // Si se solicita expresamente ver la landing page
  if (isExplicitLanding && !isAuthenticated) {
    return <LandingPageView />;
  }

  // Si ya inició sesión alguna vez pero no está autenticado, está siendo redirigido a /login
  if (!isAuthenticated && hasEverLoggedIn) {
    return (
      <KodaLoadingScreen
        title="Redirigiendo al inicio de sesión..."
        subtitle="Sesión no iniciada. Acceso directo a Koda..."
        terminalHint="> auth :: redirigiendo a /login"
      />
    );
  }

  // Si el usuario está autenticado y tiene pendiente el onboarding, se está redirigiendo a /register
  if (isAuthenticated && user?.onboardingCompleted === false) {
    return (
      <KodaLoadingScreen
        title="Completando registro..."
        subtitle="Te estamos redirigiendo para finalizar tu configuración..."
        terminalHint="> onboarding :: redirigiendo"
      />
    );
  }

  // Usuario autenticado: el Roadmap vive directamente en la raíz (/)
  if (isAuthenticated) {
    return <StudentRoadmapView />;
  }

  // Visitante primerizo que nunca se ha logueado en la plataforma
  return <LandingPageView />;
}
