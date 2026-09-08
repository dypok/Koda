import React from 'react';
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconArticle,
} from '@tabler/icons-react';
import { InfoModalTab } from '@/components/landing/InfoModal';

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
  { id: 'blog', label: 'Blog Oficial', tab: 'social', icon: IconArticle },
  { id: 'instagram', label: 'Instagram', tab: 'social', icon: IconBrandInstagram },
  { id: 'tiktok', label: 'TikTok', tab: 'social', icon: IconBrandTiktok },
  { id: 'x', label: 'Twitter / X', tab: 'social', icon: IconBrandX },
  { id: 'youtube', label: 'YouTube', tab: 'social', icon: IconBrandYoutube },
  { id: 'linkedin', label: 'LinkedIn', tab: 'social', icon: IconBrandLinkedin },
];
