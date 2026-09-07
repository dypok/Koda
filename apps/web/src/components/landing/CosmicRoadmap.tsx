'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconCode,
  IconNetwork,
  IconAtom2,
  IconGitBranch,
  IconLock,
  IconRecycle,
  IconPackage,
  IconSkull,
  IconShieldCheck,
  IconPlus,
  IconMinus,
  IconRotate,
  IconInfoCircle,
} from '@tabler/icons-react';

interface NodeData {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'unlocked' | 'locked' | 'boss' | 'bonus';
  x: number;
  y: number;
  r: number;
  stars?: number;
  xp: string;
  sectorTag?: string;
  cipher?: string;
  badge?: string;
  description: string;
  category: string;
}

const NODES: NodeData[] = [
  {
    id: 'node-01',
    number: '01',
    title: 'SYNTAX GENESIS',
    subtitle: 'MASTERED · +200 XP',
    status: 'completed',
    x: 120,
    y: 380,
    r: 25,
    stars: 3,
    xp: '+200 XP',
    category: 'completed',
    description: 'Variables primitivas, tipos de datos inmutables y operadores aritméticos fundamentales.',
  },
  {
    id: 'node-02',
    number: '02',
    title: 'SCOPE MATRIX',
    subtitle: 'MASTERED · +250 XP',
    status: 'completed',
    x: 235,
    y: 260,
    r: 25,
    stars: 3,
    xp: '+250 XP',
    category: 'completed',
    description: 'Ámbitos léxicos, variables locales vs globales y ciclo de vida en memoria.',
  },
  {
    id: 'node-03',
    number: '03',
    title: 'CLOSURE CORE',
    subtitle: 'MASTERED · +300 XP',
    status: 'completed',
    x: 355,
    y: 430,
    r: 25,
    stars: 3,
    xp: '+300 XP',
    category: 'completed',
    description: 'Funciones de primer orden, capturas de entorno y funciones puras de transformación.',
  },
  {
    id: 'node-04',
    number: '04',
    title: 'CONTROL FLOW',
    subtitle: 'IN PROGRESS · +250 XP',
    status: 'active',
    x: 500,
    y: 350,
    r: 32,
    badge: 'ACTIVE · STEP 3/4',
    xp: '+250 XP',
    category: 'active',
    description: 'Condicionales de guardia, bucles deterministas y bifurcación de flujos de ejecución en tiempo real.',
  },
  {
    id: 'node-05a',
    number: '05A',
    title: 'METATABLES',
    subtitle: 'SEALED · REQ LVL 4',
    status: 'locked',
    x: 680,
    y: 170,
    r: 26,
    sectorTag: 'SECTOR γ · OOP & METATABLES',
    cipher: 'CIPHER: 0x5F_LOCK',
    xp: 'LOCKED',
    category: 'locked',
    description: 'Sobrecarga de operadores, prototipos de herencia y metatablas de tipado avanzado.',
  },
  {
    id: 'node-05b',
    number: '05B',
    title: 'MEMORY & GC',
    subtitle: 'AVAILABLE · +350 XP',
    status: 'unlocked',
    x: 680,
    y: 470,
    r: 26,
    xp: '+350 XP',
    category: 'unlocked',
    description: 'Gestión manual y automática de recursos, conteo de referencias y optimización del garbage collector.',
  },
  {
    id: 'node-bonus',
    number: '★',
    title: 'BONUS LOOT CHEST',
    subtitle: '+150 XP & CYBER THEME',
    status: 'bonus',
    x: 680,
    y: 575,
    r: 22,
    xp: '+150 XP',
    category: 'bonus',
    description: 'Recompensa especial desbloqueable: Paleta visual Cyberpunk para tu editor y badge exclusivo.',
  },
  {
    id: 'node-boss',
    number: 'Ω',
    title: 'APEX BOSS GATE',
    subtitle: 'FINAL TRIAL · 3 PHASES',
    status: 'boss',
    x: 875,
    y: 310,
    r: 34,
    xp: '+1000 XP',
    category: 'boss',
    description: 'Proyecto culminante en vivo: Desarrolla un micro-motor evaluador con pruebas de estrés automatizadas.',
  },
];

const LEGEND_ITEMS = [
  { key: 'completed', label: 'Completed (3)', color: 'bg-sky-400 border-sky-400/50 text-sky-300' },
  { key: 'active', label: 'Active Nexus (1)', color: 'bg-orange-500 border-orange-400/50 text-orange-300' },
  { key: 'unlocked', label: 'Unlocked Challenge (1)', color: 'bg-emerald-400 border-emerald-400/50 text-emerald-300' },
  { key: 'locked', label: 'Locked Seal (1)', color: 'bg-purple-400 border-purple-400/50 text-purple-300' },
  { key: 'boss', label: 'Apex Gate (1)', color: 'bg-red-500 border-red-400/50 text-red-300' },
];

export const CosmicRoadmap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(NODES[3]); // Default activo
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(130, Math.max(80, prev + delta)));
  };

  const resetZoom = () => setZoomLevel(100);

  return (
    <div className="w-full relative rounded-2xl border border-slate-800/80 bg-[#060814]/95 backdrop-blur-xl shadow-2xl overflow-hidden select-none">
      {/* =========================================================
          AMBIENTE DE NEBULOSA Y ESTRELLAS CÓSMICAS
          ========================================================= */}
      {/* Resplandor Nexus Central (Naranja Koda) */}
      <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[380px] h-[380px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* Resplandor Rama Superior (Púrpura) */}
      <div className="absolute top-[25%] left-[68%] -translate-x-[50%] -translate-y-[50%] w-[260px] h-[260px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      {/* Resplandor Rama Inferior (Esmeralda) */}
      <div className="absolute top-[75%] left-[68%] -translate-x-[50%] -translate-y-[50%] w-[260px] h-[260px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* Resplandor Apex Boss (Rojo) */}
      <div className="absolute top-[50%] left-[88%] -translate-x-[50%] -translate-y-[50%] w-[280px] h-[280px] bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      {/* Resplandor Inicio (Cian) */}
      <div className="absolute top-[50%] left-[18%] -translate-x-[50%] -translate-y-[50%] w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================
          CABECERA HUD TÁCTICA SUPERIOR
          ========================================================= */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-slate-800/60 bg-slate-950/40">
        {/* Sector Badge Izquierda */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-sky-500/30 bg-sky-950/30 text-sky-400 text-xs font-mono tracking-wider font-semibold shadow-[0_0_12px_rgba(14,165,233,0.15)]">
          <IconShieldCheck className="w-4 h-4 text-sky-400" />
          <span>SECTOR ALPHA: CORE FUNDAMENTALS [3/3 MASTERED]</span>
        </div>

        {/* Controles de Zoom y Acción Derecha */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/70 p-0.5 text-slate-400">
            <button
              onClick={() => handleZoom(10)}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Acercar"
            >
              <IconPlus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-semibold text-slate-300 select-none">{zoomLevel}%</span>
            <button
              onClick={() => handleZoom(-10)}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Alejar"
            >
              <IconMinus className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 100 && (
              <button
                onClick={resetZoom}
                className="p-1.5 hover:text-orange-400 hover:bg-slate-800 rounded transition-colors border-l border-slate-800"
                title="Reiniciar Zoom"
              >
                <IconRotate className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-300 font-semibold tracking-wider hover:bg-orange-500/20 transition-all cursor-default">
            <IconGitBranch className="w-3.5 h-3.5 text-orange-400" />
            <span>BRANCH TRACKS</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          CONTENEDOR DE CANVAS PANORÁMICO SVG
          ========================================================= */}
      <div className="relative w-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-800">
        <div
          className="relative min-w-[960px] mx-auto transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <svg
            viewBox="0 0 1000 640"
            className="w-full h-auto block drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Filtro de brillo de neón */}
              <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Filtro de halo activo intenso */}
              <filter id="nexus-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="12" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Filtro Boss Gate rojo intenso */}
              <filter id="boss-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="14" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Gradientes Lineales de Conexión de Energía */}
              <linearGradient id="grad-cyan-to-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>

              <linearGradient id="grad-cyan-to-orange" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="65%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>

              <linearGradient id="grad-orange-to-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>

              <linearGradient id="grad-orange-to-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="45%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              <linearGradient id="grad-purple-to-red" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="60%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>

              <linearGradient id="grad-emerald-to-red" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="60%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Cuadrícula táctica sutil de puntos de fondo */}
            <g opacity="0.18">
              {[...Array(16)].map((_, i) =>
                [...Array(10)].map((_, j) => (
                  <circle
                    key={`grid-${i}-${j}`}
                    cx={60 + i * 60}
                    cy={50 + j * 60}
                    r="1"
                    fill="#94a3b8"
                  />
                ))
              )}
            </g>

            {/* Cruces HUD tácticas */}
            <g opacity="0.25" stroke="#64748b" strokeWidth="1">
              <path d="M 160 140 L 170 140 M 165 135 L 165 145" />
              <path d="M 400 120 L 410 120 M 405 115 L 405 125" />
              <path d="M 330 550 L 340 550 M 335 545 L 335 555" />
              <path d="M 830 150 L 840 150 M 835 145 L 835 155" />
              <path d="M 910 520 L 920 520 M 915 515 L 915 525" />
            </g>

            {/* =========================================================
                LÍNEAS CURVAS BEZIER DE CONEXIÓN Y FLUJO DE ENERGÍA
                ========================================================= */}
            {/* Trazo 1: Node 01 -> Node 02 */}
            <path
              d="M 120 380 C 170 380, 185 260, 235 260"
              fill="none"
              stroke="url(#grad-cyan-to-cyan)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#neon-glow)"
              opacity="0.8"
            />

            {/* Trazo 2: Node 02 -> Node 03 */}
            <path
              d="M 235 260 C 285 260, 305 430, 355 430"
              fill="none"
              stroke="url(#grad-cyan-to-cyan)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#neon-glow)"
              opacity="0.8"
            />

            {/* Trazo 3: Node 03 -> Node 04 (Nexus Activo) */}
            <path
              d="M 355 430 C 405 430, 440 350, 500 350"
              fill="none"
              stroke="url(#grad-cyan-to-orange)"
              strokeWidth="4.5"
              strokeLinecap="round"
              filter="url(#neon-glow)"
            />
            {/* Flujo de partículas animado 03 -> 04 */}
            <path
              d="M 355 430 C 405 430, 440 350, 500 350"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="6 14"
              className="animate-pulse"
              opacity="0.9"
            />

            {/* Trazo 4A (Rama Superior Púrpura): Node 04 -> Node 05A */}
            <path
              d="M 500 350 C 570 350, 610 170, 680 170"
              fill="none"
              stroke="url(#grad-orange-to-purple)"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* Trazo 4B (Rama Inferior Esmeralda): Node 04 -> Node 05B */}
            <path
              d="M 500 350 C 570 350, 610 470, 680 470"
              fill="none"
              stroke="url(#grad-orange-to-emerald)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#neon-glow)"
              opacity="0.85"
            />
            {/* Flujo de datos animado hacia 05B */}
            <path
              d="M 500 350 C 570 350, 610 470, 680 470"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
              strokeDasharray="4 12"
              className="animate-pulse"
              opacity="0.9"
            />

            {/* Trazo 5: Node 05B -> Bonus Loot Chest (Vertical) */}
            <line
              x1="680"
              y1="496"
              x2="680"
              y2="553"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="3 4"
              opacity="0.8"
            />

            {/* Trazo 6A: Node 05A -> Apex Boss Gate */}
            <path
              d="M 680 170 C 760 170, 790 310, 875 310"
              fill="none"
              stroke="url(#grad-purple-to-red)"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Trazo 6B: Node 05B -> Apex Boss Gate */}
            <path
              d="M 680 470 C 760 470, 790 310, 875 310"
              fill="none"
              stroke="url(#grad-emerald-to-red)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#neon-glow)"
              opacity="0.85"
            />

            {/* =========================================================
                RADAR Y ANILLOS CONCÉNTRICOS DEL NODO ACTIVO (04)
                ========================================================= */}
            <g>
              {/* Anillo exterior 3 */}
              <circle
                cx="500"
                cy="350"
                r="115"
                fill="none"
                stroke="#f97316"
                strokeWidth="1"
                strokeDasharray="3 6"
                opacity="0.2"
              />
              {/* Anillo medio 2 */}
              <circle
                cx="500"
                cy="350"
                r="80"
                fill="none"
                stroke="#f97316"
                strokeWidth="1.2"
                opacity="0.35"
              />
              {/* Anillo interior 1 */}
              <circle
                cx="500"
                cy="350"
                r="55"
                fill="none"
                stroke="#f97316"
                strokeWidth="1.5"
                opacity="0.5"
              />
              {/* Onda expansiva animada con ping */}
              <circle
                cx="500"
                cy="350"
                r="70"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1"
                className="animate-ping origin-center"
                style={{ transformOrigin: '500px 350px' }}
                opacity="0.25"
              />
            </g>

            {/* =========================================================
                METADATOS SUPERIORES EN RAMAS
                ========================================================= */}
            {/* Metadata Node 05A (Sector Gamma) */}
            <g className="font-mono">
              <text
                x="680"
                y="118"
                fill="#c084fc"
                fontSize="10"
                fontWeight="600"
                letterSpacing="1.2"
                textAnchor="middle"
                opacity="0.85"
              >
                SECTOR γ · OOP &amp; METATABLES
              </text>
              <text
                x="680"
                y="132"
                fill="#a855f7"
                fontSize="9"
                letterSpacing="1.5"
                textAnchor="middle"
                opacity="0.6"
              >
                CIPHER: 0x5F_LOCK
              </text>
            </g>

            {/* Badge de estado flotante sobre Node 04 */}
            <g className="font-mono">
              <rect
                x="430"
                y="266"
                width="140"
                height="22"
                rx="11"
                fill="#431407"
                stroke="#f97316"
                strokeWidth="1.2"
              />
              <circle cx="445" cy="277" r="3.5" fill="#f97316" className="animate-pulse" />
              <text
                x="505"
                y="281"
                fill="#fdba74"
                fontSize="10"
                fontWeight="700"
                letterSpacing="1.5"
                textAnchor="middle"
              >
                ACTIVE · STEP 3/4
              </text>
            </g>

            {/* =========================================================
                RENDERIZADO DE LOS NODOS (CIRCULOS E ICONOS)
                ========================================================= */}
            {NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isFilteredOut = filterCategory && node.category !== filterCategory;

              return (
                <g
                  key={node.id}
                  className={`cursor-pointer transition-opacity duration-300 ${
                    isFilteredOut ? 'opacity-30' : 'opacity-100'
                  }`}
                  onClick={() => setSelectedNode(node)}
                >
                  {/* Círculo Base / Halo */}
                  {node.status === 'boss' && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r + 10}
                      fill="#ef4444"
                      opacity="0.25"
                      filter="url(#boss-glow)"
                    />
                  )}

                  {node.status === 'active' && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r + 8}
                      fill="#f97316"
                      opacity="0.3"
                      filter="url(#nexus-glow)"
                    />
                  )}

                  {node.status === 'completed' && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r + 4}
                      fill="#0284c7"
                      opacity="0.25"
                      filter="url(#neon-glow)"
                    />
                  )}

                  {/* Cuerpo del Nodo */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r}
                    fill={
                      node.status === 'completed'
                        ? '#041329'
                        : node.status === 'active'
                        ? '#2a0e05'
                        : node.status === 'unlocked'
                        ? '#031f17'
                        : node.status === 'locked'
                        ? '#170929'
                        : node.status === 'bonus'
                        ? '#221502'
                        : '#2c060d'
                    }
                    stroke={
                      node.status === 'completed'
                        ? '#38bdf8'
                        : node.status === 'active'
                        ? '#f97316'
                        : node.status === 'unlocked'
                        ? '#34d399'
                        : node.status === 'locked'
                        ? '#a855f7'
                        : node.status === 'bonus'
                        ? '#f59e0b'
                        : '#ef4444'
                    }
                    strokeWidth={
                      isSelected
                        ? 3.5
                        : node.status === 'active' || node.status === 'boss'
                        ? 2.8
                        : 2
                    }
                    className="transition-all duration-200 hover:scale-105"
                  />

                  {/* Anillo de selección activa */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r + 5}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      className="animate-spin"
                      style={{
                        transformOrigin: `${node.x}px ${node.y}px`,
                        animationDuration: '8s',
                      }}
                    />
                  )}

                  {/* Icono Interno embebido en foreignObject para SVG */}
                  <foreignObject
                    x={node.x - 13}
                    y={node.y - 13}
                    width={26}
                    height={26}
                    className="pointer-events-none"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {node.id === 'node-01' && (
                        <IconCode className="w-4 h-4 text-sky-300" strokeWidth={2.5} />
                      )}
                      {node.id === 'node-02' && (
                        <IconNetwork className="w-4 h-4 text-sky-300" strokeWidth={2.5} />
                      )}
                      {node.id === 'node-03' && (
                        <IconAtom2 className="w-4 h-4 text-sky-300" strokeWidth={2.5} />
                      )}
                      {node.id === 'node-04' && (
                        <IconGitBranch className="w-5 h-5 text-orange-300" strokeWidth={2.5} />
                      )}
                      {node.id === 'node-05a' && (
                        <IconLock className="w-4 h-4 text-purple-300" strokeWidth={2.2} />
                      )}
                      {node.id === 'node-05b' && (
                        <IconRecycle className="w-4 h-4 text-emerald-300" strokeWidth={2.2} />
                      )}
                      {node.id === 'node-bonus' && (
                        <IconPackage className="w-4 h-4 text-amber-300" strokeWidth={2.2} />
                      )}
                      {node.id === 'node-boss' && (
                        <IconSkull className="w-5 h-5 text-red-200" strokeWidth={2.2} />
                      )}
                    </div>
                  </foreignObject>

                  {/* =========================================================
                      TEXTOS Y ETIQUETAS DEBAJO DE CADA NODO
                      ========================================================= */}
                  {/* Estrellas doradas (para 01, 02, 03) */}
                  {node.stars && (
                    <g className="pointer-events-none">
                      <text
                        x={node.x}
                        y={node.y + node.r + 14}
                        fill="#fbbf24"
                        fontSize="9"
                        textAnchor="middle"
                        letterSpacing="2"
                      >
                        ★★★
                      </text>
                    </g>
                  )}

                  {/* Título Principal */}
                  <text
                    x={node.x}
                    y={node.y + node.r + (node.stars ? 26 : 18)}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="inherit"
                    letterSpacing="0.8"
                    textAnchor="middle"
                    className="select-none"
                  >
                    {node.title}
                  </text>

                  {/* Subtítulo / XP */}
                  <text
                    x={node.x}
                    y={node.y + node.r + (node.stars ? 38 : 30)}
                    fill={
                      node.status === 'completed'
                        ? '#38bdf8'
                        : node.status === 'active'
                        ? '#fbbf24'
                        : node.status === 'unlocked'
                        ? '#34d399'
                        : node.status === 'locked'
                        ? '#a855f7'
                        : node.status === 'bonus'
                        ? '#f59e0b'
                        : '#f87171'
                    }
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="600"
                    letterSpacing="0.6"
                    textAnchor="middle"
                    className="select-none"
                  >
                    {node.subtitle}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* =========================================================
          PANEL DE DETALLES DEL NODO SELECCIONADO (HOVER/CLICK)
          ========================================================= */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="border-t border-slate-800/80 bg-slate-950/90 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                  selectedNode.status === 'completed'
                    ? 'border-sky-500/40 bg-sky-950/40 text-sky-400'
                    : selectedNode.status === 'active'
                    ? 'border-orange-500/40 bg-orange-950/40 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.25)]'
                    : selectedNode.status === 'unlocked'
                    ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400'
                    : selectedNode.status === 'locked'
                    ? 'border-purple-500/40 bg-purple-950/40 text-purple-400'
                    : selectedNode.status === 'bonus'
                    ? 'border-amber-500/40 bg-amber-950/40 text-amber-400'
                    : 'border-red-500/40 bg-red-950/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                }`}
              >
                <IconInfoCircle className="w-5 h-5" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-bold text-white tracking-wide">
                    {selectedNode.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      selectedNode.status === 'completed'
                        ? 'bg-sky-500/20 text-sky-300'
                        : selectedNode.status === 'active'
                        ? 'bg-orange-500/20 text-orange-300'
                        : selectedNode.status === 'unlocked'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : selectedNode.status === 'locked'
                        ? 'bg-purple-500/20 text-purple-300'
                        : selectedNode.status === 'bonus'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {selectedNode.xp}
                  </span>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                Haz clic en cualquier nodo para inspeccionar
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          BARRA INFERIOR DE LEYENDA TÁCTICA
          ========================================================= */}
      <div className="px-6 py-3.5 border-t border-slate-900 bg-[#04060e] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          {LEGEND_ITEMS.map((item) => {
            const isActive = filterCategory === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setFilterCategory(isActive ? null : item.key)}
                className={`flex items-center gap-2 px-2 py-1 rounded transition-all ${
                  isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${item.color.split(' ')[0]}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {filterCategory && (
          <button
            onClick={() => setFilterCategory(null)}
            className="text-[11px] text-orange-400 hover:text-orange-300 transition-colors"
          >
            Limpiar filtro
          </button>
        )}
      </div>
    </div>
  );
};

export default CosmicRoadmap;
