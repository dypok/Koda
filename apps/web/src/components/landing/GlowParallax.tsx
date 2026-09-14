'use client';

import { useLayoutEffect } from 'react';
import { getGsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Da vida a los glows decorativos: cada `[data-glow]` se mueve
 * a su propio ritmo con scrub mientras el contenido va al 100%.
 */
export const GlowParallax: React.FC = () => {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-glow]').forEach((el) => {
        const amt = Number(el.dataset.glow ?? 10);
        // Absorbe los translates de Tailwind para no pelear por el transform.
        let baseX = 0;
        let baseY = 0;
        if (el.classList.contains('-translate-x-1/2')) {
          baseX = -50;
          el.classList.remove('-translate-x-1/2');
        }
        if (el.classList.contains('-translate-y-1/2')) {
          baseY = -50;
          el.classList.remove('-translate-y-1/2');
        }
        gsap.set(el, { xPercent: baseX, yPercent: baseY });
        gsap.fromTo(
          el,
          { yPercent: baseY - amt },
          {
            yPercent: baseY + amt,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
};

export default GlowParallax;
