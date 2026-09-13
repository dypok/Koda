import React from 'react';
import {
  Instagram,
  Music2,
  Twitter,
  Youtube,
  Linkedin,
  Newspaper,
  CircleHelp,
  School,
  Award,
  Users,
  FileText,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { InfoModalTab } from '@/models/landing/info-modal.model';

export interface FooterLinkItem {
  id: string;
  label: string;
  tab: InfoModalTab;
  icon?: React.ComponentType<{ className?: string }>;
  /** Si existe, el item es un enlace externo en vez de abrir el modal. */
  href?: string;
  external?: boolean;
}

export const FOOTER_SUPPORT_LINKS: FooterLinkItem[] = [
  { id: 'faqs', label: 'Preguntas Frecuentes (FAQs)', tab: 'faqs', icon: CircleHelp },
  { id: 'schools', label: 'Koda para Escuelas', tab: 'schools', icon: School },
  { id: 'tests', label: 'Certificación & Evaluaciones', tab: 'tests', icon: Award },
];

export const FOOTER_LEGAL_LINKS: FooterLinkItem[] = [
  { id: 'guidelines', label: 'Normas de la Comunidad', tab: 'guidelines', icon: Users },
  { id: 'terms', label: 'Términos de Servicio', tab: 'terms', icon: FileText },
  { id: 'privacy', label: 'Política de Privacidad', tab: 'privacy', icon: ShieldCheck },
  { id: 'data-rights', label: 'No Vender ni Compartir mi Información', tab: 'data-rights', icon: UserCheck },
];

export const FOOTER_SOCIAL_LINKS: FooterLinkItem[] = [
  { id: 'blog', label: 'Blog Oficial', tab: 'social', icon: Newspaper },
  { id: 'instagram', label: 'Instagram', tab: 'social', icon: Instagram, href: 'https://instagram.com', external: true },
  { id: 'tiktok', label: 'TikTok', tab: 'social', icon: Music2, href: 'https://tiktok.com', external: true },
  { id: 'x', label: 'Twitter / X', tab: 'social', icon: Twitter, href: 'https://x.com', external: true },
  { id: 'youtube', label: 'YouTube', tab: 'social', icon: Youtube, href: 'https://youtube.com', external: true },
  { id: 'linkedin', label: 'LinkedIn', tab: 'social', icon: Linkedin, href: 'https://linkedin.com', external: true },
];
