'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AcademicDetailsForm from './AcademicDetailsForm';
import ProgressIndicator from './ProgressIndicator';
import HelpSection from './HelpSection';

const StudentAcademicDetailsInteractive = () => {
  const router = useRouter();

  const handleNext = () => {
    router?.push('/student-career-preferences');
  };

  const handleBack = () => {
    router?.push('/student-personal-information');
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-text-primary mb-3">
              Academic Details
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Help us understand your educational background to match you with the right opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AcademicDetailsForm onNext={handleNext} onBack={handleBack} />
            </div>

            <div className="space-y-6">
              <ProgressIndicator currentStep={3} />
              <HelpSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAcademicDetailsInteractive;