'use client';

import React, { useState } from 'react';
import { CircleNotch } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface ProfileSocialAuthProps {
  onSocialClick?: (provider: 'google' | 'github') => void;
  disabled?: boolean;
}

const GoogleMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
    <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.2c1.9-1.7 3-4.3 3-7.5Z" fill="#4285F4" />
    <path d="M12 22c2.7 0 5-1 6.6-2.5l-3.2-2.6c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.7A10 10 0 0 0 12 22Z" fill="#34A853" />
    <path d="M6.4 13.8A6 6 0 0 1 6 12c0-.6.1-1.2.4-1.8V7.5H3.1a10 10 0 0 0 0 9L6.4 13.8Z" fill="#FBBC05" />
    <path d="M12 6.1c1.5 0 2.8.5 3.8 1.5L18.7 5A10 10 0 0 0 3.1 7.5l3.3 2.7C7.2 7.9 9.4 6.1 12 6.1Z" fill="#EA4335" />
  </svg>
);

const GithubMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
  </svg>
);

export const ProfileSocialAuth: React.FC<ProfileSocialAuthProps> = ({
  onSocialClick,
  disabled = false,
}) => {
  const [loading, setLoading] = useState<'google' | 'github' | null>(null);
  const [notice, setNotice] = useState(false);

  const handle = (provider: 'google' | 'github') => {
    if (disabled || loading) return;
    setLoading(provider);
    setNotice(false);
    window.setTimeout(() => {
      setLoading(null);
      setNotice(true);
      onSocialClick?.(provider);
    }, 900);
  };

  const btn = (provider: 'google' | 'github', label: string, Mark: React.FC<{ className?: string }>, markCls: string) => {
    const busy = loading === provider;
    const locked = disabled || (loading !== null && !busy);
    return (
      <button
        type="button"
        onClick={() => handle(provider)}
        disabled={locked}
        aria-busy={busy}
        className="flex items-center justify-center gap-2.5 py-2.5 px-4 min-h-[44px] rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/40 text-slate-200 text-xs font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? (
          <CircleNotch aria-hidden="true" className="w-4 h-4 animate-spin" />
        ) : (
          <Mark className={cn('w-4 h-4', markCls)} />
        )}
        <span>{busy ? 'Conectando…' : label}</span>
      </button>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {btn('google', 'Continuar con Google', GoogleMark, '')}
        {btn('github', 'Continuar con GitHub', GithubMark, 'text-slate-100')}
      </div>

      {notice && (
        <p role="status" className="text-center text-[11px] text-amber-300/90">
          El acceso social llegará pronto — por ahora usa tu correo 🦊
        </p>
      )}

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <span className="relative px-3 bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          o con tu correo
        </span>
      </div>
    </div>
  );
};
