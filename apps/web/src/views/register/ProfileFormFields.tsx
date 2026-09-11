'use client';

import React from 'react';
import { IconUser, IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';

interface ProfileFormFieldsProps {
  fullName: string;
  email: string;
  password: string;
  showPassword: boolean;
  onFullNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onToggleShowPassword: () => void;
  disabled?: boolean;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  fullName, email, password, showPassword,
  onFullNameChange, onEmailChange, onPasswordChange, onToggleShowPassword,
  disabled = false,
}) => {
  const isPassValid = password.length >= 8;

  return (
    <div className="w-full space-y-3.5">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre completo o alias</label>
        <div className="relative">
          <IconUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            disabled={disabled}
            placeholder="Ej: Ada Lovelace"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Correo electrónico</label>
        <div className="relative">
          <IconMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={disabled}
            placeholder="tu@correo.com"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-slate-300">Contraseña</label>
          <span className={`text-[11px] font-medium ${isPassValid ? 'text-emerald-400' : 'text-slate-400'}`}>
            {password.length > 0 ? `${password.length}/8 caracteres` : 'Mín. 8 caracteres'}
          </span>
        </div>
        <div className="relative">
          <IconLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            disabled={disabled}
            placeholder="Crea una contraseña segura"
            className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={onToggleShowPassword}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
          >
            {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center pt-1 leading-relaxed">
        Al registrarte aceptas nuestros{' '}
        <span className="text-amber-400/90 hover:underline cursor-pointer">Términos de Servicio</span> y{' '}
        <span className="text-amber-400/90 hover:underline cursor-pointer">Política de Privacidad</span>.
      </p>
    </div>
  );
};
