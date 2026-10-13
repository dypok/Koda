import React from 'react';
import { GameController, Terminal, Flame, Certificate } from '@phosphor-icons/react';

export interface ShowcaseSlide {
  id: string;
  tag: string;
  title: string;
  description: string;
  stat: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: 'gamified',
    tag: 'Metodología Koda',
    title: 'Aprende programación como juegas',
    description: 'Micro-lecciones interactivas con práctica inmediata. Sin teoría aburrida, código real desde el primer segundo.',
    stat: '+120 Desafíos interactivos',
    color: '#F59E0B',
    icon: GameController,
  },
  {
    id: 'terminal',
    tag: 'Entorno Integrado',
    title: 'Terminal interactiva en vivo',
    description: 'Escribe y ejecuta código en múltiples lenguajes directamente en tu navegador sin instalar herramientas ni lidiar con dependencias.',
    stat: 'Ejecución Multi-lenguaje',
    color: '#38BDF8',
    icon: Terminal,
  },
  {
    id: 'streak',
    tag: 'Hábito Diario',
    title: 'Construye tu racha imparable',
    description: 'Gamificación inspirada en Duolingo: mantén encendida tu llama, compite sanamente y acumula puntos de XP.',
    stat: 'Rachas y Multiplicadores',
    color: '#F97316',
    icon: Flame,
  },
  {
    id: 'cert',
    tag: 'Acreditación',
    title: 'Certificación oficial verificable',
    description: 'Demuestra tus habilidades al completar cada ruta con un certificado digital con código QR de validación pública.',
    stat: 'Verificación QR 24/7',
    color: '#10B981',
    icon: Certificate,
  },
];
