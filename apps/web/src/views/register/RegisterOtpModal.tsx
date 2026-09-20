'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowClockwise,
  EnvelopeSimple,
  WarningCircle,
  CircleNotch,
  X,
  Clock,
} from '@phosphor-icons/react';

interface RegisterOtpModalProps {
  isOpen: boolean;
  email: string;
  isVerifying: boolean;
  isResending: boolean;
  errorMessage: string | null;
  onVerify: (code: string) => void;
  onResend: () => void;
  onClose: () => void;
}

const OTP_LENGTH = 6;
const COUNTDOWN_SECONDS = 600; // 10 minutos de validez

export const RegisterOtpModal: React.FC<RegisterOtpModalProps> = ({
  isOpen,
  email,
  isVerifying,
  isResending,
  errorMessage,
  onVerify,
  onResend,
  onClose,
}) => {
  const reduceMotion = useReducedMotion();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timeLeft, setTimeLeft] = useState<number>(COUNTDOWN_SECONDS);
  const [canResendAfter, setCanResendAfter] = useState<number>(60);
  const [localError, setLocalError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reiniciar temporizador cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setDigits(Array(OTP_LENGTH).fill(''));
      setTimeLeft(COUNTDOWN_SECONDS);
      setCanResendAfter(60);
      setLocalError(null);
      // Autoenfoque al primer dígito
      window.setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Temporizador regresivo para validez general de 10 min
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Temporizador para habilitar el reenvío (60s)
  useEffect(() => {
    if (!isOpen || canResendAfter <= 0) return;
    const timer = window.setInterval(() => {
      setCanResendAfter((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isOpen, canResendAfter]);

  // Formato mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    const next = [...digits];
    next[index] = clean.slice(-1);
    setDigits(next);
    setLocalError(null);

    // Si aún hay casillas siguientes, avanzar
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Si completó los 6 dígitos, auto-verificar
    const fullCode = next.join('');
    if (fullCode.length === OTP_LENGTH) {
      onVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (!pasted) return;

    const chars = pasted.slice(0, OTP_LENGTH).split('');
    const next = [...digits];
    for (let i = 0; i < OTP_LENGTH; i++) {
      next[i] = chars[i] || '';
    }
    setDigits(next);
    setLocalError(null);

    // Enfocar la siguiente casilla vacía o el último
    const nextEmpty = next.findIndex((d) => !d);
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus();
    } else {
      inputRefs.current[OTP_LENGTH - 1]?.focus();
      onVerify(next.join(''));
    }
  };

  const handleManualSubmit = useCallback(() => {
    const code = digits.join('');
    if (code.length < OTP_LENGTH) {
      setLocalError(`Por favor ingresa los ${OTP_LENGTH} dígitos.`);
      return;
    }
    onVerify(code);
  }, [digits, onVerify]);

  const handleResendClick = () => {
    if (canResendAfter > 0 || isResending) return;
    setCanResendAfter(60);
    setDigits(Array(OTP_LENGTH).fill(''));
    setLocalError(null);
    onResend();
    window.setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const activeError = localError || errorMessage;
  const isCodeComplete = digits.every((d) => d.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="otp-modal-title"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="relative w-full max-w-md rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] text-center space-y-5 overflow-hidden"
          >
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mascota / Ícono de Seguridad */}
            <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-amber-500/20 blur-lg animate-pulse"
              />
              <Image
                src="/brand/koda-mascot-cartoon-2d.svg"
                alt="Koda código OTP"
                width={96}
                height={96}
                className="w-full h-full object-contain relative z-10 select-none"
              />
            </div>

            {/* Cabecera */}
            <div className="space-y-1.5 pt-1">
              <h2 id="otp-modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Ingresa tu código OTP
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
                Hemos enviado un código numérico de 6 dígitos a:
                <br />
                <strong className="text-amber-300 break-all">{email}</strong>
              </p>
            </div>

            {/* Error banner si existe */}
            {activeError && (
              <div
                role="alert"
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-left"
              >
                <WarningCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{activeError}</span>
              </div>
            )}

            {/* 6 Casillas OTP */}
            <div className="space-y-3">
              <div className="flex justify-center items-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    disabled={isVerifying}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    aria-label={`Dígito ${idx + 1} del código de verificación`}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-2xl font-black rounded-xl border transition-all outline-none select-all ${
                      digit
                        ? 'border-amber-400/80 bg-amber-500/10 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : 'border-slate-700 bg-slate-900/90 text-white hover:border-slate-600'
                    } focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                ))}
              </div>

              {/* Temporizador y vigencia */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400/80" />
                <span>
                  {timeLeft > 0 ? (
                    <>
                      El código expira en{' '}
                      <strong className="text-amber-300 font-mono">{formatTime(timeLeft)}</strong>
                    </>
                  ) : (
                    <span className="text-rose-400 font-semibold">El código ha expirado</span>
                  )}
                </span>
              </div>
            </div>

            {/* Botón principal de confirmación */}
            <button
              type="button"
              onClick={handleManualSubmit}
              disabled={!isCodeComplete || isVerifying || timeLeft <= 0}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.99] text-slate-950 font-black text-sm transition-all shadow-[0_10px_20px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isVerifying ? (
                <>
                  <CircleNotch className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verificando con Koda…</span>
                </>
              ) : (
                <span>Confirmar y Comenzar Aventura</span>
              )}
            </button>

            {/* Reenviar código y Cambiar Correo */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={handleResendClick}
                disabled={canResendAfter > 0 || isResending}
                className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <CircleNotch className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowClockwise className="w-3.5 h-3.5" />
                )}
                <span>
                  {canResendAfter > 0
                    ? `Reenviar código (${canResendAfter}s)`
                    : isResending
                    ? 'Reenviando…'
                    : 'Reenviar código OTP'}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                <EnvelopeSimple className="w-3.5 h-3.5" />
                <span>Corregir correo</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
