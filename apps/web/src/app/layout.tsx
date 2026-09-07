import type { Metadata, Viewport } from 'next';
import { Rajdhani, Inter, Fira_Code, JetBrains_Mono } from 'next/font/google';
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

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://koda.app'),
  title: 'KodaAcademy — Aprende a Programar como juegas',
  description:
    'Plataforma interactiva de aprendizaje de programación con micro-lecciones prácticas, ejecución de código en vivo y certificación oficial con código QR. Track inaugural: Python 3.12.',
  keywords: [
    'kodaacademy',
    'koda academy',
    'aprender a programar',
    'plataforma interactiva de programacion',
    'aprender python',
    'python 3.12',
    'cursos de programacion',
    'koda',
    'gamificacion educativa',
    'certificacion de programacion',
  ],
  authors: [{ name: 'Equipo KodaAcademy' }],
  creator: 'KodaAcademy',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_LA',
    url: 'https://koda.app',
    title: 'KodaAcademy — Aprende a Programar como juegas',
    description:
      'Plataforma interactiva de programación con micro-lecciones de práctica inmediata y certificación digital. Track inaugural: Python 3.12.',
    siteName: 'KodaAcademy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KodaAcademy — Plataforma Interactiva de Programación',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KodaAcademy — Aprende a Programar como juegas',
    description:
      'Plataforma interactiva de programación con micro-lecciones de práctica inmediata y certificación digital. Track inaugural: Python 3.12.',
    images: ['/og-image.png'],
  },
};

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
