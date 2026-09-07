import React from 'react';
import {
  IconLock,
  IconCpu,
  IconSkull,
  IconGift,
  IconBracketsContain,
  IconBinaryTree,
  IconAtom2,
  IconRoute,
  IconShieldCheck,
  IconGitFork,
  IconPlus,
  IconMinus,
} from '@tabler/icons-react';

export const MiniSkillTree: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none pointer-events-none">
      {/* Resplandor ambiental cósmico */}
      <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/10 via-amber-500/15 to-rose-500/10 rounded-3xl blur-2xl opacity-70" />

      {/* Marco de visualización puramente gráfico */}
      <div className="relative rounded-2xl bg-slate-950/80 border border-slate-800/90 p-3 sm:p-4 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/90">
        {/* Barra superior HUD (gráfica) */}
        <div className="flex items-center justify-between text-[10px] font-mono pb-2 border-b border-slate-900">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
            <IconShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold tracking-wider">SECTOR ALPHA: FUNDAMENTOS [3/3]</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[9px] gap-1 text-slate-400">
              <IconMinus className="w-2.5 h-2.5" />
              <span className="text-amber-400 font-bold px-0.5">100%</span>
              <IconPlus className="w-2.5 h-2.5" />
            </div>
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-cyan-400">
              <IconGitFork className="w-3 h-3" />
              <span>BRANCH TRACKS</span>
            </div>
          </div>
        </div>

        {/* Canvas SVG de la Constelación */}
        <div className="relative mt-2 aspect-[540/290] w-full">
          <svg
            viewBox="0 0 540 290"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Filtros de Resplandor Neón */}
              <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Degradados de Conectores Bézier */}
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

            {/* Estrellas y marcas de coordenadas tenues */}
            <g className="opacity-25 text-slate-400">
              <circle cx="35" cy="35" r="1" fill="currentColor" />
              <circle cx="95" cy="210" r="1" fill="currentColor" />
              <circle cx="260" cy="45" r="1" fill="currentColor" />
              <circle cx="330" cy="235" r="1.5" fill="currentColor" />
              <circle cx="460" cy="40" r="1" fill="currentColor" />
              <circle cx="510" cy="210" r="1" fill="currentColor" />
              <path d="M 75 55 L 81 55 M 78 52 L 78 58" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 450 245 L 456 245 M 453 242 L 453 248" stroke="currentColor" strokeWidth="0.8" />
            </g>

            {/* =========================================================
                RUTAS / SPLINES BÉZIER CON RESPLANDOR
                ========================================================= */}
            {/* 01 -> 02 (Cian) */}
            <path
              d="M 55 130 C 95 130, 95 85, 135 85"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow-cyan)"
            />

            {/* 02 -> 03 (Cian) */}
            <path
              d="M 135 85 C 175 85, 175 155, 215 155"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow-cyan)"
            />

            {/* 03 -> 04 (Cian a Ámbar) */}
            <path
              d="M 215 155 C 255 155, 265 125, 305 125"
              stroke="url(#grad-cyan-to-amber)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow-amber)"
            />

            {/* Rama A: 04 -> 05A (Ámbar a Púrpura) */}
            <path
              d="M 305 125 C 348 125, 350 65, 395 65"
              stroke="url(#grad-amber-to-purple)"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              filter="url(#glow-purple)"
              className="opacity-70"
            />

            {/* Rama B: 04 -> 05B (Ámbar a Verde) */}
            <path
              d="M 305 125 C 348 125, 350 180, 395 180"
              stroke="url(#grad-amber-to-green)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-green)"
            />

            {/* Conector a Cofre Bonus */}
            <path
              d="M 395 195 L 395 235"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              filter="url(#glow-amber)"
            />

            {/* Convergencia: 05A -> Boss (Púrpura a Rojo) */}
            <path
              d="M 395 65 C 440 65, 440 125, 480 125"
              stroke="url(#grad-purple-to-red)"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              className="opacity-50"
            />

            {/* Convergencia: 05B -> Boss (Verde a Rojo) */}
            <path
              d="M 395 180 C 440 180, 440 125, 480 125"
              stroke="url(#grad-green-to-red)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-red)"
              className="opacity-75"
            />

            {/* =========================================================
                ANILLOS ORBITALES CONCÉNTRICOS DEL NODO ACTIVO 04
                ========================================================= */}
            <g>
              <circle
                cx="305"
                cy="125"
                r="28"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeOpacity="0.45"
                strokeDasharray="4 4"
                className="animate-[spin_12s_linear_infinite] origin-[305px_125px]"
              />
              <circle
                cx="305"
                cy="125"
                r="44"
                stroke="#f97316"
                strokeWidth="0.8"
                strokeOpacity="0.25"
                strokeDasharray="5 5"
                className="animate-[spin_20s_linear_infinite_reverse] origin-[305px_125px]"
              />
              <circle
                cx="305"
                cy="125"
                r="58"
                stroke="#ea580c"
                strokeWidth="0.5"
                strokeOpacity="0.15"
              />
            </g>

            {/* =========================================================
                NODO 01: SINTAXIS (DOMINADO)
                ========================================================= */}
            <g>
              <circle
                cx="55"
                cy="130"
                r="15"
                fill="#0c4a6e"
                stroke="#06b6d4"
                strokeWidth="2"
                filter="url(#glow-cyan)"
              />
              <g transform="translate(47, 122)">
                <IconBracketsContain className="w-4 h-4" stroke="#38bdf8" strokeWidth={2.2} />
              </g>
              <text x="55" y="153" textAnchor="middle" fill="#fbbf24" fontSize="6.5" letterSpacing="1.5">
                ★★★
              </text>
              <text x="55" y="163" textAnchor="middle" className="font-mono text-[7.5px] font-bold tracking-tight uppercase" fill="#ffffff">
                01 · SINTAXIS
              </text>
              <text x="55" y="171" textAnchor="middle" className="font-mono text-[6.5px] font-semibold" fill="#38bdf8">
                DOMINADO · +200 XP
              </text>
            </g>

            {/* =========================================================
                NODO 02: SCOPE & VARIABLES (DOMINADO)
                ========================================================= */}
            <g>
              <circle
                cx="135"
                cy="85"
                r="15"
                fill="#0c4a6e"
                stroke="#06b6d4"
                strokeWidth="2"
                filter="url(#glow-cyan)"
              />
              <g transform="translate(127, 77)">
                <IconBinaryTree className="w-4 h-4" stroke="#38bdf8" strokeWidth={2.2} />
              </g>
              <text x="135" y="108" textAnchor="middle" fill="#fbbf24" fontSize="6.5" letterSpacing="1.5">
                ★★★
              </text>
              <text x="135" y="118" textAnchor="middle" className="font-mono text-[7.5px] font-bold tracking-tight uppercase" fill="#ffffff">
                02 · SCOPE
              </text>
              <text x="135" y="126" textAnchor="middle" className="font-mono text-[6.5px] font-semibold" fill="#38bdf8">
                DOMINADO · +250 XP
              </text>
            </g>

            {/* =========================================================
                NODO 03: FUNCIONES PURAS (DOMINADO)
                ========================================================= */}
            <g>
              <circle
                cx="215"
                cy="155"
                r="15"
                fill="#0c4a6e"
                stroke="#06b6d4"
                strokeWidth="2"
                filter="url(#glow-cyan)"
              />
              <g transform="translate(207, 147)">
                <IconAtom2 className="w-4 h-4" stroke="#38bdf8" strokeWidth={2.2} />
              </g>
              <text x="215" y="178" textAnchor="middle" fill="#fbbf24" fontSize="6.5" letterSpacing="1.5">
                ★★★
              </text>
              <text x="215" y="188" textAnchor="middle" className="font-mono text-[7.5px] font-bold tracking-tight uppercase" fill="#ffffff">
                03 · FUNCIONES
              </text>
              <text x="215" y="196" textAnchor="middle" className="font-mono text-[6.5px] font-semibold" fill="#38bdf8">
                DOMINADO · +300 XP
              </text>
            </g>

            {/* =========================================================
                NODO 04: CONTROL DE FLUJO (ACTIVO · EN PROGRESO)
                ========================================================= */}
            <g>
              {/* Badge flotante superior */}
              <g transform="translate(305, 92)">
                <rect x="-34" y="-8" width="68" height="16" rx="8" fill="#1c1917" stroke="#f59e0b" strokeWidth="1" />
                <circle cx="-23" cy="0" r="2.5" fill="#f59e0b" className="animate-ping" />
                <circle cx="-23" cy="0" r="2.5" fill="#f59e0b" />
                <text x="5" y="2.5" textAnchor="middle" className="font-mono text-[6.5px] font-bold fill-amber-300 tracking-wider">
                  PASO 3/4
                </text>
              </g>

              {/* Círculo Principal Activo */}
              <circle
                cx="305"
                cy="125"
                r="18"
                fill="#ea580c"
                stroke="#fbbf24"
                strokeWidth="2.5"
                filter="url(#glow-amber)"
              />
              <g transform="translate(297, 117)">
                <IconRoute className="w-4 h-4" stroke="#ffffff" strokeWidth={2.5} />
              </g>

              <text x="305" y="152" textAnchor="middle" className="font-mono text-[8px] font-bold tracking-tight uppercase" fill="#fbbf24">
                04 · CONTROL FLOW
              </text>
              <text x="305" y="160" textAnchor="middle" className="font-mono text-[6.5px] font-semibold" fill="#fef3c7">
                EN PROGRESO · +250 XP
              </text>
            </g>

            {/* =========================================================
                NODO 05A: POO & CLASES (BLOQUEADO · PÚRPURA)
                ========================================================= */}
            <g>
              <circle
                cx="395"
                cy="65"
                r="14"
                fill="#3b0764"
                stroke="#a855f7"
                strokeWidth="1.8"
                filter="url(#glow-purple)"
                strokeDasharray="3 2"
              />
              <g transform="translate(387, 57)">
                <IconLock className="w-4 h-4" stroke="#c084fc" strokeWidth={2.2} />
              </g>
              <text x="395" y="88" textAnchor="middle" className="font-mono text-[7.5px] font-bold tracking-tight uppercase" fill="#c084fc">
                05A · POO
              </text>
              <text x="395" y="96" textAnchor="middle" className="font-mono text-[6.5px] font-medium" fill="#9333ea">
                BLOQUEADO · LVL 4
              </text>
            </g>

            {/* =========================================================
                NODO 05B: MEMORIA & ESTRUCTURAS (DISPONIBLE · VERDE)
                ========================================================= */}
            <g>
              <circle
                cx="395"
                cy="180"
                r="14"
                fill="#064e3b"
                stroke="#10b981"
                strokeWidth="2"
                filter="url(#glow-green)"
              />
              <g transform="translate(387, 172)">
                <IconCpu className="w-4 h-4" stroke="#34d399" strokeWidth={2.2} />
              </g>
              <text x="395" y="202" textAnchor="middle" className="font-mono text-[7.5px] font-bold tracking-tight uppercase" fill="#34d399">
                05B · MEMORIA
              </text>
              <text x="395" y="210" textAnchor="middle" className="font-mono text-[6.5px] font-medium" fill="#10b981">
                DISPONIBLE · +350 XP
              </text>
            </g>

            {/* =========================================================
                COFRE BONUS (DORADO / ÁMBAR)
                ========================================================= */}
            <g>
              <circle
                cx="395"
                cy="245"
                r="11"
                fill="#78350f"
                stroke="#f59e0b"
                strokeWidth="1.8"
                filter="url(#glow-amber)"
              />
              <g transform="translate(388, 238)">
                <IconGift className="w-3.5 h-3.5" stroke="#fbbf24" strokeWidth={2} />
              </g>
              <text x="395" y="264" textAnchor="middle" className="font-mono text-[6.5px] font-bold tracking-tight uppercase" fill="#fbbf24">
                COFRE BONUS
              </text>
              <text x="395" y="271" textAnchor="middle" className="font-mono text-[5.5px] font-medium" fill="#d97706">
                +150 XP & CYBER THEME
              </text>
            </g>

            {/* =========================================================
                NODO 06: APEX BOSS GATE (ROJO NEÓN)
                ========================================================= */}
            <g>
              <circle
                cx="480"
                cy="125"
                r="17"
                fill="#450a0a"
                stroke="#ef4444"
                strokeWidth="2.2"
                filter="url(#glow-red)"
              />
              <g transform="translate(472, 117)">
                <IconSkull className="w-4 h-4" stroke="#f87171" strokeWidth={2.2} />
              </g>
              <text x="480" y="152" textAnchor="middle" className="font-mono text-[8px] font-bold tracking-tight uppercase" fill="#f87171">
                Ω · APEX GATE
              </text>
              <text x="480" y="160" textAnchor="middle" className="font-mono text-[6.5px] font-semibold" fill="#ef4444">
                RETO FINAL · 3 FASES
              </text>
            </g>
          </svg>
        </div>

        {/* Leyenda Inferior Fija (estilo HUD) */}
        <div className="mt-2.5 pt-2 border-t border-slate-900/90 flex flex-wrap items-center justify-between gap-1.5 text-[8.5px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
            <span>Completado (3)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
            <span className="text-amber-300">Activo (1)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Disponible (1)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Bloqueado (1)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
            <span>Apex Gate (1)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniSkillTree;
