'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Pillar } from '@/models/landing/methodology.model';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface PillarRailProps {
  pillars: Pillar[];
  onScrollTo: (id: string) => void;
}

/**
 * Rail lateral pineado (solo desktop): los 4 pilares viajan en horizontal
 * con scrub + indicador de progreso estilo GSAP lateral-pin.
 */
export const PillarRail: React.FC<PillarRailProps> = ({ pillars, onScrollTo }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;
      const distance = () => track.scrollWidth - window.innerWidth;
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
    // El pin cambia el layout: recalibrar triggers vecinos.
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const activeIndex = Math.min(pillars.length - 1, Math.floor(progress * pillars.length));

  return (
    <section ref={sectionRef} aria-label="Los cuatro pilares del método" className="relative hidden lg:block overflow-hidden">
      <div className="h-screen flex flex-col justify-center">
        <div ref={trackRef} className="flex w-max items-stretch will-change-transform">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.id}
                aria-label={`Pilar ${i + 1} de ${pillars.length}: ${pillar.title}`}
                className="w-screen shrink-0 px-8"
              >
                <div className="mx-auto max-w-5xl grid grid-cols-12 gap-10 items-center h-full">
                  <div className="col-span-2">
                    <span aria-hidden="true" className="font-display text-[10rem] leading-none font-black text-slate-800/80 tabular-nums select-none">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="col-span-5 space-y-5 text-left">
                    <div className={cn('w-16 h-16 rounded-2xl border bg-slate-950 flex items-center justify-center', pillar.badgeBorder, pillar.badgeText)}>
                      <Icon aria-hidden="true" className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-4xl xl:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                      {pillar.title}
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-md">{pillar.blurb}</p>
                    <button
                      type="button"
                      onClick={() => onScrollTo(pillar.id)}
                      className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-slate-700 px-5 text-sm font-bold text-slate-200 transition-all hover:border-amber-400/50 hover:text-amber-300"
                    >
                      Ver en acción
                      <ArrowRight aria-hidden="true" className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="col-span-5 flex items-center justify-center">
                    <div aria-hidden="true" className="relative">
                      <div className="absolute -inset-10 rounded-full bg-amber-500/10 blur-3xl" />
                      <div className={cn('relative w-56 h-56 rounded-3xl border bg-slate-950 flex items-center justify-center', pillar.badgeBorder)}>
                        <Icon className={cn('w-24 h-24', pillar.badgeText)} strokeWidth={1.25} />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Indicador lateral estilo GSAP demo */}
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="mx-auto max-w-5xl px-8 flex items-center gap-4">
            <span className="font-mono text-xs font-bold text-amber-300 tabular-nums">
              0{activeIndex + 1} / 0{pillars.length}
            </span>
            <div
              role="progressbar"
              aria-label={`Pilar ${activeIndex + 1} de ${pillars.length}`}
              aria-valuenow={Math.round(progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="flex-1 h-[3px] rounded-full bg-slate-800 overflow-hidden"
            >
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${progress * 100}%` }} />
            </div>
            <div className="flex items-center gap-2">
              {pillars.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onScrollTo(p.id)}
                  aria-label={`Ir al pilar ${p.title}`}
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

export default PillarRail;
