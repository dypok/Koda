'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeroSkyBackground } from '@/components/landing/HeroSkyBackground';
import { KodaLogoSvg } from '@/components/landing/KodaLogoSvg';
import { WipeButton } from '@/components/ui/wipe-button';
import { DiagnosticTestModal } from '@/views/diagnostic/DiagnosticTestModal';
import { DiagnosticResultResponse } from '@/services/learning/diagnostic.service';
import { useAuthStore } from '@/stores/auth.store';

interface LevelOption {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  isBeginner: boolean;
}

const LEVEL_OPTIONS: LevelOption[] = [
  {
    id: 'beginner',
    title: 'Principiante Absoluto',
    subtitle: 'Primera vez programando. Comenzarás desde los fundamentos de Python.',
    badge: 'Módulo 01',
    isBeginner: true,
  },
  {
    id: 'medium',
    title: 'Intermedio',
    subtitle: 'Conozco variables, tipos y operadores básicos en programación.',
    badge: 'Diagnóstico B1',
    isBeginner: false,
  },
  {
    id: 'semi_professional',
    title: 'Semi-Profesional',
    subtitle: 'Domino estructuras de control, bucles y funciones.',
    badge: 'Diagnóstico B1 + B2',
    isBeginner: false,
  },
  {
    id: 'professional',
    title: 'Profesional',
    subtitle: 'Experiencia previa con estructuras de datos complejas y algoritmos.',
    badge: 'Diagnóstico Avanzado',
    isBeginner: false,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [selectedLevelId, setSelectedLevelId] = useState<string>('beginner');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResultResponse | null>(null);

  const selectedOption = LEVEL_OPTIONS.find((opt) => opt.id === selectedLevelId) || LEVEL_OPTIONS[0];

  const handleStartPath = (targetModuleId?: string) => {
    // Si viene de evaluación o selección, guardar en preferencias y navegar a la ruta
    router.push('/');
  };

  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 overflow-x-hidden font-mono selection:bg-amber-500/30 selection:text-amber-200">
      <HeroSkyBackground starCount={140} interactive={true} className="fixed inset-0 pointer-events-none -z-10" />

      <div className="w-full max-w-2xl relative z-10 space-y-8 my-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block transition-transform duration-200 hover:scale-105">
            <KodaLogoSvg className="h-10 w-auto mx-auto" />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>Onboarding Pedagógico</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            ¿Cuál es tu nivel en programación?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Calibraremos tu ruta de aprendizaje para recomendarte el punto de partida ideal sin repetir conceptos que ya dominas.
          </p>
        </div>

        {/* Tarjetas de Nivel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LEVEL_OPTIONS.map((option) => {
            const isSelected = selectedLevelId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedLevelId(option.id)}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-xl shadow-amber-500/10 ring-1 ring-amber-500'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {option.badge}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-amber-400 bg-amber-500' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </div>
                </div>

                <div className="text-base font-bold text-white mb-1">
                  {option.title}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed font-sans">
                  {option.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Banner de acción según nivel seleccionado */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          {selectedOption.isBeginner ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                ¡Perfecto! Iniciarás en el <strong>Módulo 01: Fundamentos de Python</strong> con explicaciones paso a paso y práctica inmediata.
              </p>
              <WipeButton
                onClick={() => handleStartPath('py_mod_01')}
                className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                Comenzar Ruta desde M01
              </WipeButton>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Has indicado experiencia previa. Puedes realizar la <strong>Evaluación Diagnóstica de 12 preguntas</strong> para desbloquear módulos iniciales con 3 estrellas (⭐⭐⭐) y saltar directamente al Módulo 04 o 07.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <WipeButton
                  onClick={() => setIsDiagnosticOpen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider"
                >
                  ⚡ Realizar Test Diagnóstico (12 preguntas)
                </WipeButton>

                <button
                  type="button"
                  onClick={() => handleStartPath('py_mod_01')}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Omitir y empezar desde M01
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal del Test Diagnóstico */}
      <DiagnosticTestModal
        isOpen={isDiagnosticOpen}
        declaredLevel={selectedLevelId}
        languageSlug="python"
        userToken={token || undefined}
        onClose={() => setIsDiagnosticOpen(false)}
        onComplete={(res) => {
          setDiagnosticResult(res);
          setIsDiagnosticOpen(false);
          handleStartPath(res.recommendedModuleId);
        }}
        onSkip={() => {
          setIsDiagnosticOpen(false);
          handleStartPath('py_mod_01');
        }}
      />
    </div>
  );
}
