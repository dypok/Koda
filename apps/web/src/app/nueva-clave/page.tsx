'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { KodaLogoSvg } from '@/components/landing/KodaLogoSvg';
import { WipeButton } from '@/components/ui/wipe-button';
import { AuthService } from '@/services/auth/auth.service';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sertfbduqivvjrmeblvh.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcnRmYmR1cWl2dmpybWVibHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDQ5ODUsImV4cCI6MjA1NzYyMDk4NX0.eWl1n5mCg1k5tGZ5Yx3Tz_6C3xI3k8qY3b7cW_7w_8E';

export default function NuevaClavePage() {
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Extraer token de recuperación desde el hash (#access_token=... o #token=...) o de la query (?token=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Revisar hash de URL (Supabase Auth redirige típicamente con hash)
    const hash = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;

    if (hash) {
      const hashParams = new URLSearchParams(hash);
      const accTok = hashParams.get('access_token');
      const tok = hashParams.get('token') || hashParams.get('token_hash');
      if (accTok) setAccessToken(accTok);
      if (tok) setToken(tok);
    }

    // 2. Revisar search params de URL (?token=...&email=...)
    const searchParams = new URLSearchParams(window.location.search);
    const qToken = searchParams.get('token') || searchParams.get('token_hash') || searchParams.get('code');
    const qEmail = searchParams.get('email');
    if (qToken) setToken(qToken);
    if (qEmail) setEmail(qEmail);
  }, []);

  // Validación de requisitos de seguridad de contraseña
  const validationCriteria = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[@$!%*?&#^()_\-]/.test(password),
      passwordsMatch: password.length > 0 && password === confirmPassword,
    };
  }, [password, confirmPassword]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (validationCriteria.minLength) score += 20;
    if (validationCriteria.hasUpper) score += 20;
    if (validationCriteria.hasLower) score += 20;
    if (validationCriteria.hasNumber) score += 20;
    if (validationCriteria.hasSpecial) score += 20;
    return score;
  }, [validationCriteria]);

  const isFormValid = useMemo(() => {
    return (
      validationCriteria.minLength &&
      validationCriteria.hasUpper &&
      validationCriteria.hasLower &&
      validationCriteria.hasNumber &&
      validationCriteria.hasSpecial &&
      validationCriteria.passwordsMatch
    );
  }, [validationCriteria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      // Si el enlace de recuperación entregó un access_token temporal de sesión
      if (accessToken) {
        const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ password }),
        });

        if (!updateRes.ok) {
          const errData = await updateRes.json().catch(() => ({}));
          const raw = errData?.msg || errData?.message || errData?.error_description || 'Error al actualizar contraseña.';
          throw new Error(raw.replace(/supabase/gi, '').trim());
        }
      } else if (token) {
        // Enviar al caso de uso de backend POST /api/v1/auth/reset-password
        await AuthService.resetPassword({
          token,
          newPassword: password,
          email: email || undefined,
        });
      } else {
        throw new Error('No se detectó un token de recuperación válido. Por favor, solicita un nuevo enlace.');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'No fue posible restablecer la contraseña. Solicita un nuevo enlace.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-8 overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      <HeroSkyBackground starCount={140} interactive={true} className="fixed inset-0 pointer-events-none -z-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo superior */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block transition-transform duration-200 hover:scale-105">
            <KodaLogoSvg className="h-10 w-auto mx-auto" />
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-white mt-4 font-mono">
            {isSuccess ? '¡Contraseña Actualizada!' : 'Crear Nueva Contraseña'}
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-mono">
            {isSuccess
              ? 'Tus credenciales han sido renovadas exitosamente.'
              : 'Ingresa y confirma tu nueva clave de acceso seguro.'}
          </p>
        </div>

        {/* Tarjeta principal */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60">
          {isSuccess ? (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-2">
                <p className="text-slate-300 text-sm leading-relaxed">
                  Ya puedes iniciar sesión en Koda utilizando tu nueva contraseña y continuar tu racha de aprendizaje.
                </p>
              </div>

              <div className="pt-2">
                <WipeButton
                  onClick={() => router.push('/login')}
                  className="w-full justify-center text-sm font-bold uppercase tracking-wider py-3.5"
                >
                  Iniciar Sesión
                </WipeButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-mono flex items-start gap-2.5">
                  <svg className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Nueva Contraseña */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Medidor de Fortaleza */}
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Fortaleza:</span>
                    <span
                      className={
                        strengthScore < 60
                          ? 'text-rose-400 font-bold'
                          : strengthScore < 100
                          ? 'text-amber-400 font-bold'
                          : 'text-emerald-400 font-bold'
                      }
                    >
                      {strengthScore < 60 ? 'Débil' : strengthScore < 100 ? 'Media' : 'Fuerte'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthScore < 60
                          ? 'bg-rose-500'
                          : strengthScore < 100
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${strengthScore}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Confirmar Contraseña */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                  Confirmar Contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  required
                  className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                />
              </div>

              {/* Checklist de Requisitos de Seguridad */}
              <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-1.5 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className={validationCriteria.minLength ? 'text-emerald-400' : 'text-slate-600'}>
                    {validationCriteria.minLength ? '✓' : '○'}
                  </span>
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={validationCriteria.hasUpper && validationCriteria.hasLower ? 'text-emerald-400' : 'text-slate-600'}>
                    {validationCriteria.hasUpper && validationCriteria.hasLower ? '✓' : '○'}
                  </span>
                  <span>Mayúscula y minúscula</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={validationCriteria.hasNumber ? 'text-emerald-400' : 'text-slate-600'}>
                    {validationCriteria.hasNumber ? '✓' : '○'}
                  </span>
                  <span>Al menos un número (0-9)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={validationCriteria.hasSpecial ? 'text-emerald-400' : 'text-slate-600'}>
                    {validationCriteria.hasSpecial ? '✓' : '○'}
                  </span>
                  <span>Carácter especial (@$!%*?&#^()_-)</span>
                </div>
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className={validationCriteria.passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}>
                      {validationCriteria.passwordsMatch ? '✓' : '✕'}
                    </span>
                    <span>Las contraseñas coinciden</span>
                  </div>
                )}
              </div>

              {/* Botón de Enviar */}
              <div className="pt-2">
                <WipeButton
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full justify-center text-sm font-bold uppercase tracking-wider py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Guardando nueva clave...' : 'Actualizar Contraseña'}
                </WipeButton>
              </div>
            </form>
          )}
        </div>

        {/* Enlace al login */}
        <div className="text-center mt-6 text-xs text-slate-500 font-mono">
          ¿Recordaste tu contraseña?{' '}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-4">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
