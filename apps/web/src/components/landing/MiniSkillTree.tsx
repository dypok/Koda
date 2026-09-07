'use client';

import React, { useState } from 'react';
import {
  IconLock,
  IconCpu,
  IconSkull,
  IconGift,
  IconBracketsContain,
  IconBinaryTree,
  IconAtom2,
  IconRoute,
} from '@tabler/icons-react';

interface NodeData {
  id: string;
  number: string;
  name: string;
  status: 'completed' | 'active' | 'unlocked' | 'locked' | 'bonus' | 'boss';
  statusText: string;
  xp: string;
  topics: string[];
  cx: number;
  cy: number;
  r: number;
}

const NODES: NodeData[] = [
  {
    id: 'syntax',
    number: '01',
    name: 'Sintaxis',
    status: 'completed',
    statusText: 'Completado · 3/3',
    xp: '+200 XP',
    topics: ['Variables primitivas', 'Tipos de datos', 'Operadores'],
    cx: 55,
    cy: 140,
    r: 15,
  },
  {
    id: 'scope',
    number: '02',
    name: 'Scope',
    status: 'completed',
    statusText: 'Completado · 3/3',
    xp: '+250 XP',
    topics: ['Ámbito léxico', 'Bloques de ejecución', 'Variables'],
    cx: 135,
    cy: 90,
    r: 15,
  },
  {
    id: 'functions',
    number: '03',
    name: 'Funciones',
    status: 'completed',
    statusText: 'Completado · 3/3',
    xp: '+300 XP',
    topics: ['Parámetros', 'Retorno múltiple', 'Lambdas'],
    cx: 215,
    cy: 165,
    r: 15,
  },
  {
    id: 'control-flow',
    number: '04',
    name: 'Control Flow',
    status: 'active',
    statusText: 'En Progreso · Paso 3/4',
    xp: '+250 XP',
    topics: ['if / elif / else', 'Bucles for & while', 'Match pattern'],
    cx: 305,
    cy: 130,
    r: 18,
  },
  {
    id: 'oop',
    number: '05A',
    name: 'POO',
    status: 'locked',
    statusText: 'Bloqueado · Req. Nivel 4',
    xp: '+400 XP',
    topics: ['Clases & Objetos', 'Herencia', 'Polimorfismo'],
    cx: 395,
    cy: 70,
    r: 15,
  },
  {
    id: 'datastructs',
    number: '05B',
    name: 'Memoria',
    status: 'unlocked',
    statusText: 'Disponible para iniciar',
    xp: '+350 XP',
    topics: ['Listas y Diccionarios', 'Comprensión de listas', 'O(n)'],
    cx: 395,
    cy: 190,
    r: 15,
  },
  {
    id: 'bonus',
    number: '★',
    name: 'Bonus Loot',
    status: 'bonus',
    statusText: 'Recompensa especial',
    xp: '+150 XP',
    topics: ['Tema Cyber Koda', 'Avatar de fuego'],
    cx: 395,
    cy: 250,
    r: 12,
  },
  {
    id: 'boss',
    number: 'Ω',
    name: 'Apex Gate',
    status: 'boss',
    statusText: 'Reto Final · 3 Fases',
    xp: '+1000 XP',
    topics: ['Proyecto terminal', 'Tests unitarios', 'Despliegue'],
    cx: 480,
    cy: 130,
    r: 17,
  },
];

export const MiniSkillTree: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      {/* Resplandor de fondo cósmico específico para el widget */}
      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/5 via-amber-500/10 to-rose-500/5 rounded-3xl blur-2xl pointer-events-none" />

      {/* Contenedor principal integrado */}
      <div className="relative rounded-2xl bg-slate-950/70 border border-slate-800/80 p-3 sm:p-4 backdrop-blur-sm overflow-hidden">
        {/* Barra superior HUD */}
        <div className="flex items-center justify-between text-[11px] font-mono pb-2 border-b border-slate-900">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold tracking-wider">SECTOR ALPHA: FUNDAMENTOS</span>
            <span className="text-slate-500 text-[10px] hidden sm:inline">[3/3 DOMINADOS]</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 font-bold">
              100%
            </span>
            <span className="text-slate-400 text-[10px] tracking-wide hidden sm:inline">VISTA DE MAPA</span>
          </div>
        </div>

        {/* Canvas SVG del Árbol de Habilidades */}
        <div className="relative mt-2 aspect-[540/280] w-full">
          <svg
            viewBox="0 0 540 280"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Filtros de Resplandor Neón */}
              <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Degradados de Conectores */}
              <linearGradient id="grad-cyan-to-amber" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="60%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              <linearGradient id="grad-amber-to-purple" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>

              <linearGradient id="grad-amber-to-green" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              <linearGradient id="grad-purple-to-red" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>

              <linearGradient id="grad-green-to-red" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Puntos de referencia / estrellas de fondo tenue */}
            <g className="opacity-20 text-slate-400">
              <circle cx="35" cy="40" r="1" fill="currentColor" />
              <circle cx="100" cy="220" r="1" fill="currentColor" />
              <circle cx="260" cy="50" r="1" fill="currentColor" />
              <circle cx="330" cy="240" r="1.5" fill="currentColor" />
              <circle cx="460" cy="45" r="1" fill="currentColor" />
              <circle cx="505" cy="210" r="1" fill="currentColor" />
              <path d="M 80 60 L 84 60 M 82 58 L 82 62" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 450 250 L 454 250 M 452 248 L 452 252" stroke="currentColor" strokeWidth="0.8" />
            </g>

            {/* =========================================================
                RUTAS / SPLINES DE CONEXIÓN
                ========================================================= */}
            {/* 01 -> 02 (Cian) */}
            <path
              d="M 55 140 C 95 140, 95 90, 135 90"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow-cyan)"
            />

            {/* 02 -> 03 (Cian) */}
            <path
              d="M 135 90 C 175 90, 175 165, 215 165"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow-cyan)"
            />

            {/* 03 -> 04 (Cian a Ámbar) */}
            <path
              d="M 215 165 C 255 165, 265 130, 305 130"
              stroke="url(#grad-cyan-to-amber)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow-amber)"
            />

            {/* Bifurcación Rama A: 04 -> 05A (Ámbar a Púrpura) */}
            <path
              d="M 305 130 C 350 130, 350 70, 395 70"
              stroke="url(#grad-amber-to-purple)"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              filter="url(#glow-purple)"
              className="opacity-70"
            />

            {/* Bifurcación Rama B: 04 -> 05B (Ámbar a Verde) */}
            <path
              d="M 305 130 C 350 130, 350 190, 395 190"
              stroke="url(#grad-amber-to-green)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-green)"
            />

            {/* Conector Vertical hacia Cofre Bonus */}
            <path
              d="M 395 205 L 395 238"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              filter="url(#glow-amber)"
            />

            {/* Convergencia: 05A -> Boss (Púrpura a Rojo) */}
            <path
              d="M 395 70 C 440 70, 440 130, 480 130"
              stroke="url(#grad-purple-to-red)"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              className="opacity-50"
            />

            {/* Convergencia: 05B -> Boss (Verde a Rojo) */}
            <path
              d="M 395 190 C 440 190, 440 130, 480 130"
              stroke="url(#grad-green-to-red)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-red)"
              className="opacity-70"
            />

            {/* =========================================================
                ANILLOS ORBITALES CONCÉNTRICOS DEL NODO ACTIVO 04
                ========================================================= */}
            <g className="pointer-events-none">
              <circle
                cx="305"
                cy="130"
                r="30"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeOpacity="0.4"
                strokeDasharray="4 4"
                className="animate-[spin_12s_linear_infinite] origin-[305px_130px]"
              />
              <circle
                cx="305"
                cy="130"
                r="45"
                stroke="#f97316"
                strokeWidth="0.8"
                strokeOpacity="0.25"
                strokeDasharray="6 6"
                className="animate-[spin_20s_linear_infinite_reverse] origin-[305px_130px]"
              />
              <circle
                cx="305"
                cy="130"
                r="60"
                stroke="#ea580c"
                strokeWidth="0.5"
                strokeOpacity="0.15"
              />
            </g>

            {/* =========================================================
                NODOS VECTORIALES
                ========================================================= */}
            {NODES.map((node) => {
              const isHovered = hoveredNode?.id === node.id;
              const isActive = node.status === 'active';

              // Colores según estado
              let fillBg = '#0f172a';
              let strokeColor = '#06b6d4';
              let glowFilter = 'url(#glow-cyan)';
              let textColor = '#22d3ee';

              if (node.status === 'active') {
                fillBg = '#ea580c';
                strokeColor = '#fbbf24';
                glowFilter = 'url(#glow-amber)';
                textColor = '#fef3c7';
              } else if (node.status === 'locked') {
                fillBg = '#1e1b4b';
                strokeColor = '#a855f7';
                glowFilter = 'url(#glow-purple)';
                textColor = '#c084fc';
              } else if (node.status === 'unlocked') {
                fillBg = '#064e3b';
                strokeColor = '#10b981';
                glowFilter = 'url(#glow-green)';
                textColor = '#34d399';
              } else if (node.status === 'bonus') {
                fillBg = '#78350f';
                strokeColor = '#f59e0b';
                glowFilter = 'url(#glow-amber)';
                textColor = '#fbbf24';
              } else if (node.status === 'boss') {
                fillBg = '#450a0a';
                strokeColor = '#ef4444';
                glowFilter = 'url(#glow-red)';
                textColor = '#f87171';
              }

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Halo de selección en hover */}
                  {isHovered && (
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={node.r + 6}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin origin-center"
                      style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
                    />
                  )}

                  {/* Círculo Principal del Nodo */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r}
                    fill={fillBg}
                    stroke={strokeColor}
                    strokeWidth={isActive ? 2.5 : 2}
                    filter={glowFilter}
                  />

                  {/* Icono vectorial dentro del nodo */}
                  <g
                    transform={`translate(${node.cx - 8}, ${node.cy - 8})`}
                    className="pointer-events-none"
                  >
                    {node.id === 'syntax' && (
                      <IconBracketsContain className="w-4 h-4" stroke={textColor} strokeWidth={2.2} />
                    )}
                    {node.id === 'scope' && (
                      <IconBinaryTree className="w-4 h-4" stroke={textColor} strokeWidth={2.2} />
                    )}
                    {node.id === 'functions' && (
                      <IconAtom2 className="w-4 h-4" stroke={textColor} strokeWidth={2.2} />
                    )}
                    {node.id === 'control-flow' && (
                      <IconRoute className="w-4 h-4" stroke="#ffffff" strokeWidth={2.5} />
                    )}
                    {node.id === 'oop' && (
                      <IconLock className="w-4 h-4" stroke={textColor} strokeWidth={2.2} />
                    )}
                    {node.id === 'datastructs' && (
                      <IconCpu className="w-4 h-4" stroke={textColor} strokeWidth={2.2} />
                    )}
                    {node.id === 'bonus' && (
                      <IconGift className="w-4 h-4" stroke={textColor} strokeWidth={2.2} />
                    )}
                    {node.id === 'boss' && (
                      <IconSkull className="w-4 h-4" stroke={textColor} strokeWidth={2.5} />
                    )}
                  </g>

                  {/* Micro-etiquetas debajo de los nodos */}
                  <text
                    x={node.cx}
                    y={node.cy + node.r + 12}
                    textAnchor="middle"
                    className="font-mono text-[8px] font-bold tracking-tight uppercase"
                    fill={isActive ? '#f59e0b' : '#94a3b8'}
                  >
                    {node.number} · {node.name}
                  </text>
                  <text
                    x={node.cx}
                    y={node.cy + node.r + 20}
                    textAnchor="middle"
                    className="font-mono text-[7px] font-medium"
                    fill={
                      node.status === 'completed'
                        ? '#22d3ee'
                        : node.status === 'active'
                        ? '#fbbf24'
                        : '#64748b'
                    }
                  >
                    {node.xp}
                  </text>
                </g>
              );
            })}

            {/* Badge flotante "ACTIVO" sobre el nodo 04 */}
            <g transform="translate(305, 95)" className="pointer-events-none">
              <rect
                x="-36"
                y="-9"
                width="72"
                height="18"
                rx="9"
                fill="#1c1917"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <circle cx="-25" cy="0" r="2.5" fill="#f59e0b" className="animate-ping" />
              <circle cx="-25" cy="0" r="2.5" fill="#f59e0b" />
              <text
                x="4"
                y="3"
                textAnchor="middle"
                className="font-mono text-[7px] font-bold fill-amber-300 tracking-wider"
              >
                PASO 3/4
              </text>
            </g>
          </svg>
        </div>

        {/* Tooltip táctico interactivo en Hover */}
        {hoveredNode && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-64 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl shadow-black/80 backdrop-blur-md pointer-events-none animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="font-bold text-white">
                {hoveredNode.number} · {hoveredNode.name}
              </span>
              <span className="text-amber-400 font-bold">{hoveredNode.xp}</span>
            </div>
            <p className="text-[10px] font-sans text-slate-300 mb-2">
              Estado: <span className="font-semibold text-white">{hoveredNode.statusText}</span>
            </p>
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase text-slate-500 tracking-wider">
                Conceptos clave:
              </span>
              <div className="flex flex-wrap gap-1">
                {hoveredNode.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leyenda Inferior */}
        <div className="mt-3 pt-2.5 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
            <span>Dominado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
            <span className="text-amber-300">Activo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Bloqueado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
            <span>Boss Gate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniSkillTree;
