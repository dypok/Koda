import React from 'react';
import { VariantLab } from '@/views/register/variant-lab/VariantLab';

export const metadata = {
  title: 'Variant Lab — Register Grid',
  description: 'Preview de 12 estilos para los botones del grid del register.',
};

export default function PreviewRegisterPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <VariantLab />
    </main>
  );
}
