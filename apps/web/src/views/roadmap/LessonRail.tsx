'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { GraphDataset, GraphNode } from '@/models/roadmap/roadmap-graph.types';
import { RoadmapNodeIcon } from './RoadmapNodeIcon';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface LessonRailProps {
  dataset: GraphDataset;
  onDeploy: (node: GraphNode) => void;
}

/**
 * Recorrido guiado lateral (vista lecciones): paneles pineados en horizontal
 * con indicador 01/N + barra + dots, estilo GSAP lateral-pin.
 */
export const LessonRail: React.FC<LessonRailProps> = ({ dataset, onDeploy }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const nodes = dataset.nodes;

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress(self.progress),
        },
      });
    }, sectionRef);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [nodes.length]);

  const goTo = (index: number) => {
    const { ScrollTrigger } = getGsap();
    const track = trackRef.current;
    if (!track) return;
    const distance = Math.max(0, track.scrollWidth - window.innerWidth);
    const target = (index / Math.max(1, nodes.length - 1)) * distance;
    const st = ScrollTrigger.getAll().find((s) => s.trigger === sectionRef.current);
    if (st) {
      const scrollPos = st.start + target;
      window.scrollTo({ top: scrollPos, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };

  const activeIndex = Math.min(nodes.length - 1, Math.floor(progress * nodes.length));

  return (
    <section ref={sectionRef} aria-label={`Recorrido de lecciones: ${dataset.sectorTitle}`} className="relative overflow-hidden">
      <div className="lg:h-screen flex flex-col justify-center">
        <div ref={trackRef} className="flex w-max items-stretch will-change-transform max-lg:flex-col max-lg:w-full">
          {nodes.map((node, i) => {
            const locked = !node.isUnlocked;
            return (
              <article
                key={node.id}
                aria-label={`Lección ${i + 1} de ${nodes.length}: ${node.label}${locked ? ', bloqueada' : ''}`}
                className="w-screen max-lg:w-full shrink-0 px-6 py-10 lg:py-0"
              >
                <div className="mx-auto max-w-4xl grid lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-2">
                    <span aria-hidden="true" className="font-display text-7xl lg:text-9xl leading-none font-black text-slate-800/80 tabular-nums select-none">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="lg:col-span-6 space-y-4 text-left">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                      {node.code}{node.statusText ? ` · ${node.statusText}` : ''}
                    </p>
                    <h3 className="font-display text-3xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                      {node.label}
                    </h3>
                    {node.subtitle ? (
                      <p className="text-slate-400 text-sm lg:text-base leading-relaxed max-w-md">{node.subtitle}</p>
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
                  <div className="lg:col-span-4 hidden lg:flex items-center justify-center">
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

        {/* Indicador estilo GSAP demo */}
        <div className="max-lg:hidden absolute bottom-8 left-0 right-0 z-10">
          <div className="mx-auto max-w-4xl px-6 flex items-center gap-4">
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
    </section>
  );
};

export default LessonRail;
