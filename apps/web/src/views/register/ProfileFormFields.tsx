'use client';

import React from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileFormFieldsProps {
  fullName: string;
  email: string;
  password: string;
  showPassword: boolean;
  errors: { fullName: string | null; email: string | null; password: string | null };
  passwordStrength: number;
  onFullNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onToggleShowPassword: () => void;
  onBlurField: (field: 'fullName' | 'email' | 'password') => void;
  disabled?: boolean;
}

const STRENGTH_LABEL = ['', 'Débil', 'Aceptable', 'Fuerte', 'Excelente'];
const STRENGTH_COLOR = ['', 'bg-rose-500', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-300'];

const inputCls = (invalid: boolean) =>
  cn(
    'w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border rounded-xl text-sm text-white placeholder:text-slate-500',
    'focus:outline-none focus:ring-1 min-h-[44px]',
    invalid
      ? 'border-rose-500/70 focus:border-rose-400 focus:ring-rose-400/40'
      : 'border-slate-700/70 focus:border-amber-500 focus:ring-amber-500'
  );

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  fullName, email, password, showPassword, errors, passwordStrength,
  onFullNameChange, onEmailChange, onPasswordChange, onToggleShowPassword, onBlurField,
  disabled = false,
}) => (
  <div className="w-full space-y-3.5">
    <div>
      <label htmlFor="register-fullname" className="block text-xs font-semibold text-slate-300 mb-1">
        Nombre completo o alias
      </label>
      <div className="relative">
        <User aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          id="register-fullname"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          onBlur={() => onBlurField('fullName')}
          disabled={disabled}
          placeholder="Ej: Ada Lovelace"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? 'register-fullname-error' : undefined}
          className={inputCls(Boolean(errors.fullName))}
        />
      </div>
      {errors.fullName && (
        <p id="register-fullname-error" role="alert" className="mt-1 text-[11px] text-rose-400">
          {errors.fullName}
        </p>
      )}
    </div>

    <div>
      <label htmlFor="register-email" className="block text-xs font-semibold text-slate-300 mb-1">
        Correo electrónico
      </label>
      <div className="relative">
        <Mail aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onBlur={() => onBlurField('email')}
          disabled={disabled}
          placeholder="tu@correo.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
          className={inputCls(Boolean(errors.email))}
        />
      </div>
      {errors.email && (
        <p id="register-email-error" role="alert" className="mt-1 text-[11px] text-rose-400">
          {errors.email}
        </p>
      )}
    </div>

    <div>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor="register-password" className="text-xs font-semibold text-slate-300">
          Contraseña
        </label>
        <span className={cn('text-[11px] font-medium', password ? 'text-slate-300' : 'text-slate-400')}>
          {password ? `Fuerza: ${STRENGTH_LABEL[passwordStrength] || 'Muy débil'}` : 'Mín. 8 caracteres'}
        </span>
      </div>
      <div className="relative">
        <Lock aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          id="register-password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          onBlur={() => onBlurField('password')}
          disabled={disabled}
          placeholder="Crea una contraseña segura"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'register-password-error' : 'register-password-strength'}
          className={cn(inputCls(Boolean(errors.password)), 'pr-10')}
        />
        <button
          type="button"
          onClick={onToggleShowPassword}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={showPassword}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-slate-400 hover:text-slate-200"
        >
          {showPassword ? <EyeOff aria-hidden="true" className="w-4 h-4" /> : <Eye aria-hidden="true" className="w-4 h-4" />}
        </button>
      </div>
      <div
        id="register-password-strength"
        role="meter"
        aria-valuenow={passwordStrength}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Fuerza de la contraseña"
        className="mt-1.5 flex gap-1"
      >
        {[1, 2, 3, 4].map((level) => (
          <span
            key={level}
            aria-hidden="true"
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              passwordStrength >= level ? STRENGTH_COLOR[passwordStrength] : 'bg-slate-800'
            )}
          />
        ))}
      </div>
      {errors.password && (
        <p id="register-password-error" role="alert" className="mt-1 text-[11px] text-rose-400">
          {errors.password}
        </p>
      )}
    </div>

    <p className="text-[11px] text-slate-400 text-center pt-1 leading-relaxed">
      Al registrarte aceptas nuestros Términos de Servicio y Política de Privacidad
      (disponibles tras el lanzamiento).
    </p>
  </div>
);
