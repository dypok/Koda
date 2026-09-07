import React from 'react';

export const MiniSkillTree: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none pointer-events-none">
      {/* Resplandor ambiental cósmico */}
      <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/10 via-amber-500/15 to-rose-500/10 rounded-3xl blur-2xl opacity-70" />

      {/* Contenedor visual integrado */}
      <div className="relative rounded-2xl bg-slate-950/80 border border-slate-800/90 p-4 sm:p-5 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/90">
        {/* Canvas SVG de la Constelación */}
        <div className="relative aspect-[580/260] w-full">
          <svg
            viewBox="0 0 580 260"
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

            {/* Estrellas y marcas de fondo tenue */}
            <g className="opacity-25 text-slate-400">
              <circle cx="30" cy="30" r="1" fill="currentColor" />
              <circle cx="90" cy="195" r="1" fill="currentColor" />
              <circle cx="260" cy="35" r="1" fill="currentColor" />
              <circle cx="320" cy="225" r="1.5" fill="currentColor" />
              <circle cx="470" cy="30" r="1" fill="currentColor" />
              <circle cx="530" cy="195" r="1" fill="currentColor" />
              <path d="M 65 45 L 71 45 M 68 42 L 68 48" stroke="currentColor" strokeWidth="0.8" />
              <path d="M 480 220 L 486 220 M 483 217 L 483 223" stroke="currentColor" strokeWidth="0.8" />
            </g>

            {/* =========================================================
                RUTAS / SPLINES BÉZIER CON RESPLANDOR
                ========================================================= */}
            {/* 01 -> 02 (Cian) */}
            <path
              d="M 50 115 C 90 115, 95 65, 135 65"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow-cyan)"
            />

            {/* 02 -> 03 (Cian) */}
            <path
              d="M 135 65 C 180 65, 175 135, 220 135"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow-cyan)"
            />

            {/* 03 -> 04 (Cian a Ámbar) */}
            <path
              d="M 220 135 C 265 135, 265 105, 310 105"
              stroke="url(#grad-cyan-to-amber)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#glow-amber)"
            />

            {/* Rama A: 04 -> 05A (Ámbar a Púrpura) */}
            <path
              d="M 310 105 C 360 105, 355 55, 405 55"
              stroke="url(#grad-amber-to-purple)"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              filter="url(#glow-purple)"
              className="opacity-70"
            />

            {/* Rama B: 04 -> 05B (Ámbar a Verde) */}
            <path
              d="M 310 105 C 360 105, 355 155, 405 155"
              stroke="url(#grad-amber-to-green)"
              strokeWidth="2"
              strokeLinecap="round"
              filter="url(#glow-green)"
            />

            {/* Conector Vertical a Cofre Bonus */}
            <path
              d="M 405 170 L 405 206"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              filter="url(#glow-amber)"
            />

            {/* Convergencia: 05A -> Boss (Púrpura a Rojo) */}
            <path
              d="M 405 55 C 460 55, 460 105, 510 105"
              stroke="url(#grad-purple-to-red)"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              className="opacity-50"
            />

            {/* Convergencia: 05B -> Boss (Verde a Rojo) */}
            <path
              d="M 405 155 C 460 155, 460 105, 510 105"
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
                cx="310"
                cy="105"
                r="30"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeOpacity="0.45"
                strokeDasharray="4 4"
                className="animate-[spin_12s_linear_infinite] origin-[310px_105px]"
              />
              <circle
                cx="310"
                cy="105"
                r="46"
                stroke="#f97316"
                strokeWidth="0.8"
                strokeOpacity="0.25"
                strokeDasharray="5 5"
                className="animate-[spin_20s_linear_infinite_reverse] origin-[310px_105px]"
              />
              <circle
                cx="310"
                cy="105"
                r="60"
                stroke="#ea580c"
                strokeWidth="0.5"
                strokeOpacity="0.15"
              />
            </g>

            {/* =========================================================
                NODO 01: SINTAXIS (DOMINADO · CIAN)
                ========================================================= */}
            <g>
              <circle
                cx="50"
                cy="115"
                r="16"
                fill="#0c4a6e"
                stroke="#06b6d4"
                strokeWidth="2"
                filter="url(#glow-cyan)"
              />
              {/* Icono centrado matemáticamente */}
              <g
                transform="translate(50, 115) scale(0.75) translate(-12, -12)"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 4h-4v16h4" />
                <path d="M17 4h4v16h-4" />
                <path d="M8 16h.01" />
                <path d="M12 16h.01" />
                <path d="M16 16h.01" />
              </g>

              <text x="50" y="143" textAnchor="middle" fill="#fbbf24" fontSize="7" letterSpacing="1.5">
                ★★★
              </text>
              <text x="50" y="154" textAnchor="middle" className="font-mono text-[8px] font-bold tracking-tight uppercase" fill="#ffffff">
                01 · SINTAXIS
              </text>
              <text x="50" y="163" textAnchor="middle" className="font-mono text-[7px] font-semibold" fill="#38bdf8">
                DOMINADO · +200 XP
              </text>
            </g>

            {/* =========================================================
                NODO 02: SCOPE & VARIABLES (DOMINADO · CIAN)
                ========================================================= */}
            <g>
              <circle
                cx="135"
                cy="65"
                r="16"
                fill="#0c4a6e"
                stroke="#06b6d4"
                strokeWidth="2"
                filter="url(#glow-cyan)"
              />
              {/* Icono centrado matemáticamente */}
              <g
                transform="translate(135, 65) scale(0.75) translate(-12, -12)"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
                <path d="M16 4a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
                <path d="M16 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
                <path d="M11 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
                <path d="M21 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
                <path d="M5.058 18.306l2.88 -4.606" />
                <path d="M10.061 10.303l2.877 -4.604" />
                <path d="M10.065 13.705l2.876 4.6" />
                <path d="M15.063 5.7l2.881 4.61" />
              </g>

              <text x="135" y="93" textAnchor="middle" fill="#fbbf24" fontSize="7" letterSpacing="1.5">
                ★★★
              </text>
              <text x="135" y="104" textAnchor="middle" className="font-mono text-[8px] font-bold tracking-tight uppercase" fill="#ffffff">
                02 · SCOPE
              </text>
              <text x="135" y="113" textAnchor="middle" className="font-mono text-[7px] font-semibold" fill="#38bdf8">
                DOMINADO · +250 XP
              </text>
            </g>

            {/* =========================================================
                NODO 03: FUNCIONES PURAS (DOMINADO · CIAN)
                ========================================================= */}
            <g>
              <circle
                cx="220"
                cy="135"
                r="16"
                fill="#0c4a6e"
                stroke="#06b6d4"
                strokeWidth="2"
                filter="url(#glow-cyan)"
              />
              {/* Icono centrado matemáticamente */}
              <g
                transform="translate(220, 135) scale(0.75) translate(-12, -12)"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M12 21l0 .01" />
                <path d="M3 9l0 .01" />
                <path d="M21 9l0 .01" />
                <path d="M8 20.1a9 9 0 0 1 -5 -7.1" />
                <path d="M16 20.1a9 9 0 0 0 5 -7.1" />
                <path d="M6.2 5a9 9 0 0 1 11.4 0" />
              </g>

              <text x="220" y="163" textAnchor="middle" fill="#fbbf24" fontSize="7" letterSpacing="1.5">
                ★★★
              </text>
              <text x="220" y="174" textAnchor="middle" className="font-mono text-[8px] font-bold tracking-tight uppercase" fill="#ffffff">
                03 · FUNCIONES
              </text>
              <text x="220" y="183" textAnchor="middle" className="font-mono text-[7px] font-semibold" fill="#38bdf8">
                DOMINADO · +300 XP
              </text>
            </g>

            {/* =========================================================
                NODO 04: CONTROL DE FLUJO (ACTIVO · ÁMBAR)
                ========================================================= */}
            <g>
              {/* Círculo Principal Activo */}
              <circle
                cx="310"
                cy="105"
                r="19"
                fill="#ea580c"
                stroke="#fbbf24"
                strokeWidth="2.5"
                filter="url(#glow-amber)"
              />
              {/* Icono centrado matemáticamente */}
              <g
                transform="translate(310, 105) scale(0.85) translate(-12, -12)"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                <path d="M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4" />
                <path d="M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5" />
              </g>

              <text x="310" y="139" textAnchor="middle" className="font-mono text-[8.5px] font-bold tracking-tight uppercase" fill="#fbbf24">
                04 · CONTROL FLOW
              </text>
              <text x="310" y="149" textAnchor="middle" className="font-mono text-[7px] font-semibold" fill="#fef3c7">
                EN PROGRESO · +250 XP
              </text>
            </g>

            {/* =========================================================
                NODO 05A: POO & CLASES (BLOQUEADO · PÚRPURA)
                ========================================================= */}
            <g>
              <circle
                cx="405"
                cy="55"
                r="15"
                fill="#3b0764"
                stroke="#a855f7"
                strokeWidth="1.8"
                filter="url(#glow-purple)"
                strokeDasharray="3 2"
              />
              {/* Icono centrado matemáticamente */}
              <g
                transform="translate(405, 55) scale(0.75) translate(-12, -12)"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6" />
                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
              </g>

              <text x="405" y="83" textAnchor="middle" className="font-mono text-[8px] font-bold tracking-tight uppercase" fill="#c084fc">
                05A · POO
              </text>
              <text x="405" y="92" textAnchor="middle" className="font-mono text-[7px] font-medium" fill="#9333ea">
                BLOQUEADO · LVL 4
              </text>
            </g>

            {/* =========================================================
                NODO 05B: MEMORIA & ESTRUCTURAS (DISPONIBLE · VERDE)
                ========================================================= */}
            <g>
              <circle
                cx="405"
                cy="155"
                r="15"
                fill="#064e3b"
                stroke="#10b981"
                strokeWidth="2"
                filter="url(#glow-green)"
              />
              {/* Icono centrado matemáticamente */}
              <g
                transform="translate(405, 155) scale(0.75) translate(-12, -12)"
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 6a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -12" />
                <path d="M9 9h6v6h-6l0 -6" />
                <path d="M3 10h2" />
                <path d="M3 14h2" />
                <path d="M10 3v2" />
                <path d="M14 3v2" />
                <path d="M21 10h-2" />
                <path d="M21 14h-2" />
                <path d="M14 21v-2" />
                <path d="M10 21v-2" />
              </g>

              <text x="405" y="183" textAnchor="middle" className="font-mono text-[8px] font-bold tracking-tight uppercase" fill="#34d399">
                05B · MEMORIA
              </text>
              <text x="405" y="192" textAnchor="middle" className="font-mono text-[7px] font-medium" fill="#10b981">
                DISPONIBLE · +350 XP
              </text>
            </g>

            {/* =========================================================
                COFRE BONUS (DORADO / ÁMBAR)
                ========================================================= */}
            <g>
              <circle
                cx="405"
                cy="218"
                r="12"
                fill="#78350f"
                stroke="#f59e0b"
                strokeWidth="1.8"
                filter="url(#glow-amber)"
              />
              {/* Icono centrado matemáticamente */}
              <g
                transform="translate(405, 218) scale(0.6) translate(-12, -12)"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2" />
                <path d="M12 8l0 13" />
                <path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" />
                <path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" />
              </g>

              <text x="405" y="242" textAnchor="middle" className="font-mono text-[7.5px] font-bold tracking-tight uppercase" fill="#fbbf24">
                COFRE BONUS
              </text>
              <text x="405" y="250" textAnchor="middle" className="font-mono text-[6.5px] font-medium" fill="#d97706">
                +150 XP & CYBER THEME
              </text>
            </g>

            {/* =========================================================
                NODO 06: APEX BOSS GATE (ROJO NEÓN)
                ========================================================= */}
            <g>
              <circle
                cx="510"
                cy="105"
                r="18"
                fill="#450a0a"
                stroke="#ef4444"
                strokeWidth="2.2"
                filter="url(#glow-red)"
              />
              {/* Icono centrado matemáticamente */}
              <g
                transform="translate(510, 105) scale(0.85) translate(-12, -12)"
                fill="none"
                stroke="#f87171"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4c4.418 0 8 3.358 8 7.5c0 1.901 -.755 3.637 -2 4.96l0 2.54a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-2.54c-1.245 -1.322 -2 -3.058 -2 -4.96c0 -4.142 3.582 -7.5 8 -7.5" />
                <path d="M10 17v3" />
                <path d="M14 17v3" />
                <path d="M8 11a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                <path d="M14 11a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
              </g>

              <text x="510" y="138" textAnchor="middle" className="font-mono text-[8.5px] font-bold tracking-tight uppercase" fill="#f87171">
                Ω · APEX GATE
              </text>
              <text x="510" y="148" textAnchor="middle" className="font-mono text-[7px] font-semibold" fill="#ef4444">
                RETO FINAL · 3 FASES
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MiniSkillTree;
