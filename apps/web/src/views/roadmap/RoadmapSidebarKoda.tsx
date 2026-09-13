'use client';

import React from 'react';
import Image from 'next/image';
import { IconRadio, IconChevronUp, IconChevronDown, IconSparkles } from '@tabler/icons-react';
import { useRoadmapStore } from '@/stores/roadmap.store';
import { cn } from '@/lib/utils';

const KODA_PEDAGOGICAL_TIPS: Record<string, string[]> = {
  frontend: [
    'Optimiza el árbol DOM reutilizando elementos y evitando reflujos innecesarios.',
    'Usa flexbox y grid para maquetaciones fluidas antes de forzar posiciones absolutas.',
    'Separa siempre la estructura (HTML), la estética (CSS) y la reactividad (JS).',
  ],
  backend: [
    'Valida los datos en el servidor siempre: nunca confíes ciegamente en el frontend.',
    'Diseña APIs RESTful idempotentes usando los verbos HTTP correspondientes.',
    'La concurrencia y las transacciones ACID protegen la integridad de tu base de datos.',
  ],
  devops: [
    'Aplica compilaciones multi-etapa en Docker para mantener imágenes hiper-ligeras.',
    'La infraestructura como código (IaC) garantiza entornos idénticos y reproducibles.',
    'Monitorea métricas y logs antes de que los errores alcancen a los usuarios.',
  ],
  python: [
    'Recuerda: las listas son mutables y dinámicas; las tuplas son fijas e inmutables.',
    'Aprovecha las comprensiones de listas para un código conciso y pythónico.',
    'El Zen de Python: lo explícito es siempre mejor que lo implícito.',
  ],
};

export function RoadmapSidebarKoda() {
  const { activeBranchId } = useRoadmapStore();
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [tipIndex, setTipIndex] = React.useState(0);

  const tips = KODA_PEDAGOGICAL_TIPS[activeBranchId] || KODA_PEDAGOGICAL_TIPS.python;
  const currentTip = tips[tipIndex % tips.length];

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <>
      {/* 1. Full Holographic Console on lg screens */}
      <div className="hidden lg:block pt-3 border-t border-slate-800/40">
        <div
          className={cn(
            'rounded-xl border transition-all duration-300 relative overflow-hidden',
            'border-cyan-500/30 bg-gradient-to-b from-cyan-950/25 via-slate-900/60 to-slate-950/80',
            'shadow-[0_0_15px_rgba(6,182,212,0.08)]'
          )}
        >
          {/* Holographic Scanlines Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.12) 2px, rgba(6, 182, 212, 0.12) 4px)',
            }}
          />

          {/* Console Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20 bg-slate-950/40 relative z-10">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 p-0.5 flex items-center justify-center shrink-0">
                <Image
                  src="/brand/koda-mascot-cartoon-2d.svg"
                  alt="Koda Holograma"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                  Koda Holo-Comms
                </span>
                <span className="text-[8px] font-mono text-emerald-400/90 leading-none">
                  ONLINE • EN ÓRBITA
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleNextTip}
                title="Siguiente consejo de Koda"
                className="p-1 rounded-md text-cyan-400/80 hover:text-cyan-200 hover:bg-cyan-500/10 transition-colors"
              >
                <IconSparkles className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? 'Minimizar holo-comms' : 'Expandir holo-comms'}
                className="p-1 rounded-md text-cyan-400/80 hover:text-cyan-200 hover:bg-cyan-500/10 transition-colors"
              >
                {isExpanded ? (
                  <IconChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <IconChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Console Content */}
          {isExpanded && (
            <div className="p-3 relative z-10 space-y-2">
              <div className="flex items-start gap-2">
                <IconRadio className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                  {currentTip}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[8px] font-mono text-cyan-400/60 uppercase tracking-wider">
                <span>SECTOR: {activeBranchId.toUpperCase()}</span>
                <span>TRANSMISIÓN SEGURA</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Compact Mascot Beacon for < lg screens */}
      <div className="lg:hidden flex justify-center pt-2 border-t border-slate-800/40">
        <div
          className="relative group p-2 rounded-xl bg-cyan-950/30 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)] cursor-pointer"
          onClick={handleNextTip}
        >
          <Image
            src="/brand/koda-mascot-cartoon-2d.svg"
            alt="Koda"
            width={24}
            height={24}
            className="w-5 h-5 object-contain"
          />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />

          {/* Tooltip on hover for small screens */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 w-56 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-300">
              <IconSparkles className="w-3 h-3 text-cyan-400" />
              <span>Koda Holo-Comms</span>
            </div>
            <p className="text-[10px] font-mono text-slate-300 mt-1 leading-snug">
              {currentTip}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
