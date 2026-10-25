'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { NotebookView } from '@/views/notebook/NotebookView';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';

export default function CuadernoPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated) {
    return (
      <KodaLoadingScreen
        title="Accediendo al Cuaderno de Errores..."
        subtitle="Cargando tu registro de repaso adaptativo SuperMemo SM-2..."
        terminalHint="> notebook :: fetch_user_mistakes"
      />
    );
  }

  return <NotebookView />;
}
