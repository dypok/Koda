'use client';

import { BG_PROPOSALS, BgKey } from './bg-lab/ascii-engines';

export interface RouteProposal {
  id: string;
  num: number;
  label: string;
  blurb: string;
  bg?: BgKey;
}

export const ROUTE_PROPOSALS: RouteProposal[] = [
  {
    id: 'r0-actual',
    num: 0,
    label: 'Actual mínima',
    blurb: 'La lista metro actual como referencia: filas compactas, un acento, sin cromo.',
  },
  {
    id: 'r1-constellation',
    num: 1,
    label: 'Constelación',
    blurb: 'El dataset Lua en el grafo Pixi del roadmap: nodos, curvas, retícula y cámara.',
  },
  {
    id: 'r2-pipeline',
    num: 2,
    label: 'Pipeline git',
    blurb: 'Módulos como commits secuenciales con hashes, consola en vivo y replay.',
  },
  {
    id: 'r3-deck',
    num: 3,
    label: 'Deck táctico',
    blurb: 'Tarjetas HUD con brackets de mira, pills de estado y carriles por ruta.',
  },
  {
    id: 'r4-edge-flow',
    num: 4,
    label: 'Bordes: flujo',
    blurb: 'Hormigas marchando sobre las conexiones: la energía corre hacia el siguiente nodo.',
  },
  {
    id: 'r5-edge-packets',
    num: 5,
    label: 'Bordes: paquetes',
    blurb: 'Paquetes de datos discretos viajando por la curva, como tráfico de red.',
  },
  {
    id: 'r6-edge-pulse',
    num: 6,
    label: 'Bordes: pulso',
    blurb: 'Cometa luminoso con estela recorriendo cada conexión desbloqueada.',
  },
  {
    id: 'r7-node-hex',
    num: 7,
    label: 'Círculos: hexágono',
    blurb: 'Placas hexagonales tácticas con icono teñido y arco de progreso.',
  },
  {
    id: 'r8-node-donut',
    num: 8,
    label: 'Círculos: dona',
    blurb: 'Anillo grueso de progreso como protagonista y núcleo mínimo.',
  },
  {
    id: 'r9-line-twin',
    num: 9,
    label: 'Líneas: haz doble',
    blurb: 'Doble trazo paralelo con el pulso corriendo por el centro.',
  },
  {
    id: 'r10-line-morse',
    num: 10,
    label: 'Líneas: morse',
    blurb: 'Punteado largo-corto estilo morse marchando hacia el siguiente nodo.',
  },
  {
    id: 'r11-unlock-shock',
    num: 11,
    label: 'Desbloqueo: onda',
    blurb: 'Onda expansiva triple + destello al liberar un círculo.',
  },
  {
    id: 'r12-unlock-ignite',
    num: 12,
    label: 'Desbloqueo: ignición',
    blurb: 'Barrido radial que enciende el círculo + pop final.',
  },
  {
    id: 'r13-chrome-slim',
    num: 13,
    label: 'Cromo: slim',
    blurb: 'Barras delgadas arriba y abajo: título, continuar, racha, XP y progreso.',
  },
  {
    id: 'r14-chrome-pills',
    num: 14,
    label: 'Cromo: píldoras',
    blurb: 'Sin barras: píldoras flotantes con título, métricas y dots navegables.',
  },
  {
    id: 'r15-chrome-terminal',
    num: 15,
    label: 'Cromo: terminal',
    blurb: 'Statusline vim: modo, rama, segmentos por módulo y métricas en una línea.',
  },
  ...BG_PROPOSALS.map((b) => ({
    id: `r${b.num}-bg-${b.key}`,
    num: b.num,
    label: `Fondo: ${b.label}`,
    blurb: b.blurb,
    bg: b.key,
  })),
];
