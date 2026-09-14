'use client';

export type IconBox = 'code' | 'float' | 'hidden';
export type Prefix = 'prompt' | 'dollar' | 'index' | 'none';
export type Motion = 'none' | 'gsap';

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
const BADGE_PILL_OK =
  'whitespace-nowrap shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border tracking-wide text-emerald-300 bg-emerald-500/15 border-emerald-500/40';
const BADGE_PILL_SOON =
  'whitespace-nowrap shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border tracking-wide text-slate-400 bg-slate-800/70 border-slate-700/50';

export const VARIANTS: VariantDef[] = [
  {
    id: 'dense-rows',
    num: 1,
    label: 'Filas densas',
    blurb: 'Lista vertical sin cards: borde superior por item y lateral ámbar en selección.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left transition-colors',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-slate-800/60 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'code',
      prefix: 'prompt',
      motion: 'none',
      chrome: false,
      grouped: false,
      metaTable: false,
      installLine: false,
      logLocked: false,
      radio: false,
    },
  },
  {
    id: 'single-window',
    num: 2,
    label: 'Ventana única',
    blurb: 'El grid vive dentro de una ventana koda --select-stack; celdas planas sin glare.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left transition-colors',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-slate-800/60 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'code',
      prefix: 'dollar',
      motion: 'none',
      chrome: true,
      grouped: false,
      metaTable: false,
      installLine: false,
      logLocked: false,
      radio: false,
    },
  },
  {
    id: 'radio-real',
    num: 3,
    label: 'Radio nativo',
    blurb: 'Mismo visual terminal pero con radiogroup nativo: flechas, roving tabindex y aria-checked.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left transition-colors focus-visible:ring-2 focus-visible:ring-amber-400/70 outline-none',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-slate-800/60 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'code',
      prefix: 'prompt',
      motion: 'none',
      chrome: false,
      grouped: false,
      metaTable: false,
      installLine: false,
      logLocked: false,
      radio: true,
    },
  },
  {
    id: 'mono-badges',
    num: 4,
    label: 'Badges mono',
    blurb: 'Solo cambian los badges: de pill redondeada a etiqueta mono cuadrada con borde lateral.',
    tokens: {
      card: 'flex items-start gap-4 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 text-left',
      cardSelected: 'border-amber-500 bg-amber-500/10',
      cardLocked: 'border-slate-800/40 bg-slate-900/30 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'float',
      prefix: 'none',
      motion: 'none',
      chrome: false,
      grouped: false,
      metaTable: false,
      installLine: false,
      logLocked: false,
      radio: false,
    },
  },
  {
    id: 'code-icon',
    num: 5,
    label: 'Icono en bloque',
    blurb: 'Icono dentro de celda de código negra; fuera el flotante con scale-110.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left transition-colors',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-slate-800/60 cursor-not-allowed',
      badgeAvailable: BADGE_PILL_OK,
      badgeLocked: BADGE_PILL_SOON,
      iconBox: 'code',
      prefix: 'none',
      motion: 'none',
      chrome: false,
      grouped: false,
      metaTable: false,
      installLine: false,
      logLocked: false,
      radio: false,
    },
  },
  {
    id: 'prompt-selected',
    num: 6,
    label: 'Prompt select',
    blurb: 'Seleccionado = prompt: prefijo > y línea $ install <id>; fuera ring + glow.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left transition-colors',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-slate-800/60 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'code',
      prefix: 'prompt',
      motion: 'none',
      chrome: false,
      grouped: false,
      metaTable: false,
      installLine: true,
      logLocked: false,
      radio: false,
    },
  },
  {
    id: 'log-locked',
    num: 7,
    label: 'Bloqueados log',
    blurb: 'Próximamente como línea de log // id — queued con candado, sin opacity gris.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left transition-colors',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-dashed border-slate-800 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'code',
      prefix: 'prompt',
      motion: 'none',
      chrome: false,
      grouped: false,
      metaTable: false,
      installLine: false,
      logLocked: true,
      radio: false,
    },
  },
  {
    id: 'gsap-stagger',
    num: 8,
    label: 'GSAP stagger',
    blurb: 'Una timeline de entrada y:14 + stagger 0.04 en vez de 20 animaciones motion.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left will-change-transform',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-slate-800/60 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'code',
      prefix: 'prompt',
      motion: 'gsap',
      chrome: false,
      grouped: false,
      metaTable: false,
      installLine: false,
      logLocked: false,
      radio: false,
    },
  },
  {
    id: 'scan-hover',
    num: 9,
    label: 'Hover scanline',
    blurb: 'Fuera GlareHover: hover = borde claro + translate-x 2px, solo CSS.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left transition-[border-color,transform] duration-150 hover:border-slate-500 hover:translate-x-[2px]',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-slate-800/60 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'code',
      prefix: 'dollar',
      motion: 'none',
      chrome: false,
      grouped: false,
      metaTable: false,
      installLine: false,
      logLocked: false,
      radio: false,
    },
  },
  {
    id: 'meta-table',
    num: 10,
    label: 'Meta tabla',
    blurb: 'Nombre y estado como tabla con líderes punteados en vez de wrap libre.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left transition-colors',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-slate-800/60 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'hidden',
      prefix: 'index',
      motion: 'none',
      chrome: false,
      grouped: false,
      metaTable: true,
      installLine: false,
      logLocked: false,
      radio: false,
    },
  },
  {
    id: 'terminal-first',
    num: 11,
    label: 'Terminal first',
    blurb: 'Banner de vista terminal por defecto + filas mono; el grid pasa a secundario.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-2.5 rounded-[6px] border border-slate-800 bg-black text-left font-mono transition-colors',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-slate-800/60 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'hidden',
      prefix: 'dollar',
      motion: 'none',
      chrome: true,
      grouped: false,
      metaTable: false,
      installLine: false,
      logLocked: true,
      radio: false,
      note: '$ koda --select-stack --view terminal  # el grid queda como vista secundaria',
    },
  },
  {
    id: 'track-index',
    num: 12,
    label: 'Índice tracks',
    blurb: 'Cabeceras estilo ls por categoría: lenguajes/ frameworks/ devops/ con contador.',
    tokens: {
      card: 'flex items-center gap-3 px-3.5 py-3 rounded-[8px] border border-slate-800 bg-slate-950 text-left transition-colors',
      cardSelected: 'border-amber-400/60 border-l-2 border-l-amber-400 bg-amber-400/[0.07]',
      cardLocked: 'border-slate-800/60 cursor-not-allowed',
      badgeAvailable: BADGE_MONO_OK,
      badgeLocked: BADGE_MONO_SOON,
      iconBox: 'code',
      prefix: 'index',
      motion: 'none',
      chrome: false,
      grouped: true,
      metaTable: false,
      installLine: false,
      logLocked: false,
      radio: false,
    },
  },
];
