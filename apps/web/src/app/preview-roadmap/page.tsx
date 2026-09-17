import React from 'react';
import { RouteLab } from '@/views/roadmap/route-lab/RouteLab';

export const metadata = {
  title: 'Route Lab — Propuestas de la ruta Lua',
  description: 'Preview de 4 diseños para el apartado Lua del roadmap.',
};

export default function PreviewRoadmapPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <RouteLab />
    </main>
  );
}
