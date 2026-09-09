'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractivePreview } from '@/components/landing/InteractivePreview';
import { MethodologySection } from '@/components/landing/MethodologySection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';
import { LoginModal } from '@/components/landing/LoginModal';
import { StudentDashboardView } from '@/views/dashboard/StudentDashboardView';
import { useAuthStore } from '@/stores/auth.store';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, hasEverLoggedIn, hasHydrated, initAuth } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (hasHydrated && hasEverLoggedIn && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, hasEverLoggedIn, isAuthenticated, router]);

  if (!hasHydrated || (hasEverLoggedIn && !isAuthenticated)) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (isAuthenticated) {
    return <StudentDashboardView />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar onOpenLogin={() => setIsLoginModalOpen(true)} />
      <main className="flex-1">
        <HeroSection onOpenLogin={() => setIsLoginModalOpen(true)} />
        <InteractivePreview />
        <MethodologySection />
        <CtaSection onOpenLogin={() => setIsLoginModalOpen(true)} />
      </main>
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
