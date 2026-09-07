'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { InteractivePreview } from '../components/landing/InteractivePreview';
import { MethodologySection } from '../components/landing/MethodologySection';
import { CurriculumSection } from '../components/landing/CurriculumSection';
import { CtaSection } from '../components/landing/CtaSection';
import { FaqSection } from '../components/landing/FaqSection';
import { Footer } from '../components/landing/Footer';
import { LoginModal } from '../components/landing/LoginModal';

export default function HomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLogin = () => setIsLoginModalOpen(true);
  const closeLogin = () => setIsLoginModalOpen(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Sticky Navbar with Iniciar Sesión */}
      <Navbar onOpenLogin={openLogin} />

      {/* Main Landing Sections */}
      <main className="flex-1">
        {/* 2. Hero Section with PixiJS Mascot */}
        <HeroSection onOpenLogin={openLogin} />

        {/* 3. Live Interactive Terminal Preview */}
        <InteractivePreview />

        {/* 4. Pedagogical Methodology & Comparison */}
        <MethodologySection />

        {/* 5. 12 Canonical Python Modules & Certificate Preview */}
        <CurriculumSection onOpenLogin={openLogin} />

        {/* 6. Frequently Asked Questions */}
        <FaqSection />

        {/* 7. Final Call to Action */}
        <CtaSection onOpenLogin={openLogin} />
      </main>

      {/* 8. Institutional Footer */}
      <Footer />

      {/* Login / Próximamente Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLogin} />
    </div>
  );
}
