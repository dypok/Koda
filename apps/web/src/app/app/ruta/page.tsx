'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudentRoadmapView } from '@/views/roadmap/StudentRoadmapView';
import { useAuthStore } from '@/stores/auth.store';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';

export default function RutaPage() {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (hasHydrated) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user && user.onboardingCompleted === false) {
        router.replace('/register');
      }
    }
  }, [hasHydrated, isAuthenticated, user, router]);

  if (!hasHydrated || !isAuthenticated) {
    return (
      <KodaLoadingScreen
        title="Cargando tu ruta..."
        subtitle="Sincronizando tus lecciones y desafíos..."
        terminalHint="> roadmap :: inicializando"
      />
    );
  }

  return <StudentRoadmapView />;
}
