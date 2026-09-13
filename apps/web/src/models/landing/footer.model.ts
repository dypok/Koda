import React from 'react';
import {
  Instagram,
  Music2,
  Twitter,
  Youtube,
  Linkedin,
  Newspaper,
} from 'lucide-react';
import { InfoModalTab } from '@/models/landing/info-modal.model';

export interface FooterLinkItem {
  id: string;
  label: string;
  tab: InfoModalTab;
  icon?: React.ComponentType<{ className?: string }>;
}

export const FOOTER_SUPPORT_LINKS: FooterLinkItem[] = [
  { id: 'faqs', label: 'Preguntas Frecuentes (FAQs)', tab: 'faqs' },
  { id: 'schools', label: 'Koda para Escuelas', tab: 'schools' },
  { id: 'tests', label: 'Certificación & Evaluaciones', tab: 'tests' },
];

export const FOOTER_LEGAL_LINKS: FooterLinkItem[] = [
  { id: 'guidelines', label: 'Normas de la Comunidad', tab: 'guidelines' },
  { id: 'terms', label: 'Términos de Servicio', tab: 'terms' },
  { id: 'privacy', label: 'Política de Privacidad', tab: 'privacy' },
  { id: 'data-rights', label: 'No Vender ni Compartir mi Información', tab: 'data-rights' },
];

export const FOOTER_SOCIAL_LINKS: FooterLinkItem[] = [
  { id: 'blog', label: 'Blog Oficial', tab: 'social', icon: Newspaper },
  { id: 'instagram', label: 'Instagram', tab: 'social', icon: Instagram },
  { id: 'tiktok', label: 'TikTok', tab: 'social', icon: Music2 },
  { id: 'x', label: 'Twitter / X', tab: 'social', icon: Twitter },
  { id: 'youtube', label: 'YouTube', tab: 'social', icon: Youtube },
  { id: 'linkedin', label: 'LinkedIn', tab: 'social', icon: Linkedin },
];
