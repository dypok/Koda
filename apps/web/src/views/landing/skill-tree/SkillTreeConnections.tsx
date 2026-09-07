import React from 'react';

export const SkillTreeConnections: React.FC = () => (
  <>
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

    {/* Anillos orbitales del nodo activo 04 */}
    <g>
      <circle cx="310" cy="105" r="28" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4" />
      <circle cx="310" cy="105" r="44" stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="5 5" />
      <circle cx="310" cy="105" r="58" stroke="#ea580c" strokeWidth="0.5" strokeOpacity="0.12" />
    </g>
  </>
);
