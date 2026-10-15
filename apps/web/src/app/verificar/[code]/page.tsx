'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { EvaluationService } from '@/services/learning/evaluation.service';
import type { CertificateVerificationResponse } from '@koda/types';
import {
  ShieldCheck,
  XCircle,
  DownloadSimple,
  CalendarBlank,
  User,
  GraduationCap,
  IdentificationBadge,
  ShareNetwork,
  Check,
} from '@phosphor-icons/react';

interface VerifyCertificatePageProps {
  params?: Promise<{ code: string }> | { code: string };
}

export default function VerifyCertificatePage(props: VerifyCertificatePageProps) {
  const routeParams = useParams<{ code: string }>();
  const [resolvedCode, setResolvedCode] = useState<string>(() => routeParams?.code || '');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<CertificateVerificationResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function resolveCode() {
      if (routeParams?.code) {
        setResolvedCode(routeParams.code);
        return;
      }
      if (props.params) {
        const p = await Promise.resolve(props.params);
        if (p?.code) setResolvedCode(p.code);
      }
    }
    resolveCode();
  }, [props.params, routeParams?.code]);

  useEffect(() => {
    if (!resolvedCode) return;

    async function fetchCertificate() {
      try {
        setLoading(true);
        setError(null);
        const data = await EvaluationService.verifyCertificate(resolvedCode);
        setCertificate(data);
      } catch (err: any) {
        console.error('Error verificando certificado:', err);
        setError(err?.message || 'Certificado no encontrado o inválido.');
      } finally {
        setLoading(false);
      }
    }

    fetchCertificate();
  }, [resolvedCode]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Header institucional */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-slate-950 font-black font-mono text-sm shadow-[0_0_15px_rgba(255,106,0,0.5)]">
              K
            </div>
            <span className="font-display font-black text-lg tracking-wider text-white group-hover:text-orange-400 transition-colors">
              KODA<span className="text-orange-500">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700/60 text-xs font-mono text-slate-400">
            <ShieldCheck weight="bold" className="w-4 h-4 text-emerald-400" />
            <span>Verificación Oficial</span>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          {loading ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center backdrop-blur-xl shadow-2xl">
              <div className="inline-block w-10 h-10 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
              <p className="font-mono text-sm text-slate-400 tracking-wider">
                CONSULTANDO REGISTRO CRIPTOGRÁFICO…
              </p>
            </div>
          ) : error || !certificate || !certificate.is_valid ? (
            <div className="bg-slate-900/80 border border-rose-900/50 rounded-3xl p-8 md:p-12 text-center backdrop-blur-xl shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto mb-6">
                <XCircle weight="duotone" className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 font-display">
                Certificado No Encontrado
              </h1>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
                El código <code className="text-rose-400 font-mono font-bold bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/50">{resolvedCode || 'vacío'}</code> no corresponde a un certificado válido o ha sido revocado.
              </p>
              <Link
                href="/"
                className="inline-flex min-h-[44px] items-center rounded-xl bg-slate-800 px-6 font-mono text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
              >
                Volver a Koda Academy
              </Link>
            </div>
          ) : (
            <div className="relative isolate">
              {/* Glow decorativo de fondo */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-600/30 via-orange-500/20 to-indigo-600/30 blur-xl opacity-70 -z-10" />

              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl space-y-8">
                {/* Insignia de validez */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck weight="fill" className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        <span>Certificado Auténtico y Válido</span>
                      </div>
                      <h2 className="text-lg font-bold text-white font-display">
                        Koda Academy Credentials
                      </h2>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-orange-400 tracking-wider">
                    {certificate.code}
                  </div>
                </div>

                {/* Datos del estudiante y credencial */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
                      <User weight="bold" className="w-3.5 h-3.5 text-orange-400" />
                      <span>Titular Certificado</span>
                    </div>
                    <div className="text-base font-bold text-white">
                      {certificate.holder_name}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
                      <GraduationCap weight="bold" className="w-3.5 h-3.5 text-orange-400" />
                      <span>Programa Completado</span>
                    </div>
                    <div className="text-base font-bold text-white">
                      {certificate.language_name}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
                      <IdentificationBadge weight="bold" className="w-3.5 h-3.5 text-orange-400" />
                      <span>Identificación</span>
                    </div>
                    <div className="text-sm font-mono font-semibold text-slate-300">
                      {certificate.holder_document_masked || 'Verificado vía Koda Auth'}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider">
                      <CalendarBlank weight="bold" className="w-3.5 h-3.5 text-orange-400" />
                      <span>Fecha de Emisión</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-300">
                      {formatDate(certificate.issued_at)}
                    </div>
                  </div>
                </div>

                {/* Acciones principales: Descarga y Compartir */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-mono font-bold text-slate-200 hover:bg-slate-700 transition"
                  >
                    {copied ? (
                      <>
                        <Check weight="bold" className="w-4 h-4 text-emerald-400" />
                        <span>Enlace Copiado</span>
                      </>
                    ) : (
                      <>
                        <ShareNetwork weight="bold" className="w-4 h-4" />
                        <span>Compartir Enlace</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`/api/v1/certificates/${certificate.code}/pdf`}
                    download
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 text-xs font-mono font-black text-slate-950 tracking-wider border-t-2 border-amber-300 border-b-4 border-orange-800 shadow-[0_4px_0_#9a3412,0_8px_16px_rgba(255,106,0,0.35)] hover:brightness-110 active:border-b-0 active:translate-y-1 active:shadow-none transition-all"
                  >
                    <DownloadSimple weight="bold" className="w-4 h-4" />
                    <span>DESCARGAR PDF OFICIAL</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-4 text-center text-xs font-mono text-slate-500">
        <p>Koda Academy · Sistema Criptográfico de Emisión y Custodia de Títulos Digitales</p>
      </footer>
    </div>
  );
}
