import React from 'react';

export type RegisterStep = 'language' | 'experience' | 'style' | 'goal' | 'profile';
export type TechCategory = 'all' | 'language' | 'framework' | 'tools';

export interface LanguageOption {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  isAvailable: boolean;
  category: 'language' | 'framework' | 'tools';
  badge?: string;
}

export interface ExperienceOption {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

export interface StudentRegistrationState {
  currentStep: number;
  selectedLanguageId: string | null;
  selectedExperienceId: string | null;
}
