'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import BenefitsSection from './BenefitsSection';
import SuccessStoriesSection from './SuccessStoriesSection';
import PartnershipTiersSection from './PartnershipTiersSection';
import AccreditationSection from './AccreditationSection';
import RegistrationFormSection from './RegistrationFormSection';
import FAQSection from './FAQSection';

const CollegeOverviewInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const scrollToForm = () => {
    if (isHydrated) {
      const formSection = document.getElementById('registration-form');
      if (formSection) {
        formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-96 bg-muted"></div>
          <div className="container mx-auto px-4 py-16 space-y-8">
            <div className="h-64 bg-muted rounded-xl"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onGetStarted={scrollToForm} />
      <BenefitsSection />
      <SuccessStoriesSection />
      <PartnershipTiersSection />
      <AccreditationSection />
      <div id="registration-form">
        <RegistrationFormSection />
      </div>
      <FAQSection />
    </div>
  );
};

export default CollegeOverviewInteractive;