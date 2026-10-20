'use client';

import { useEffect } from 'react';
import { getLenisInstance } from '@/lib/scroll';

const CHAPTERS = [
  'inicio',
  'vista-previa',
  'metodologia',
  'testimonios',
  'mapa',
  'planes',
  'certificado',
  'finale',
];

const OFFSET = -80;
const DURATION = 1.25;
const COOLDOWN = 1400;
const EDGE = 120;

/**
 * Snap por capítulos: una rueda = una sección (ida y vuelta).
 * Las secciones altas (metodología) se leen con scroll nativo hasta
 * llegar a su borde; ahí el siguiente tick salta al capítulo siguiente.
 * Solo mouse con movimiento fino; táctil, teclado y reduced-motion intactos.
 */
export const SectionSnap: React.FC = () => {
  // Desactivado el secuestro forzado de rueda (wheel preventDefault) para permitir
  // scroll fluido con Lenis a través de las tarjetas sticky de metodología, el cierre y el footer.
  return null;
};

export default SectionSnap;
