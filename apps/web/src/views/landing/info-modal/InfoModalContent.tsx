import React from 'react';
import { InfoModalTab } from '@/models/landing/info-modal.model';
import { FaqsTab } from './FaqsTab';
import { SchoolsTab } from './SchoolsTab';
import { TestsTab } from './TestsTab';
import { GuidelinesTab } from './GuidelinesTab';
import { TermsTab } from './TermsTab';
import { PrivacyTab } from './PrivacyTab';
import { DataRightsTab } from './DataRightsTab';
import { SocialTab } from './SocialTab';

interface InfoModalContentProps {
  activeTab: InfoModalTab;
}

export const InfoModalContent: React.FC<InfoModalContentProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'faqs':
      return <FaqsTab />;
    case 'schools':
      return <SchoolsTab />;
    case 'tests':
      return <TestsTab />;
    case 'guidelines':
      return <GuidelinesTab />;
    case 'terms':
      return <TermsTab />;
    case 'privacy':
      return <PrivacyTab />;
    case 'data-rights':
      return <DataRightsTab />;
    case 'social':
      return <SocialTab />;
    default:
      return null;
  }
};
