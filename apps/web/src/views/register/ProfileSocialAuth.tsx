'use client';

import React from 'react';
import { IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react';

interface ProfileSocialAuthProps {
  onSocialClick?: (provider: 'google' | 'github') => void;
  disabled?: boolean;
}

export const ProfileSocialAuth: React.FC<ProfileSocialAuthProps> = ({
  onSocialClick,
  disabled = false,
}) => {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSocialClick?.('google')}
          disabled={disabled}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/40 text-slate-200 text-xs font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] disabled:opacity-50"
        >
          <IconBrandGoogle className="w-4 h-4 text-rose-400" />
          <span>Continuar con Google</span>
        </button>

        <button
          type="button"
          onClick={() => onSocialClick?.('github')}
          disabled={disabled}
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-amber-500/40 text-slate-200 text-xs font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] disabled:opacity-50"
        >
          <IconBrandGithub className="w-4 h-4 text-slate-100" />
          <span>Continuar con GitHub</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <span className="relative px-3 bg-[#0B0F19] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          o con tu correo
        </span>
      </div>
    </div>
  );
};
