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

export const InfoModalContent: React.FC<{ activeTab: InfoModalTab }> = ({ activeTab }) => {
  return (
    <main className="flex-1 p-6 sm:p-8 overflow-y-auto font-sans text-slate-300 text-sm leading-relaxed space-y-6">
      {activeTab === 'faqs' && <FaqsTab />}
      {activeTab === 'schools' && <SchoolsTab />}
      {activeTab === 'tests' && <TestsTab />}
      {activeTab === 'guidelines' && <GuidelinesTab />}
      {activeTab === 'terms' && <TermsTab />}
      {activeTab === 'privacy' && <PrivacyTab />}
      {activeTab === 'data-rights' && <DataRightsTab />}
      {activeTab === 'social' && <SocialTab />}
    </main>
  );
};
