import type { MotionProps } from 'framer-motion';

/**
 * Preset mínimo de entrada para las secciones de la landing.
 *
 * - Fade de 0.35s con un desplazamiento corto (14px por defecto).
 * - Se reproduce una sola vez al entrar en viewport.
 * - Respeta `prefers-reduced-motion`: si está activo, el contenido aparece sin animación.
 * - Solo anima `opacity` y `transform` (compositor), sin scrub ni pin.
 */
export const REVEAL_DURATION = 0.35;
export const REVEAL_DISTANCE = 14;
export const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'fade';

interface RevealOptions {
  variant?: RevealVariant;
  delay?: number;
  distance?: number;
}

export function reveal(
  reduceMotion: boolean | null,
  { variant = 'up', delay = 0, distance = REVEAL_DISTANCE }: RevealOptions = {}
): MotionProps {
  const from: Record<string, number> = { opacity: 0 };

  switch (variant) {
    case 'up':
      from.y = distance;
      break;
    case 'left':
      from.x = -distance;
      break;
    case 'right':
      from.x = distance;
      break;
    case 'scale':
      from.scale = 1 - distance / 100;
      break;
    case 'fade':
      break;
  }

  return {
    // La regla CSS de `prefers-reduced-motion` usa este atributo para mostrar
    // el contenido sin animación, incluso antes de que React hidrate.
    'data-reveal': '',
    initial: from,
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: true, margin: '-40px' },
    transition: {
      duration: reduceMotion ? 0 : REVEAL_DURATION,
      delay: reduceMotion ? 0 : delay,
      ease: REVEAL_EASE,
    },
  } as MotionProps;
}
