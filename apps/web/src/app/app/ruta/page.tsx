'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudentRoadmapView } from '@/views/roadmap/StudentRoadmapView';
import { useAuthStore } from '@/stores/auth.store';

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
    return <div className="min-h-screen bg-slate-950" />;
  }

  return <StudentRoadmapView />;
}
