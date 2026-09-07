import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Rajdhani, Inter, Fira_Code, JetBrains_Mono } from 'next/font/google';
import { siteViewport, siteMetadata } from '@/models/landing/site-metadata.model';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-display',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-code',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
});

export const viewport: Viewport = siteViewport;
export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`dark scroll-smooth ${inter.variable} ${rajdhani.variable} ${firaCode.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
