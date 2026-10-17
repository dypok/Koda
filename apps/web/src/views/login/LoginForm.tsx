'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Envelope, Lock, Eye, EyeSlash, CircleNotch, ArrowRight, CheckCircle, ShieldCheck } from '@phosphor-icons/react';
import { WipeButton } from '@/components/ui/wipe-button';
import { KodaLoadingScreen } from '@/components/ui/koda-loading-screen';
import { useAuthStore } from '@/stores/auth.store';
import { AuthService } from '@/services/auth/auth.service';
import { LoginSocialButtons } from './LoginSocialButtons';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const setUserSession = useAuthStore((s) => s.setUserSession);
  const loginAsAdmin = useAuthStore((s) => s.loginAsAdmin);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Escuchar tokens en el hash provenientes de OAuth (Google / GitHub)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;

    if (!hash) return;
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken) {
      setIsSubmitting(true);
      setError('');
      AuthService.verifySession(accessToken)
        .then((session) => {
          setUserSession(session, accessToken, refreshToken || undefined);
          // Limpiar hash de la barra de direcciones
          window.history.replaceState(null, '', window.location.pathname);
          if (!session.onboardingCompleted) {
            localStorage.removeItem('koda-register-progress');
            router.replace('/register');
          } else {
            router.replace('/');
          }
        })
        .catch((err: any) => {
          setError(err.message || 'No fue posible validar la sesión del proveedor externo.');
          setIsSubmitting(false);
        });
    }
  }, [router, setUserSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();

    // Soporte para credenciales de administrador (modo local o credenciales designadas)
    if (
      (cleanEmail === 'admin@koda.academy' || cleanEmail === 'admin@koda.dev' || cleanEmail === 'admin@admin.com') &&
      (password === 'admin' || password === 'admin123' || password === 'koda2026')
    ) {
      loginAsAdmin({ email: cleanEmail });
      router.replace('/');
      return;
    }

    try {
      const result = await AuthService.loginWithPassword(email, password);
      setUserSession(result.session, result.accessToken, result.refreshToken);
      const isUserAdmin =
        (result.session as any).role === 'admin' ||
        result.session.email.toLowerCase().includes('admin');

      if (!result.session.onboardingCompleted && !isUserAdmin) {
        router.replace('/register');
      } else {
        router.replace('/');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
      setIsSubmitting(false);
    }
  };

  const handleSocial = (provider: 'google' | 'github') => {
    try {
      setIsSubmitting(true);
      const url = AuthService.getOAuthRedirectUrl(provider);
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Error al conectar con proveedor social.');
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico arriba para enviarte el enlace de recuperación.');
      return;
    }
    setError('');
    setIsResetting(true);
    try {
      await AuthService.requestPasswordReset(email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Error al solicitar recuperación de contraseña.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {isSubmitting && (
        <KodaLoadingScreen
          title="Iniciando sesión..."
          subtitle="Validando tus credenciales y preparando tu entorno..."
          terminalHint="> auth :: autenticando"
        />
      )}
      <div className="space-y-1.5 text-left">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">¡Hola de nuevo!</h1>
        <p className="text-sm sm:text-base text-slate-400">Inicia sesión para continuar tu progreso en Koda.</p>
      </div>

      <LoginSocialButtons onSocial={handleSocial} disabled={isSubmitting} />

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {error && (
          <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        {resetSent && (
          <div role="status" className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Enlace de recuperación enviado. Revisa tu bandeja de entrada.</span>
          </div>
        )}

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">Correo electrónico</label>
          <div className="relative">
            <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="tu@correo.com"
              required
              disabled={isSubmitting}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700/70 rounded-xl text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              required
              disabled={isSubmitting}
              className="w-full pl-11 pr-11 py-3 bg-slate-900/80 border border-slate-700/70 rounded-xl text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-900 text-amber-500" />
            <span>Recordarme</span>
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isSubmitting}
            className="text-amber-400 hover:underline cursor-pointer bg-transparent border-none p-0 text-xs sm:text-sm"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <WipeButton type="submit" disabled={isSubmitting} className="w-full py-3.5 text-base gap-2 mt-2 font-bold">
          <span>Iniciar Sesión</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </WipeButton>
      </form>

      <div className="text-center text-xs sm:text-sm text-slate-400 pt-1">
        ¿No tienes una cuenta?{' '}
        <Link href="/register" className="text-amber-400 font-bold hover:underline">
          Regístrate gratis
        </Link>
      </div>

      <div className="pt-3 border-t border-slate-800/60">
        <button
          type="button"
          onClick={() => {
            setEmail('admin@koda.academy');
            setPassword('admin123');
            loginAsAdmin();
            router.replace('/');
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 text-xs font-mono text-slate-300 hover:text-amber-300 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Acceso Directo Administrador (Local Dev)</span>
        </button>
      </div>
    </div>
  );
};

