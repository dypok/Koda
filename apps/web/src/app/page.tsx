'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ComingSoonBanner } from '../components/landing/ComingSoonBanner';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { InteractivePreview } from '../components/landing/InteractivePreview';
import { MethodologySection } from '../components/landing/MethodologySection';
import { CurriculumSection } from '../components/landing/CurriculumSection';
import { WaitlistSection } from '../components/landing/WaitlistSection';
import { FaqSection } from '../components/landing/FaqSection';
import { Footer } from '../components/landing/Footer';
import { Sparkles, X } from 'lucide-react';

function LandingContent() {
  const searchParams = useSearchParams();
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  useEffect(() => {
    if (searchParams.get('notice') === 'coming-soon') {
      setShowNoticeModal(true);
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Top Prelanzamiento Banner */}
      <ComingSoonBanner />

      {/* 2. Sticky Navbar */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-1">
        {/* 3. Hero Section with PixiJS Mascot */}
        <HeroSection />

        {/* 4. Live Interactive Terminal Preview */}
        <InteractivePreview />

        {/* 5. Pedagogical Methodology & Comparison */}
        <MethodologySection />

        {/* 6. 12 Canonical Python Modules & Certificate Preview */}
        <CurriculumSection />

        {/* 7. Early Access Waitlist Form */}
        <WaitlistSection />

        {/* 8. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* 9. Institutional Footer */}
      <Footer />

      {/* Coming Soon Notice Modal (if redirected from /app or /learn) */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setShowNoticeModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-2xl shadow-inner">
              🦊
            </div>

            <h3 className="text-xl font-bold text-white">
              ¡Estamos casi listos!
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              El campus de aprendizaje de <strong>Koda</strong> está en su fase final de calibración pedagógica. Regístrate en la lista de espera para recibir tu pase de acceso prioritario el día del lanzamiento.
            </p>

            <button
              onClick={() => {
                setShowNoticeModal(false);
                const el = document.getElementById('waitlist');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              Unirme a la Lista de Espera
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <LandingContent />
    </Suspense>
  );
}
