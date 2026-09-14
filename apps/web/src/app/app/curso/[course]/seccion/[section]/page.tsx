'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LessonWorkspace } from '@/views/lesson/LessonWorkspace';
import { useAuthStore } from '@/stores/auth.store';

export default function SectionPage() {
  const params = useParams<{ course: string; section: string }>();
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

  return <LessonWorkspace courseId={params.course} sectionRef={params.section} />;
}
