'use client';

import React from 'react';
import { GoogleLogo, GithubLogo } from '@phosphor-icons/react';

interface LoginSocialButtonsProps {
  onSocial: (provider: 'google' | 'github') => void;
  disabled?: boolean;
}

export const LoginSocialButtons: React.FC<LoginSocialButtonsProps> = ({ onSocial, disabled }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSocial('google')}
          disabled={disabled}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-bold text-slate-200 transition-all active:scale-[0.985]"
        >
          <GoogleLogo className="w-4 h-4 text-rose-400" />
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => onSocial('github')}
          disabled={disabled}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-bold text-slate-200 transition-all active:scale-[0.985]"
        >
          <GithubLogo className="w-4 h-4 text-slate-100" />
          <span>GitHub</span>
        </button>
      </div>

      <div className="relative flex items-center justify-center">
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
