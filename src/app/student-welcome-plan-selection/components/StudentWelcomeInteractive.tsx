'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from './HeroSection';
import ProblemRecognition from './ProblemRecognition';
import SolutionUniqueness from './SolutionUniqueness';
import SocialProof from './SocialProof';
import PricingSection from './PricingSection';
import TrustSignals from './TrustSignals';
import CTASection from './CTASection';
import Footer from './Footer';
import Icon from '@/components/ui/AppIcon';
import { trackPlanSelection, trackStudentRegistrationComplete, trackButtonClick } from '@/lib/analytics-events';

const StudentWelcomeInteractive = () => {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium' | null>(null);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [registrationStartTime] = useState(Date.now());

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHydrated]);

  const handleGetStarted = () => {
    router?.push('/student-personal-information');
  };

  const handlePlanSelection = (plan: 'free' | 'premium') => {
    // Track plan selection
    trackPlanSelection({
      plan,
      from_page: 'welcome'
    });
    
    setSelectedPlan(plan);
    setShowPlanDetails(true);
  };

  const handleConfirmPlan = () => {
    if (!selectedPlan) return;
    
    const completionTime = Math.floor((Date.now() - registrationStartTime) / 1000);
    
    // Track registration completion
    trackStudentRegistrationComplete({
      plan: selectedPlan,
      completion_time: completionTime
    });
    
    // Track button click
    trackButtonClick({
      button_id: 'confirm_plan',
      button_text: 'Confirm & Continue',
      page: 'welcome_plan_selection'
    });

    if (selectedPlan === 'free') {
      router.push('/student-personal-information');
    } else {
      router.push('/student-personal-information?plan=premium');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onGetStarted={handleGetStarted} />
      <ProblemRecognition />
      <SolutionUniqueness />
      <SocialProof />
      <PricingSection onSelectPlan={handleGetStarted} />
      <TrustSignals />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-base flex items-center justify-center z-40"
          aria-label="Scroll to top"
        >
          <Icon name="ArrowUpIcon" size={24} variant="solid" />
        </button>
      )}

      <div className="fixed bottom-8 left-8 z-40 hidden lg:block">
        <div className="bg-card rounded-lg shadow-xl p-4 border border-border max-w-xs">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
              <Icon name="ChatBubbleLeftRightIcon" size={20} variant="solid" className="text-white" />
            </div>
            <div>
              <div className="font-heading font-semibold text-sm text-text-primary">Need Help?</div>
              <div className="text-xs text-text-secondary">We're online now</div>
            </div>
          </div>
          <button className="w-full py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary/90 transition-all duration-base">
            Chat with Expert
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentWelcomeInteractive;