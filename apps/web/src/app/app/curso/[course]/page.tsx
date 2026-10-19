'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const COURSE_DEFAULT_SECTIONS: Record<string, string> = {
  'python-1': 'py-m01',
  'python-2': 'py2-m01',
  'python-3': 'py3-m01',
  'fastapi-async': 'fa-m01',
  'django-enterprise': 'dj-m01',
  'data-analytics': 'data-analytics-s01',
  'ai-agents': 'ai-agents-s01',
  'python-apex': 'python-apex-s01',
};

export default function CourseRedirectPage() {
  const params = useParams<{ course: string }>();
  const router = useRouter();

  useEffect(() => {
    const courseId = typeof params?.course === 'string' ? params.course : 'python-1';
    const section = COURSE_DEFAULT_SECTIONS[courseId] || 'py-m01';
    router.replace(`/app/curso/${courseId}/seccion/${section}`);
  }, [params, router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-orange-400 animate-spin" />
      <p className="font-mono text-xs text-slate-400 tracking-wider">CARGANDO CURSO…</p>
    </div>
  );
}
