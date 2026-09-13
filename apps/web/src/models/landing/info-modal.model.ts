import React from 'react';
import {
  CircleHelp,
  School,
  Award,
  Users,
  FileText,
  ShieldCheck,
  UserCheck,
  Newspaper,
} from 'lucide-react';

export type InfoModalTab =
  | 'faqs'
  | 'schools'
  | 'tests'
  | 'guidelines'
  | 'terms'
  | 'privacy'
  | 'data-rights'
  | 'social';

export interface ModalItem {
  id: InfoModalTab;
  label: string;
  icon: React.ElementType;
}

export interface ModalCategory {
  name: string;
  items: ModalItem[];
}

export const MODAL_CATEGORIES: ModalCategory[] = [
  {
    name: 'Ayuda y Soporte',
    items: [
      { id: 'faqs', label: 'Preguntas Frecuentes', icon: CircleHelp },
      { id: 'schools', label: 'Koda para Escuelas', icon: School },
      { id: 'tests', label: 'Certificación & Evaluaciones', icon: Award },
    ],
  },
  {
    name: 'Privacidad y Términos',
    items: [
      { id: 'guidelines', label: 'Normas de la Comunidad', icon: Users },
      { id: 'terms', label: 'Términos de Servicio', icon: FileText },
      { id: 'privacy', label: 'Política de Privacidad', icon: ShieldCheck },
      { id: 'data-rights', label: 'Gestión de Datos', icon: UserCheck },
    ],
  },
  {
    name: 'Comunidad & Social',
    items: [
      { id: 'social', label: 'Redes Sociales & Blog', icon: Newspaper },
    ],
  },
];
