export type RegisterStep = 'language' | 'credentials' | 'success';

export interface LanguageOption {
  id: string;
  name: string;
  version: string;
  slug: string;
  headline: string;
  description: string;
  badge: string;
  isAvailable: boolean;
  accentColor: string;
  stats: string;
}

export interface StudentRegistrationState {
  currentStep: RegisterStep;
  selectedLanguageId: string | null;
}
