import React from 'react';

export type RegisterStep = 'language' | 'credentials' | 'success';
export type TechCategory = 'all' | 'language' | 'framework' | 'tools';

export interface LanguageOption {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  isAvailable: boolean;
  badge: string;
  category: 'language' | 'framework' | 'tools';
}

export interface StudentRegistrationState {
  currentStep: RegisterStep;
  selectedLanguageId: string | null;
}
