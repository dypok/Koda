import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://koda.app'),
  title: 'Koda 🦊 — Aprende a Programar en Python 3.12 como juegas',
  description:
    'La plataforma gamificada que transforma el aprendizaje de programación en un hábito diario. Domina Python 3.12 con micro-lecciones de 2 minutos, práctica inmediata en vivo y certificación oficial con código QR.',
  keywords: [
    'aprender python',
    'python 3.12',
    'duolingo programacion',
    'programacion desde cero',
    'curso interactivo python',
    'koda',
    'gamificacion',
    'aprender a programar',
  ],
  authors: [{ name: 'Equipo Koda' }],
  creator: 'Koda',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_LA',
    url: 'https://koda.app',
    title: 'Koda 🦊 — Aprende a Programar en Python 3.12 como juegas',
    description:
      'Micro-lecciones de 2 minutos, práctica interactiva en tu navegador y cero frustración. Únete a la lista de espera.',
    siteName: 'Koda',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'Mascota Koda el Zorro',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Koda 🦊 — Aprende Python 3.12 como juegas',
    description:
      'Micro-lecciones de 2 minutos, práctica interactiva en tu navegador y cero frustración. Acceso anticipado gratuito.',
    images: ['/icon.svg'],
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
