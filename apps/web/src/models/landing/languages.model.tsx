import React from 'react';
import { cn } from '@/lib/utils';

export const IconFlagSpain: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg viewBox="0 0 30 21" className={cn('rounded-[4px] overflow-hidden shrink-0 ring-1 ring-white/10', className)} aria-hidden="true">
    <rect width="30" height="21" fill="#c60b1e" />
    <rect y="5.25" width="30" height="10.5" fill="#ffc400" />
  </svg>
);

export const IconFlagUS: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg viewBox="0 0 30 21" className={cn('rounded-[4px] overflow-hidden shrink-0 ring-1 ring-white/10', className)} aria-hidden="true">
    <rect width="30" height="21" fill="#b22234" />
    {Array.from({ length: 4 }).map((_, i) => (
      <rect key={i} y={1.5 + i * 5} width="30" height="2.4" fill="#ffffff" />
    ))}
    <rect width="14" height="11" fill="#3c3b6e" />
    {Array.from({ length: 6 }).map((_, i) => (
      <circle key={i} cx={2.5 + (i % 3) * 4.5} cy={3 + Math.floor(i / 3) * 5} r="0.9" fill="#ffffff" />
    ))}
  </svg>
);

export const IconFlagBrazil: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg viewBox="0 0 30 21" className={cn('rounded-[4px] overflow-hidden shrink-0 ring-1 ring-white/10', className)} aria-hidden="true">
    <rect width="30" height="21" fill="#009c3b" />
    <polygon points="15,2.5 27,10.5 15,18.5 3,10.5" fill="#ffdf00" />
    <circle cx="15" cy="10.5" r="4" fill="#002776" />
    <path d="M 11 9 Q 15 11.5 19 10" stroke="#ffffff" strokeWidth="0.8" fill="none" />
  </svg>
);

export const IconFlagFrance: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg viewBox="0 0 30 21" className={cn('rounded-[4px] overflow-hidden shrink-0 ring-1 ring-white/10', className)} aria-hidden="true">
    <rect width="10" height="21" fill="#0055a5" />
    <rect x="10" width="10" height="21" fill="#ffffff" />
    <rect x="20" width="10" height="21" fill="#ef4135" />
  </svg>
);

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  icon: React.ComponentType<{ className?: string }>;
  comingSoon?: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', nativeName: 'Español', icon: IconFlagSpain },
  { code: 'en', name: 'Inglés', nativeName: 'English', icon: IconFlagUS, comingSoon: true },
  { code: 'pt', name: 'Portugués', nativeName: 'Português', icon: IconFlagBrazil, comingSoon: true },
  { code: 'fr', name: 'Francés', nativeName: 'Français', icon: IconFlagFrance, comingSoon: true },
];
