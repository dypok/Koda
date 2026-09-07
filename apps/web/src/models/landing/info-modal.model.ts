import React from 'react';
import {
  IconHelp,
  IconSchool,
  IconAward,
  IconUsers,
  IconFileText,
  IconShieldLock,
  IconUserCheck,
  IconArticle,
} from '@tabler/icons-react';

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
      { id: 'faqs', label: 'Preguntas Frecuentes', icon: IconHelp },
      { id: 'schools', label: 'Koda para Escuelas', icon: IconSchool },
      { id: 'tests', label: 'Certificación & Evaluaciones', icon: IconAward },
    ],
  },
  {
    name: 'Privacidad y Términos',
    items: [
      { id: 'guidelines', label: 'Normas de la Comunidad', icon: IconUsers },
      { id: 'terms', label: 'Términos de Servicio', icon: IconFileText },
      { id: 'privacy', label: 'Política de Privacidad', icon: IconShieldLock },
      { id: 'data-rights', label: 'Gestión de Datos', icon: IconUserCheck },
    ],
  },
  {
    name: 'Comunidad & Social',
    items: [
      { id: 'social', label: 'Redes Sociales & Blog', icon: IconArticle },
    ],
  },
];
