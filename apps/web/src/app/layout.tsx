import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://koda.app'),
  title: 'KodaAcademy — Aprende a Programar en Python 3.12 como juegas',
  description:
    'La plataforma interactiva que transforma el aprendizaje de programación en un hábito diario. Domina Python 3.12 con micro-lecciones de 2 minutos, práctica inmediata en vivo y certificación oficial con código QR.',
  keywords: [
    'kodaacademy',
    'koda academy',
    'aprender python',
    'python 3.12',
    'duolingo programacion',
    'programacion desde cero',
    'curso interactivo python',
    'koda',
    'gamificacion',
    'aprender a programar',
  ],
  authors: [{ name: 'Equipo KodaAcademy' }],
  creator: 'KodaAcademy',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_LA',
    url: 'https://koda.app',
    title: 'KodaAcademy — Aprende a Programar en Python 3.12 como juegas',
    description:
      'Micro-lecciones de 2 minutos, práctica interactiva en tu navegador y cero frustración. Certificación oficial con código QR.',
    siteName: 'KodaAcademy',
    images: [
      {
        url: '/logo.png',
        width: 680,
        height: 680,
        alt: 'Logo Oficial KodaAcademy',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'KodaAcademy — Aprende Python 3.12 como juegas',
    description:
      'Micro-lecciones de 2 minutos, práctica interactiva en tu navegador y cero frustración.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
