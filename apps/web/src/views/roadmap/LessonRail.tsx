'use client';

import React, { useCallback, useRef, useState } from 'react';
import { ArrowRight, Lock } from '@phosphor-icons/react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { RoadmapNodeIcon } from './RoadmapNodeIcon';
import { cn } from '@/lib/utils';

interface LessonRailProps {
  dataset: GraphDataset;
  onDeploy: (node: GraphNode) => void;
}

/**
 * Recorrido guiado lateral (vista lecciones): el scroll vertical del
 * contenedor mueve el track en horizontal (sticky + n*100vh).
 * En móvil: lista vertical nativa. Sin ScrollTrigger (scroller anidado).
 */
export const LessonRail: React.FC<LessonRailProps> = ({ dataset, onDeploy }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const nodes = dataset.nodes;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      const top = (index / Math.max(1, nodes.length - 1)) * max;
      el.scrollTo({ top, behavior: 'smooth' });
    },
    [nodes.length]
  );

  const activeIndex = Math.min(nodes.length - 1, Math.floor(progress * nodes.length));

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="absolute inset-0 overflow-y-auto overscroll-contain">
      {/* Desktop: viaje horizontal pineado */}
      <div className="relative max-lg:hidden" style={{ height: `${nodes.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div
            className="flex w-max items-stretch will-change-transform"
            style={{ transform: `translate3d(${-progress * (nodes.length - 1) * 100}vw, 0, 0)` }}
          >
            {nodes.map((node, i) => {
              const locked = !node.isUnlocked;
              return (
                <article
                  key={node.id}
                  aria-label={`Lección ${i + 1} de ${nodes.length}: ${node.label}${locked ? ', bloqueada' : ''}`}
                  className="w-screen shrink-0 px-6"
                >
                  <div className="mx-auto max-w-4xl grid grid-cols-12 gap-6 items-center">
                    <div className="col-span-2">
                      <span aria-hidden="true" className="font-display text-9xl leading-none font-black text-slate-800/80 tabular-nums select-none">
                        0{i + 1}
                      </span>
                    </div>
                    <div className="col-span-6 space-y-4 text-left">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                        {node.code}{node.statusText ? ` · ${node.statusText}` : ''}
                      </p>
                      <h3 className="font-display text-5xl font-bold text-white tracking-tight leading-[1.1]">
                        {node.label}
                      </h3>
                      {node.subtitle ? (
                        <p className="text-slate-400 text-base leading-relaxed max-w-md">{node.subtitle}</p>
                      ) : null}
                      <div className="flex items-center gap-4 font-mono text-xs font-bold">
                        <span className="text-amber-300">+{node.xp ?? 0} XP</span>
                        <span className="text-cyan-300">★ {node.stars ?? 0}/{node.maxStars ?? 3}</span>
                      </div>
                      {locked ? (
                        <p className="inline-flex items-center gap-2 rounded-xl border border-rose-900/40 bg-slate-900/80 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-400/80">
                          <Lock aria-hidden="true" className="w-4 h-4" />
                          Completa la lección anterior
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDeploy(node)}
                          className="inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-cyan-400 px-7 text-sm font-black uppercase tracking-wider text-slate-950 transition-all hover:bg-cyan-300"
                        >
                          Iniciar protocolo
                          <ArrowRight aria-hidden="true" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="col-span-4 flex items-center justify-center">
                      <div aria-hidden="true" className={cn(
                        'relative w-44 h-44 rounded-3xl border bg-slate-950 flex items-center justify-center',
                        locked ? 'border-slate-800' : 'border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)]'
                      )}>
                        <RoadmapNodeIcon
                          iconType={!node.isUnlocked && node.variant !== 'boss' ? 'lock' : node.iconType}
                          className={cn('w-16 h-16', locked ? 'text-slate-600' : 'text-cyan-300')}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Indicador estilo GSAP demo: fijo al viewport mientras el rail existe */}
          <div className="fixed bottom-[4.5rem] left-0 right-0 z-30 pointer-events-none">
            <div className="mx-auto max-w-4xl px-6 flex items-center gap-4 pointer-events-auto rounded-2xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-2.5">
              <span className="font-mono text-xs font-bold text-amber-300 tabular-nums">
                0{activeIndex + 1} / 0{nodes.length}
              </span>
              <div
                role="progressbar"
                aria-label={`Lección ${activeIndex + 1} de ${nodes.length}`}
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="flex-1 h-[3px] rounded-full bg-slate-800 overflow-hidden"
              >
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${progress * 100}%` }} />
              </div>
              <div className="flex items-center gap-2">
                {nodes.map((n, i) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Ir a ${n.label}`}
                    className={cn(
                      'h-2 rounded-full transition-all',
                      i === activeIndex ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Móvil: lista vertical nativa */}
      <div className="lg:hidden px-6 py-6 space-y-4">
        {nodes.map((node, i) => {
          const locked = !node.isUnlocked;
          return (
            <article key={`m-${node.id}`} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                0{i + 1} · {node.code}
              </p>
              <h3 className="font-display text-2xl font-bold text-white">{node.label}</h3>
              {node.subtitle ? <p className="text-sm text-slate-400">{node.subtitle}</p> : null}
              <div className="flex items-center gap-4 font-mono text-xs font-bold">
                <span className="text-amber-300">+{node.xp ?? 0} XP</span>
                <span className="text-cyan-300">★ {node.stars ?? 0}/{node.maxStars ?? 3}</span>
              </div>
              {locked ? (
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400/80">
                  <Lock aria-hidden="true" className="w-4 h-4" />
                  Completa la anterior
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => onDeploy(node)}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-cyan-400 px-6 text-sm font-black uppercase tracking-wider text-slate-950"
                >
                  Iniciar protocolo
                  <ArrowRight aria-hidden="true" className="w-4 h-4" />
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default LessonRail;
