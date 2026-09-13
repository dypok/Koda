'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { SkillTreeDefs } from '@/views/landing/skill-tree/SkillTreeDefs';
import { SkillTreeConnections } from '@/views/landing/skill-tree/SkillTreeConnections';
import { SkillTreeMainNodes } from '@/views/landing/skill-tree/SkillTreeMainNodes';
import { SkillTreeBranches } from '@/views/landing/skill-tree/SkillTreeBranches';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';

export const MiniSkillTree: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<SVGPathElement>('.st-draw').forEach((path, i) => {
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapRef.current,
              start: 'top 85%',
              end: `top ${55 - i * 6}%`,
              scrub: 0.5,
            },
          }
        );
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full max-w-lg mx-auto select-none">
      {/* Resplandor ambiental cósmico sutil (GPU Layer) */}
      <div aria-hidden="true" className="absolute -inset-6 bg-gradient-to-r from-cyan-500/10 via-amber-500/15 to-rose-500/10 rounded-full blur-xl opacity-60 pointer-events-none transform-gpu contain-paint" />

      {/* Canvas SVG de la Constelación integrado directamente */}
      <div className="relative aspect-[580/260] w-full">
        <svg
          viewBox="0 0 580 260"
          role="img"
          aria-label="Mapa de ruta Koda: Sintaxis, Scope y Funciones dominados, Control Flow en progreso, POO bloqueado, Memoria disponible y reto final Apex Gate"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <SkillTreeDefs />
          <SkillTreeConnections />
          <SkillTreeMainNodes />
          <SkillTreeBranches />
        </svg>
      </div>
    </div>
  );
};

export default MiniSkillTree;
