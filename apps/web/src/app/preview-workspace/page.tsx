import React from 'react';
import { WorkspaceLab } from '@/views/workspace-lab/WorkspaceLab';

export const metadata = {
  title: 'Workspace Lab — 6 Propuestas Minimalistas',
  description: 'Laboratorio de diseño interactivo con 6 propuestas visuales minimalistas para el Workspace de Lecciones de Koda.',
};

export default function PreviewWorkspacePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <WorkspaceLab />
    </main>
  );
}
