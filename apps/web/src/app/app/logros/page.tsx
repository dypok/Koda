'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { AchievementsView } from '@/views/achievements/AchievementsView';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';

export default function LogrosPage() {
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
        title="Accediendo a la Vitrina de Logros..."
        subtitle="Cargando tus medallas, conquistas y bonificaciones de XP..."
        terminalHint="> gamification :: fetch_user_achievements"
      />
    );
  }

  return <AchievementsView />;
}
