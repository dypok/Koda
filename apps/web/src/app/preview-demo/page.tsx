import React from 'react';
import { DemoLab } from '@/views/landing/preview/demo-lab/DemoLab';

export const metadata = {
  title: 'Demo Lab — Lesson Preview',
  description: 'Preview de 12 propuestas para la tarjeta demo de la lección.',
};

export default function PreviewDemoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <DemoLab />
    </main>
  );
}
