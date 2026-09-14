'use client';

import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { InteractivePreview } from '@/components/landing/InteractivePreview';
import { MethodologySection } from '@/components/landing/MethodologySection';
import { Footer } from '@/components/landing/Footer';
import { LenisProvider } from '@/components/landing/LenisProvider';
import { SectionSnap } from '@/components/landing/SectionSnap';
import { ScrollProgress } from '@/components/landing/ScrollProgress';
import { AnnouncementBar } from '@/components/landing/AnnouncementBar';
import { StickyMobileCta } from '@/components/landing/StickyMobileCta';
import { ExitIntentModal } from '@/components/landing/ExitIntentModal';
import { TestimonialsSection } from '@/views/landing/conversion/TestimonialsSection';
import { WorldMap } from '@/views/landing/conversion/WorldMap';
import { PricingSection } from '@/views/landing/conversion/PricingSection';
import { CertificateSection } from '@/views/landing/conversion/CertificateSection';
import { GiantMarquee } from '@/components/landing/GiantMarquee';
import { WaveDivider } from '@/components/landing/WaveDivider';
import { CinematicFinale } from '@/components/landing/CinematicFinale';
import { Preloader } from '@/components/landing/Preloader';
import { AuroraProvider } from '@/components/landing/AuroraProvider';
import { GlowParallax } from '@/components/landing/GlowParallax';
import { RouteThread } from '@/components/landing/RouteThread';
import { ActTheme } from '@/components/landing/ActTheme';
import dynamic from 'next/dynamic';

const CosmicBackground = dynamic(
  () => import('@/components/landing/CosmicBackground').then((m) => m.CosmicBackground),
  { ssr: false }
);
import { KodaGuide } from '@/components/landing/KodaGuide';
import { PartyMode } from '@/components/landing/PartyMode';

export default function HomePage() {
  return (
    <LenisProvider>
      <SectionSnap />
      <ScrollProgress />
      <Preloader />
      <AuroraProvider />
      <GlowParallax />
      <RouteThread />
      <ActTheme />
      <CosmicBackground />
      <KodaGuide />
      <div aria-hidden="true" className="koda-grain" />
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <div className="relative h-[200vh]">
            <div className="sticky top-0 h-screen overflow-hidden">
              <HeroSection />
            </div>
          </div>
          <div className="relative z-10 bg-slate-950 shadow-[0_-24px_60px_rgba(0,0,0,0.6)]">
          <GiantMarquee />
          <InteractivePreview />
          <MethodologySection />
          <WaveDivider />
          <TestimonialsSection />
          <WorldMap />
          <PricingSection />
          <CertificateSection />
          <CinematicFinale />
          </div>
        </main>
        <Footer />
        <StickyMobileCta />
        <ExitIntentModal />
        <PartyMode />
      </div>
    </LenisProvider>
  );
}
