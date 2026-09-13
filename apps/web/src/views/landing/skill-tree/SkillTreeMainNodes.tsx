import React from 'react';

export const SkillTreeMainNodes: React.FC = () => (
  <>
    {/* NODO 01: SINTAXIS */}
    <g className="st-node">
      <circle cx="50" cy="115" r="16" fill="#0c4a6e" stroke="#06b6d4" strokeWidth="2" filter="url(#glow-soft)" />
      <g transform="translate(60, 105)">
        <circle cx="0" cy="0" r="6" fill="#10b981" />
        <path d="M -2.5 0 l 1.8 1.8 l 3.4 -3.6" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(50, 115) scale(0.75) translate(-12, -12)" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4h-4v16h4" /><path d="M17 4h4v16h-4" /><path d="M8 16h.01" /><path d="M12 16h.01" /><path d="M16 16h.01" />
      </g>
      <text x="50" y="143" textAnchor="middle" fill="#fbbf24" fontSize="7" letterSpacing="1.5">★★★</text>
      <text x="50" y="154" textAnchor="middle" className="font-sans text-[8px] font-bold tracking-tight uppercase" fill="#ffffff">01 · SINTAXIS</text>
      <text x="50" y="163" textAnchor="middle" className="font-sans text-[7px] font-semibold" fill="#38bdf8">DOMINADO · +200 XP</text>
    </g>

    {/* NODO 02: SCOPE & VARIABLES */}
    <g className="st-node">
      <circle cx="135" cy="65" r="16" fill="#0c4a6e" stroke="#06b6d4" strokeWidth="2" filter="url(#glow-soft)" />
      <g transform="translate(145, 55)">
        <circle cx="0" cy="0" r="6" fill="#10b981" />
        <path d="M -2.5 0 l 1.8 1.8 l 3.4 -3.6" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(135, 65) scale(0.75) translate(-12, -12)" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M16 4a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
        <path d="M16 20a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M11 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" />
        <path d="M21 12a2 2 0 1 0 -4 0a2 2 0 0 0 4 0" /><path d="M5.058 18.306l2.88 -4.606" />
        <path d="M10.061 10.303l2.877 -4.604" /><path d="M10.065 13.705l2.876 4.6" /><path d="M15.063 5.7l2.881 4.61" />
      </g>
      <text x="135" y="93" textAnchor="middle" fill="#fbbf24" fontSize="7" letterSpacing="1.5">★★★</text>
      <text x="135" y="104" textAnchor="middle" className="font-sans text-[8px] font-bold tracking-tight uppercase" fill="#ffffff">02 · SCOPE</text>
      <text x="135" y="113" textAnchor="middle" className="font-sans text-[7px] font-semibold" fill="#38bdf8">DOMINADO · +250 XP</text>
    </g>

    {/* NODO 03: FUNCIONES */}
    <g className="st-node">
      <circle cx="220" cy="135" r="16" fill="#0c4a6e" stroke="#06b6d4" strokeWidth="2" filter="url(#glow-soft)" />
      <g transform="translate(230, 125)">
        <circle cx="0" cy="0" r="6" fill="#10b981" />
        <path d="M -2.5 0 l 1.8 1.8 l 3.4 -3.6" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(220, 135) scale(0.75) translate(-12, -12)" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 21l0 .01" /><path d="M3 9l0 .01" />
        <path d="M21 9l0 .01" /><path d="M8 20.1a9 9 0 0 1 -5 -7.1" /><path d="M16 20.1a9 9 0 0 0 5 -7.1" /><path d="M6.2 5a9 9 0 0 1 11.4 0" />
      </g>
      <text x="220" y="163" textAnchor="middle" fill="#fbbf24" fontSize="7" letterSpacing="1.5">★★★</text>
      <text x="220" y="174" textAnchor="middle" className="font-sans text-[8px] font-bold tracking-tight uppercase" fill="#ffffff">03 · FUNCIONES</text>
      <text x="220" y="183" textAnchor="middle" className="font-sans text-[7px] font-semibold" fill="#38bdf8">DOMINADO · +300 XP</text>
    </g>

    {/* NODO 04: CONTROL FLOW (ACTIVO) */}
    <g className="st-node">
      <circle cx="310" cy="105" r="19" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.6">
        <animate attributeName="r" values="19;32" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="310" cy="105" r="19" fill="#ea580c" stroke="#fbbf24" strokeWidth="2.5" filter="url(#glow-amber)" className="st-breathe" />
      <g transform="translate(310, 105) scale(0.85) translate(-12, -12)" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4" />
        <path d="M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5" />
      </g>
      <text x="310" y="139" textAnchor="middle" className="font-sans text-[8.5px] font-bold tracking-tight uppercase" fill="#fbbf24">04 · CONTROL FLOW</text>
      <text x="310" y="149" textAnchor="middle" className="font-sans text-[7px] font-semibold" fill="#fef3c7">EN PROGRESO · +250 XP</text>
    </g>
  </>
);
