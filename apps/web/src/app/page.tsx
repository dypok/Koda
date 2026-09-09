'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractivePreview } from '@/components/landing/InteractivePreview';
import { MethodologySection } from '@/components/landing/MethodologySection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';
import { StudentRoadmapView } from '@/views/roadmap/StudentRoadmapView';
import { useAuthStore } from '@/stores/auth.store';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, hasEverLoggedIn, hasHydrated, initAuth } = useAuthStore();

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
    return <StudentRoadmapView />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <InteractivePreview />
        <MethodologySection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
