'use client';

import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';

export const ComingSoonBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative isolate flex items-center justify-between gap-x-6 overflow-hidden bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 px-4 py-2.5 sm:px-6 border-b border-amber-500/30 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mx-auto text-xs sm:text-sm text-slate-200">
        <span className="flex items-center gap-1.5 font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Acceso Anticipado
        </span>
        <span className="text-slate-300">
          <strong className="font-semibold text-white">Koda 🦊</strong> está afinando los últimos detalles para el gran lanzamiento de <strong className="text-amber-300">Python 3.12</strong>.
        </span>
        <button
          onClick={scrollToWaitlist}
          className="inline-flex items-center gap-1 font-medium text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-300 transition-colors"
        >
          Unirme a la lista de espera
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="-m-1.5 p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
        aria-label="Cerrar aviso"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
