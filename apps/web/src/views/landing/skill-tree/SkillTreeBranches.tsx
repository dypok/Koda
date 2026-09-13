import React from 'react';

export const SkillTreeBranches: React.FC = () => (
  <>
    {/* NODO 05A: POO & CLASES (BLOQUEADO) */}
    <g className="st-node" opacity="0.6">
      <circle cx="405" cy="55" r="15" fill="#1e1b2e" stroke="#a855f7" strokeWidth="1.8" strokeDasharray="3 2" filter="url(#glow-soft)" />
      <g transform="translate(405, 55) scale(0.75) translate(-12, -12)" fill="none" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6" />
        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
        <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
      </g>
      <g transform="translate(413, 47)">
        <rect x="-5" y="-3" width="12" height="10" rx="2" fill="#0f172a" stroke="#e2e8f0" strokeWidth="1.2" />
        <path d="M -1.5 0.5 v -1 a1.5 1.5 0 0 1 3 0 v 1" fill="none" stroke="#e2e8f0" strokeWidth="1.2" />
        <circle cx="1" cy="2.5" r="1" fill="#e2e8f0" />
      </g>
      <text x="405" y="83" textAnchor="middle" className="font-sans text-[8px] font-bold tracking-tight uppercase" fill="#c084fc">05A · POO</text>
      <text x="405" y="92" textAnchor="middle" className="font-sans text-[7px] font-medium" fill="#9333ea">BLOQUEADO · LVL 4</text>
    </g>

    {/* NODO 05B: MEMORIA & ESTRUCTURAS */}
    <g className="st-node">
      <circle cx="405" cy="155" r="15" fill="#064e3b" stroke="#10b981" strokeWidth="2" filter="url(#glow-soft)" />
      <g transform="translate(405, 155) scale(0.75) translate(-12, -12)" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 6a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -12" />
        <path d="M9 9h6v6h-6l0 -6" /><path d="M3 10h2" /><path d="M3 14h2" /><path d="M10 3v2" /><path d="M14 3v2" />
        <path d="M21 10h-2" /><path d="M21 14h-2" /><path d="M14 21v-2" /><path d="M10 21v-2" />
      </g>
      <text x="405" y="183" textAnchor="middle" className="font-sans text-[8px] font-bold tracking-tight uppercase" fill="#34d399">05B · MEMORIA</text>
      <text x="405" y="192" textAnchor="middle" className="font-sans text-[7px] font-medium" fill="#10b981">DISPONIBLE · +350 XP</text>
    </g>

    {/* COFRE BONUS */}
    <g className="st-node st-chest">
      <circle cx="405" cy="218" r="12" fill="#78350f" stroke="#f59e0b" strokeWidth="1.8" filter="url(#glow-amber)" />
      <g transform="translate(405, 218) scale(0.6) translate(-12, -12)" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2" />
        <path d="M12 8l0 13" /><path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" />
      </g>
      <text x="405" y="242" textAnchor="middle" className="font-sans text-[7.5px] font-bold tracking-tight uppercase" fill="#fbbf24">COFRE BONUS</text>
      <text x="405" y="250" textAnchor="middle" className="font-sans text-[6.5px] font-medium" fill="#d97706">+150 XP & CYBER THEME</text>
    </g>

    {/* NODO 06: APEX BOSS GATE */}
    <g className="st-node">
      <circle cx="510" cy="105" r="18" fill="#450a0a" stroke="#ef4444" strokeWidth="2.2" filter="url(#glow-strong)" className="st-flicker" />
      <g transform="translate(510, 105) scale(0.85) translate(-12, -12)" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4c4.418 0 8 3.358 8 7.5c0 1.901 -.755 3.637 -2 4.96l0 2.54a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-2.54c-1.245 -1.322 -2 -3.058 -2 -4.96c0 -4.142 3.582 -7.5 8 -7.5" />
        <path d="M10 17v3" /><path d="M14 17v3" /><path d="M8 11a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M14 11a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </g>
      <text x="510" y="138" textAnchor="middle" className="font-sans text-[8.5px] font-bold tracking-tight uppercase" fill="#f87171">Ω · APEX GATE</text>
      <text x="510" y="148" textAnchor="middle" className="font-sans text-[7px] font-semibold" fill="#ef4444">RETO FINAL · 3 FASES</text>
    </g>
  </>
);
