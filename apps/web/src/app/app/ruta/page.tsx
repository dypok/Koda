'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StudentRoadmapView } from '@/views/roadmap/StudentRoadmapView';
import { useAuthStore } from '@/stores/auth.store';

export default function RutaPage() {
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
    return <div className="min-h-screen bg-slate-950" />;
  }

  return <StudentRoadmapView />;
}
