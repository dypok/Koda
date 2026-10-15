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
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-orange-400 animate-spin" />
        <p className="font-mono text-xs text-slate-400 tracking-wider">CARGANDO ESPACIO DE APRENDIZAJE…</p>
      </div>
    );
  }

  const courseId = typeof params?.course === 'string' ? params.course : Array.isArray(params?.course) ? params.course[0] : '';
  const sectionRef = typeof params?.section === 'string' ? params.section : Array.isArray(params?.section) ? params.section[0] : '';

  return <LessonWorkspace courseId={courseId} sectionRef={sectionRef} />;
}
