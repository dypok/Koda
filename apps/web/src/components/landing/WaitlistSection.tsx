'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { KodaMascot } from '../mascot/KodaMascot';

export const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('koda_waitlist_registered');
    if (saved === 'true') {
      setIsAlreadyRegistered(true);
      setStatus('success');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Por favor introduce un correo electrónico válido.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // Simulate registration with local persistence
    setTimeout(() => {
      try {
        localStorage.setItem('koda_waitlist_registered', 'true');
        localStorage.setItem('koda_waitlist_email', email.trim());
      } catch (err) {
        // Safe fallback if localStorage disabled
      }
      setStatus('success');
      setIsAlreadyRegistered(true);
    }, 600);
  };

  return (
    <section id="waitlist" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 p-8 sm:p-14 shadow-2xl backdrop-blur-2xl text-center relative">
          {/* Mascot in Celebrating / Welcoming Mood */}
          <div className="flex justify-center -mt-6 mb-4">
            <KodaMascot
              size={180}
              mood={status === 'success' ? 'celebrating' : 'happy'}
              interactive={true}
            />
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              Lanzamiento Q4 2026
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Sé de los primeros en probar Koda 🦊
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Estamos en la fase final de calibración pedagógica de los módulos de Python 3.12. Reserva tu cupo ahora y recibe <strong>acceso prioritario anticipado</strong> y una <strong>insignia exclusiva de Miembro Fundador</strong>.
            </p>

            {status === 'success' ? (
              /* Success State Card */
              <div className="mt-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 p-6 sm:p-8 space-y-3 animate-fadeIn shadow-xl shadow-emerald-500/10">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-1">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  ¡Ya estás en la lista de acceso prioritario! 🎉
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Hemos guardado tu lugar. Te enviaremos un correo exclusivo con tu enlace de acceso antes de la apertura pública general.
                </p>
                <div className="pt-2 text-xs text-amber-400 font-medium flex items-center justify-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-amber-400" />
                  Gracias por creer en una educación de programación sin frustraciones.
                </div>
              </div>
            ) : (
              /* Waitlist Subscription Form */
              <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      placeholder="tu.correo@ejemplo.com"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 px-6 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shrink-0"
                  >
                    {status === 'loading' ? (
                      'Guardando...'
                    ) : (
                      <>
                        Reservar Mi Lugar
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {status === 'error' && (
                  <p className="text-xs text-rose-400 font-medium text-left pl-1">
                    {errorMessage}
                  </p>
                )}

                <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Cero spam garantizado
                  </span>
                  <span>•</span>
                  <span>100% Gratuito</span>
                  <span>•</span>
                  <span>Cancela cuando quieras</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
