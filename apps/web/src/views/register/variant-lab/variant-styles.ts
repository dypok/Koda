'use client';

export type IconBox = 'code' | 'float' | 'hidden';
export type Prefix = 'prompt' | 'dollar' | 'index' | 'none';
export type Motion = 'none' | 'gsap';
export type FlowFill = 'amber' | 'emerald' | 'slate' | 'cursor';
export type FlowFrom = 'center' | 'left' | 'right';
export type FlowRadius = 'morph12' | 'morph6' | 'pill';
export type FlowArrows = 'slide' | 'fade' | 'vertical' | 'none';
export type FlowText = 'shift' | 'scramble' | 'static';

export interface VariantTokens {
  card: string;
  cardSelected: string;
  cardLocked: string;
  badgeAvailable: string;
  badgeLocked: string;
  iconBox: IconBox;
  prefix: Prefix;
  motion: Motion;
  chrome: boolean;
  grouped: boolean;
  metaTable: boolean;
  installLine: boolean;
  logLocked: boolean;
  radio: boolean;
  note?: string;
  flow: boolean;
  flowFill: FlowFill;
  flowFrom: FlowFrom;
  flowRadius: FlowRadius;
  flowArrows: FlowArrows;
  flowText: FlowText;
  flowStagger: boolean;
  flowRings: boolean;
  flowSuccess: boolean;
  flowShake: boolean;
}

export interface VariantDef {
  id: string;
  num: number;
  label: string;
  blurb: string;
  tokens: VariantTokens;
}

const BADGE_BASE =
  'whitespace-nowrap shrink-0 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest';

const BADGE_MONO_OK =
  `${BADGE_BASE} rounded-[6px] border border-emerald-500/40 border-l-2 border-l-emerald-400 bg-emerald-500/10 text-emerald-300`;
const BADGE_MONO_SOON =
  `${BADGE_BASE} rounded-[6px] border border-slate-700/60 border-l-2 border-l-slate-600 bg-slate-900 text-slate-400`;

const FLOW_BASE = {
  card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left transition-colors',
  cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
  cardLocked: 'border-slate-800/60 cursor-not-allowed',
  badgeAvailable: BADGE_MONO_OK,
  badgeLocked: BADGE_MONO_SOON,
  iconBox: 'code' as IconBox,
  prefix: 'prompt' as Prefix,
  motion: 'none' as Motion,
  chrome: false,
  grouped: false,
  metaTable: false,
  installLine: false,
  logLocked: false,
  radio: false,
  flow: true,
  flowFill: 'amber' as FlowFill,
  flowFrom: 'center' as FlowFrom,
  flowRadius: 'morph12' as FlowRadius,
  flowArrows: 'slide' as FlowArrows,
  flowText: 'shift' as FlowText,
  flowStagger: false,
  flowRings: false,
  flowSuccess: false,
  flowShake: false,
};

export const VARIANTS: VariantDef[] = [
  {
    id: 'dense-rows',
    num: 1,
    label: 'Flow base',
    blurb: 'Adaptación directa de FlowButton a oscuro terminal: flechas deslizantes + círculo ámbar + morph a 12px.',
    tokens: { ...FLOW_BASE, motion: 'gsap' as Motion },
  },
  {
    id: 'single-window',
    num: 2,
    label: 'Flow ventana',
    blurb: 'Flow base dentro de ventana koda --select-stack; el círculo nace a la izquierda.',
    tokens: { ...FLOW_BASE, chrome: true, flowFrom: 'left' as FlowFrom },
  },
  {
    id: 'radio-real',
    num: 3,
    label: 'Flow + radio',
    blurb: 'Flow base con radiogroup nativo: flechas del teclado, roving tabindex y aria-checked.',
    tokens: { ...FLOW_BASE, radio: true },
  },
  {
    id: 'mono-badges',
    num: 4,
    label: 'Flow derecha',
    blurb: 'El círculo nace a la derecha y las flechas aparecen por fade en vez de slide.',
    tokens: { ...FLOW_BASE, flowFrom: 'right' as FlowFrom, flowArrows: 'fade' as FlowArrows },
  },
  {
    id: 'code-icon',
    num: 5,
    label: 'Flow esmeralda',
    blurb: 'Relleno esmeralda para disponibles; bloqueadas en pizarra sin relleno.',
    tokens: { ...FLOW_BASE, flowFill: 'emerald' as FlowFill },
  },
  {
    id: 'prompt-selected',
    num: 6,
    label: 'Flow vertical',
    blurb: 'Flechas que entran por arriba/abajo y morph agresivo a 6px terminal.',
    tokens: { ...FLOW_BASE, flowRadius: 'morph6' as FlowRadius, flowArrows: 'vertical' as FlowArrows },
  },
  {
    id: 'log-locked',
    num: 7,
    label: 'Flow staged',
    blurb: 'Coreografía por etapas: flecha primero, círculo después y anillo exterior al final.',
    tokens: { ...FLOW_BASE, flowStagger: true, flowRings: true },
  },
  {
    id: 'gsap-stagger',
    num: 8,
    label: 'Flow scramble',
    blurb: 'El nombre se descramblea al hover + entrada GSAP en stagger del grid.',
    tokens: { ...FLOW_BASE, motion: 'gsap' as Motion, flowArrows: 'fade' as FlowArrows, flowText: 'scramble' as FlowText },
  },
  {
    id: 'scan-hover',
    num: 9,
    label: 'Flow cursor',
    blurb: 'El círculo nace donde está el cursor (CSS vars --fx/--fy).',
    tokens: { ...FLOW_BASE, flowFill: 'cursor' as FlowFill },
  },
  {
    id: 'meta-table',
    num: 10,
    label: 'Flow square',
    blurb: 'Morph a 6px cuadrado, timing rápido 300ms y texto estático sin shift.',
    tokens: { ...FLOW_BASE, flowRadius: 'morph6' as FlowRadius, flowText: 'static' as FlowText },
  },
  {
    id: 'terminal-first',
    num: 11,
    label: 'Flow shake',
    blurb: 'Bloqueadas con shake al hover y pill permanente; disponibles con relleno pizarra fantasma.',
    tokens: {
      ...FLOW_BASE,
      flowFill: 'slate' as FlowFill,
      flowRadius: 'pill' as FlowRadius,
      flowArrows: 'none' as FlowArrows,
      flowText: 'static' as FlowText,
      flowShake: true,
      chrome: true,
      note: '$ koda --select-stack --motion flow  # bloqueadas tiemblan, no se rellenan',
    },
  },
  {
    id: 'track-index',
    num: 12,
    label: 'Flow success',
    blurb: 'Seleccionada queda persistentemente rellena con check; índice por tracks.',
    tokens: { ...FLOW_BASE, flowSuccess: true, grouped: true, prefix: 'index' as Prefix },
  },
];
