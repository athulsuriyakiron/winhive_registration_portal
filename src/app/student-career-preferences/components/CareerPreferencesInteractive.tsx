'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import IndustryPreferenceCard from './IndustryPreferenceCard';
import LocationPreferenceMap from './LocationPreferenceMap';
import SalaryExpectationSlider from './SalaryExpectationSlider';
import CareerGoalsSection from './CareerGoalsSection';
import ProgressIndicator from './ProgressIndicator';

interface Industry {
  id: string;
  name: string;
  icon: string;
  description: string;
  avgSalary: string;
  openings: number;
  growth: string;
}

interface Location {
  id: string;
  city: string;
  state: string;
  opportunities: number;
  avgSalary: string;
  topIndustries: string[];
}

interface CareerGoals {
  shortTerm: string;
  longTerm: string;
  skills: string[];
}

const CareerPreferencesInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [salaryExpectation, setSalaryExpectation] = useState(500000);
  const [careerGoals, setCareerGoals] = useState<CareerGoals>({
    shortTerm: '',
    longTerm: '',
    skills: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const industries: Industry[] = [
    {
      id: 'it-software',
      name: 'IT & Software',
      icon: 'ComputerDesktopIcon',
      description: 'Software development, cloud computing, and tech solutions',
      avgSalary: '₹4.5L - ₹8L',
      openings: 45000,
      growth: '+18%'
    },
    {
      id: 'banking-finance',
      name: 'Banking & Finance',
      icon: 'BanknotesIcon',
      description: 'Financial services, investment banking, and fintech',
      avgSalary: '₹4L - ₹7L',
      openings: 28000,
      growth: '+12%'
    },
    {
      id: 'consulting',
      name: 'Consulting',
      icon: 'BriefcaseIcon',
      description: 'Management consulting, strategy, and business advisory',
      avgSalary: '₹5L - ₹9L',
      openings: 15000,
      growth: '+15%'
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      icon: 'CogIcon',
      description: 'Production, operations, and supply chain management',
      avgSalary: '₹3.5L - ₹6L',
      openings: 32000,
      growth: '+10%'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: 'HeartIcon',
      description: 'Medical services, pharmaceuticals, and health tech',
      avgSalary: '₹3.8L - ₹6.5L',
      openings: 22000,
      growth: '+14%'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      icon: 'ShoppingCartIcon',
      description: 'Online retail, digital marketing, and logistics',
      avgSalary: '₹4L - ₹7.5L',
      openings: 38000,
      growth: '+22%'
    }
  ];

  const locations: Location[] = [
    {
      id: 'bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
      opportunities: 85000,
      avgSalary: '₹5.5L - ₹9L',
      topIndustries: ['IT & Software', 'E-commerce', 'Consulting']
    },
    {
      id: 'mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      opportunities: 72000,
      avgSalary: '₹5L - ₹8.5L',
      topIndustries: ['Banking & Finance', 'Consulting', 'Media']
    },
    {
      id: 'delhi-ncr',
      city: 'Delhi NCR',
      state: 'Delhi',
      opportunities: 68000,
      avgSalary: '₹4.8L - ₹8L',
      topIndustries: ['IT & Software', 'E-commerce', 'Consulting']
    },
    {
      id: 'hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      opportunities: 52000,
      avgSalary: '₹4.5L - ₹7.5L',
      topIndustries: ['IT & Software', 'Pharmaceuticals', 'Manufacturing']
    },
    {
      id: 'pune',
      city: 'Pune',
      state: 'Maharashtra',
      opportunities: 45000,
      avgSalary: '₹4.2L - ₹7L',
      topIndustries: ['IT & Software', 'Manufacturing', 'Automotive']
    },
    {
      id: 'chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      opportunities: 42000,
      avgSalary: '₹4L - ₹6.8L',
      topIndustries: ['IT & Software', 'Manufacturing', 'Automotive']
    }
  ];

  const marketData = {
    percentile25: 350000,
    percentile50: 500000,
    percentile75: 750000,
    percentile90: 1200000
  };

  const progressSteps = [
    { label: 'Plan', icon: 'DocumentTextIcon' },
    { label: 'Personal', icon: 'UserIcon' },
    { label: 'Academic', icon: 'AcademicCapIcon' },
    { label: 'Career', icon: 'BriefcaseIcon' },
    { label: 'Payment', icon: 'CreditCardIcon' },
    { label: 'Verify', icon: 'CheckBadgeIcon' }
  ];

  const handleIndustryToggle = (id: string) => {
    setSelectedIndustries(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    if (errors.industries) {
      setErrors(prev => ({ ...prev, industries: '' }));
    }
  };

  const handleLocationToggle = (id: string) => {
    setSelectedLocations(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
    if (errors.locations) {
      setErrors(prev => ({ ...prev, locations: '' }));
    }
  };

  const handleGoalsChange = (field: 'shortTerm' | 'longTerm', value: string) => {
    setCareerGoals(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSkillsChange = (skills: string[]) => {
    setCareerGoals(prev => ({ ...prev, skills }));
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedIndustries.length === 0) {
      newErrors.industries = 'Please select at least one industry preference';
    }

    if (selectedLocations.length === 0) {
      newErrors.locations = 'Please select at least one preferred location';
    }

    if (!careerGoals.shortTerm.trim()) {
      newErrors.shortTerm = 'Please describe your short-term career goal';
    } else if (careerGoals.shortTerm.length < 50) {
      newErrors.shortTerm = 'Please provide more details (minimum 50 characters)';
    }

    if (!careerGoals.longTerm.trim()) {
      newErrors.longTerm = 'Please describe your long-term career vision';
    } else if (careerGoals.longTerm.length < 50) {
      newErrors.longTerm = 'Please provide more details (minimum 50 characters)';
    }

    if (careerGoals.skills.length < 3) {
      newErrors.skills = 'Please add at least 3 skills you want to develop';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      router.push('/student-verification-pending');
    }, 1500);
  };

  const handleBack = () => {
    router.push('/student-academic-details');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading career preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <ProgressIndicator currentStep={4} totalSteps={6} steps={progressSteps} />

        {Object.keys(errors).length > 0 && (
          <div className="bg-error/10 border border-error rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Icon name="ExclamationCircleIcon" size={24} variant="solid" className="text-error flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-heading font-semibold text-error mb-2">Please complete all required fields</h4>
                <ul className="space-y-1">
                  {Object.values(errors).map((error, idx) => (
                    <li key={idx} className="text-sm text-error">&bull; {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card rounded-lg border border-border p-6 md:p-8 mb-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon name="BriefcaseIcon" size={32} variant="solid" className="text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-2">
                Career Preferences & Goals
              </h1>
              <p className="text-text-secondary text-sm md:text-base">
                Help us understand your career aspirations to match you with the best opportunities. Your preferences will guide our personalized job recommendations and placement support.
              </p>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Icon name="LightBulbIcon" size={20} variant="solid" className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-text-primary font-medium mb-1">Pro Tip for Career Success</p>
                <p className="text-sm text-text-secondary">
                  Be specific about your goals and realistic about salary expectations. Our data shows that students with clear career objectives receive 3x more relevant job matches and 40% higher placement success rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-xl text-text-primary">Industry Preferences</h2>
              <span className="text-sm text-text-secondary">Select all that interest you</span>
            </div>
            {errors.industries && (
              <p className="text-sm text-error mb-3 flex items-center space-x-2">
                <Icon name="ExclamationCircleIcon" size={16} variant="solid" />
                <span>{errors.industries}</span>
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {industries.map(industry => (
                <IndustryPreferenceCard
                  key={industry.id}
                  industry={industry}
                  isSelected={selectedIndustries.includes(industry.id)}
                  onToggle={handleIndustryToggle}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h2 className="font-heading font-semibold text-xl text-text-primary mb-2">Salary Expectations</h2>
              <p className="text-sm text-text-secondary">Set your expected annual salary based on market data and your qualifications</p>
            </div>
            <SalaryExpectationSlider
              value={salaryExpectation}
              onChange={setSalaryExpectation}
              marketData={marketData}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-xl text-text-primary">Preferred Work Locations</h2>
              <span className="text-sm text-text-secondary">Select up to 3 cities</span>
            </div>
            {errors.locations && (
              <p className="text-sm text-error mb-3 flex items-center space-x-2">
                <Icon name="ExclamationCircleIcon" size={16} variant="solid" />
                <span>{errors.locations}</span>
              </p>
            )}
            <LocationPreferenceMap
              locations={locations}
              selectedLocations={selectedLocations}
              onToggleLocation={handleLocationToggle}
            />
          </div>

          <div>
            <div className="mb-4">
              <h2 className="font-heading font-semibold text-xl text-text-primary mb-2">Career Goals & Skills</h2>
              <p className="text-sm text-text-secondary">Define your career trajectory and skills you want to master</p>
            </div>
            {(errors.shortTerm || errors.longTerm || errors.skills) && (
              <div className="bg-error/10 border border-error rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <Icon name="ExclamationCircleIcon" size={18} variant="solid" className="text-error flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    {errors.shortTerm && <p className="text-sm text-error">{errors.shortTerm}</p>}
                    {errors.longTerm && <p className="text-sm text-error">{errors.longTerm}</p>}
                    {errors.skills && <p className="text-sm text-error">{errors.skills}</p>}
                  </div>
                </div>
              </div>
            )}
            <CareerGoalsSection
              goals={careerGoals}
              onGoalsChange={handleGoalsChange}
              onSkillsChange={handleSkillsChange}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
          <button
            onClick={handleBack}
            className="w-full sm:w-auto px-6 py-3 border-2 border-border text-text-primary font-heading font-semibold rounded-lg hover:bg-muted transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Icon name="ArrowLeftIcon" size={20} variant="outline" />
            <span>Back to Academic Details</span>
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue to Payment</span>
                <Icon name="ArrowRightIcon" size={20} variant="solid" />
              </>
            )}
          </button>
        </div>

        <div className="mt-6 bg-muted rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="ShieldCheckIcon" size={20} variant="solid" className="text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-text-primary font-medium mb-1">Your Data is Secure</p>
              <p className="text-xs text-text-secondary">
                All information is encrypted and will only be used to match you with relevant job opportunities. We never share your data without your explicit consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPreferencesInteractive;