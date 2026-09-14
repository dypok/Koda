import React from 'react';

export const SkillTreeDefs: React.FC = () => (
  <>
    <defs>
      <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
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
      <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <radialGradient id="halo-amber">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
      </radialGradient>

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

    <g className="text-slate-400">
      <circle cx="30" cy="30" r="1.2" fill="currentColor" className="st-twinkle" />
      <circle cx="90" cy="195" r="1" fill="currentColor" className="st-twinkle" style={{ animationDelay: '-1s' }} />
      <circle cx="160" cy="200" r="1.5" fill="currentColor" className="st-twinkle" style={{ animationDelay: '-2s' }} />
      <circle cx="260" cy="35" r="1" fill="currentColor" className="st-twinkle" style={{ animationDelay: '-0.5s' }} />
      <circle cx="320" cy="225" r="1.5" fill="currentColor" className="st-twinkle" style={{ animationDelay: '-1.6s' }} />
      <circle cx="470" cy="30" r="1.2" fill="currentColor" className="st-twinkle" style={{ animationDelay: '-2.4s' }} />
      <circle cx="530" cy="195" r="1" fill="currentColor" className="st-twinkle" style={{ animationDelay: '-0.8s' }} />
      <circle cx="230" cy="220" r="1" fill="currentColor" className="st-twinkle" style={{ animationDelay: '-1.9s' }} />
    </g>
  </>
);
