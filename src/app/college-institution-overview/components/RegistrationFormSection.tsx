'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface FormData {
  institutionName: string;
  institutionType: string;
  establishedYear: string;
  affiliatedUniversity: string;
  accreditationType: string[];
  contactPersonName: string;
  designation: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  totalStudents: string;
  finalYearStudents: string;
  partnershipTier: string;
  partnershipInterest: string;
  agreeTerms: boolean;
}

const RegistrationFormSection = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    institutionName: '',
    institutionType: '',
    establishedYear: '',
    affiliatedUniversity: '',
    accreditationType: [],
    contactPersonName: '',
    designation: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    website: '',
    totalStudents: '',
    finalYearStudents: '',
    partnershipTier: '',
    partnershipInterest: '',
    agreeTerms: false
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'agreeTerms') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => ({
          ...prev,
          accreditationType: checked
            ? [...prev.accreditationType, value]
            : prev.accreditationType.filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isHydrated) {
      router.push('/college-contact-information');
    }
  };

  const steps = [
    { number: 1, title: 'Institution Details', icon: 'BuildingOfficeIcon' },
    { number: 2, title: 'Contact Information', icon: 'UserIcon' },
    { number: 3, title: 'Partnership Preferences', icon: 'DocumentCheckIcon' }
  ];

  const institutionTypes = [
    'Engineering College',
    'Management Institute',
    'Arts & Science College',
    'Polytechnic',
    'University',
    'Deemed University',
    'Other'
  ];

  const accreditationTypes = [
    'AICTE',
    'UGC',
    'NAAC',
    'NBA',
    'ISO 9001:2015',
    'Other'
  ];

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const partnershipTiers = [
    { value: 'foundation', label: 'Foundation (Up to 200 students)' },
    { value: 'professional', label: 'Professional (200-500 students)' },
    { value: 'enterprise', label: 'Enterprise (500+ students)' }
  ];

  if (!isHydrated) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="space-y-4">
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
              Start Your Partnership Application
            </h2>
            <p className="text-lg text-text-secondary">
              Complete the form below to begin your institution's transformation journey
            </p>
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-base ${
                        currentStep >= step.number
                          ? 'bg-primary text-white' :'bg-muted text-text-secondary'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Icon name="CheckIcon" size={24} variant="solid" />
                      ) : (
                        <Icon name={step.icon as any} size={24} variant="outline" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-semibold text-foreground hidden sm:block">
                        {step.title}
                      </div>
                      <div className="text-xs text-text-secondary">Step {step.number}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all duration-base ${
                        currentStep > step.number ? 'bg-primary' : 'bg-muted'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-card rounded-xl shadow-lg p-6 lg:p-8 border border-border">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
                    Institution Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Institution Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      placeholder="Enter full institution name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Institution Type <span className="text-error">*</span>
                      </label>
                      <select
                        name="institutionType"
                        value={formData.institutionType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      >
                        <option value="">Select type</option>
                        {institutionTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Established Year <span className="text-error">*</span>
                      </label>
                      <input
                        type="number"
                        name="establishedYear"
                        value={formData.establishedYear}
                        onChange={handleInputChange}
                        required
                        min="1900"
                        max="2025"
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="YYYY"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Affiliated University <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      name="affiliatedUniversity"
                      value={formData.affiliatedUniversity}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      placeholder="Enter affiliated university name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Accreditation Type <span className="text-error">*</span>
                    </label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {accreditationTypes.map(type => (
                        <label key={type} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="accreditationType"
                            value={type}
                            checked={formData.accreditationType.includes(type)}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-primary border-input rounded focus:ring-2 focus:ring-ring"
                          />
                          <span className="text-sm text-foreground">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      placeholder="https://www.example.com"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
                    Contact Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Contact Person Name <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="contactPersonName"
                        value={formData.contactPersonName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="Full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Designation <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="e.g., Placement Officer"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address <span className="text-error">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="official@institution.edu"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number <span className="text-error">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Alternate Phone Number
                    </label>
                    <input
                      type="tel"
                      name="alternatePhone"
                      value={formData.alternatePhone}
                      onChange={handleInputChange}
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Complete Address <span className="text-error">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground resize-none"
                      placeholder="Street address, building name, etc."
                    ></textarea>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="City name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State <span className="text-error">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                      >
                        <option value="">Select state</option>
                        {states.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Pincode <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="6-digit pincode"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
                    Partnership Preferences
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Total Students <span className="text-error">*</span>
                      </label>
                      <input
                        type="number"
                        name="totalStudents"
                        value={formData.totalStudents}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="Total enrolled students"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Final Year Students <span className="text-error">*</span>
                      </label>
                      <input
                        type="number"
                        name="finalYearStudents"
                        value={formData.finalYearStudents}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                        placeholder="Students requiring placement"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Partnership Tier <span className="text-error">*</span>
                    </label>
                    <select
                      name="partnershipTier"
                      value={formData.partnershipTier}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                    >
                      <option value="">Select tier</option>
                      {partnershipTiers.map(tier => (
                        <option key={tier.value} value={tier.value}>{tier.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Partnership Interest & Goals <span className="text-error">*</span>
                    </label>
                    <textarea
                      name="partnershipInterest"
                      value={formData.partnershipInterest}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground resize-none"
                      placeholder="Describe your institution's placement goals and why you're interested in partnering with Winhive..."
                    ></textarea>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        required
                        className="w-5 h-5 text-primary border-input rounded focus:ring-2 focus:ring-ring mt-1 flex-shrink-0"
                      />
                      <span className="text-sm text-foreground leading-relaxed">
                        I confirm that I am an authorized representative of the institution and agree to Winhive's partnership terms and conditions. I understand that all information provided will be verified through official channels and that false information may result in application rejection.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-3 bg-muted text-foreground font-heading font-semibold rounded-lg hover:bg-muted/80 transition-all duration-base flex items-center space-x-2"
                  >
                    <Icon name="ChevronLeftIcon" size={20} variant="outline" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-base flex items-center space-x-2 shadow-md hover:shadow-lg"
                  >
                    <span>Next Step</span>
                    <Icon name="ChevronRightIcon" size={20} variant="outline" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-accent text-white font-heading font-semibold rounded-lg hover:bg-accent/90 transition-all duration-base flex items-center space-x-2 shadow-md hover:shadow-lg"
                  >
                    <span>Submit Application</span>
                    <Icon name="CheckCircleIcon" size={20} variant="solid" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationFormSection;