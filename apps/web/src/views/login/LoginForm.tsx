'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Envelope, Lock, Eye, EyeSlash, CircleNotch, ArrowRight } from '@phosphor-icons/react';
import { GradientButton } from '@/components/ui/gradient-button';
import { useAuthStore } from '@/stores/auth.store';
import { LoginSocialButtons } from './LoginSocialButtons';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const loginSocial = useAuthStore((s) => s.loginSocial);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Ingresa tu correo y contraseña.'); return; }
    setError(''); setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 550));
    login(email); setIsSubmitting(false); router.replace('/app/ruta');
  };

  const handleSocial = async (provider: 'google' | 'github') => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 450));
    loginSocial(provider); setIsSubmitting(false); router.replace('/app/ruta');
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="space-y-1.5 text-left">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">¡Hola de nuevo!</h1>
        <p className="text-sm sm:text-base text-slate-400">Inicia sesión para continuar tu progreso en Koda.</p>
      </div>

      <LoginSocialButtons onSocial={handleSocial} disabled={isSubmitting} />

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {error && <div className="text-xs text-rose-400 font-medium">{error}</div>}

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">Correo electrónico</label>
          <div className="relative">
            <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com" required
              className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700/70 rounded-xl text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" required
              className="w-full pl-11 pr-11 py-3 bg-slate-900/80 border border-slate-700/70 rounded-xl text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
              {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-amber-500" />
            <span>Recordarme</span>
          </label>
          <span className="text-amber-400 hover:underline cursor-pointer">¿Olvidaste tu contraseña?</span>
        </div>

        <GradientButton type="submit" disabled={isSubmitting} className="w-full py-3.5 text-base gap-2 mt-2 font-bold">
          {isSubmitting ? <><CircleNotch className="w-4 h-4 animate-spin stroke-[2.5]" /><span>Iniciando...</span></> : <><span>Iniciar Sesión</span><ArrowRight className="w-4 h-4 stroke-[2.5]" /></>}
        </GradientButton>
      </form>

      <div className="text-center text-xs sm:text-sm text-slate-400 pt-1">
        ¿No tienes una cuenta? <Link href="/register" className="text-amber-400 font-bold hover:underline">Regístrate gratis</Link>
      </div>
    </div>
  );
};
