import React from 'react';
import { cn } from '@/lib/utils';

export const IconFlagSpain: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 32 32" className={cn('rounded-full overflow-hidden shrink-0 ring-1 ring-white/10', className)} aria-hidden="true">
    <rect width="32" height="32" fill="#c60b1e" />
    <rect y="8" width="32" height="16" fill="#ffc400" />
  </svg>
);

export const IconFlagUS: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 32 32" className={cn('rounded-full overflow-hidden shrink-0 ring-1 ring-white/10', className)} aria-hidden="true">
    <rect width="32" height="32" fill="#b22234" />
    <rect y="4" width="32" height="3.5" fill="#ffffff" />
    <rect y="11" width="32" height="3.5" fill="#ffffff" />
    <rect y="18" width="32" height="3.5" fill="#ffffff" />
    <rect y="25" width="32" height="3.5" fill="#ffffff" />
    <rect width="16" height="16" fill="#3c3b6e" />
  </svg>
);

export const IconFlagBrazil: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 32 32" className={cn('rounded-full overflow-hidden shrink-0 ring-1 ring-white/10', className)} aria-hidden="true">
    <rect width="32" height="32" fill="#009c3b" />
    <polygon points="16,4 28,16 16,28 4,16" fill="#ffdf00" />
    <circle cx="16" cy="16" r="6" fill="#002776" />
  </svg>
);

export const IconFlagFrance: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 32 32" className={cn('rounded-full overflow-hidden shrink-0 ring-1 ring-white/10', className)} aria-hidden="true">
    <rect width="11" height="32" fill="#0055a5" />
    <rect x="11" width="10" height="32" fill="#ffffff" />
    <rect x="21" width="11" height="32" fill="#ef4135" />
  </svg>
);

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', nativeName: 'Español', icon: IconFlagSpain },
];
