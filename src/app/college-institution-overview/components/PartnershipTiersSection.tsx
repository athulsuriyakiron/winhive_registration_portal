import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TierFeature {
  text: string;
  included: boolean;
}

interface PartnershipTier {
  name: string;
  description: string;
  icon: string;
  studentRange: string;
  pricing: string;
  features: TierFeature[];
  recommended?: boolean;
}

const PartnershipTiersSection = () => {
  const tiers: PartnershipTier[] = [
    {
      name: 'Foundation',
      description: 'Perfect for smaller institutions starting their placement transformation journey',
      icon: 'BuildingLibraryIcon',
      studentRange: 'Up to 200 students',
      pricing: 'Custom pricing based on student count',
      features: [
        { text: 'Basic WET testing access', included: true },
        { text: 'Monthly expert sessions', included: true },
        { text: 'Job fair participation', included: true },
        { text: 'Standard reporting dashboard', included: true },
        { text: 'Email support', included: true },
        { text: 'Dedicated account manager', included: false },
        { text: 'Custom training modules', included: false },
        { text: 'Priority job postings', included: false }
      ]
    },
    {
      name: 'Professional',
      description: 'Comprehensive solution for mid-sized institutions seeking measurable outcomes',
      icon: 'BuildingOffice2Icon',
      studentRange: '200-500 students',
      pricing: 'Volume-based discounts available',
      recommended: true,
      features: [
        { text: 'Advanced WET testing suite', included: true },
        { text: 'Weekly expert sessions', included: true },
        { text: 'Premium job fair access', included: true },
        { text: 'Advanced analytics dashboard', included: true },
        { text: 'Priority email & phone support', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom training modules', included: true },
        { text: 'Priority job postings', included: false }
      ]
    },
    {
      name: 'Enterprise',
      description: 'Complete ecosystem for large institutions demanding excellence',
      icon: 'BuildingOfficeIcon',
      studentRange: '500+ students',
      pricing: 'Tailored enterprise agreements',
      features: [
        { text: 'Complete WET testing platform', included: true },
        { text: 'Unlimited expert sessions', included: true },
        { text: 'Exclusive job fair hosting', included: true },
        { text: 'Custom analytics & reporting', included: true },
        { text: '24/7 dedicated support', included: true },
        { text: 'Senior account manager', included: true },
        { text: 'Fully customized training', included: true },
        { text: 'Priority job postings', included: true }
      ]
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
            Partnership Tiers & Benefits
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Choose the partnership level that aligns with your institution's size and placement goals
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`bg-card rounded-xl shadow-lg overflow-hidden border-2 transition-all duration-base hover:shadow-xl ${
                tier.recommended
                  ? 'border-primary relative' :'border-border hover:border-primary/50'
              }`}
            >
              {tier.recommended && (
                <div className="absolute top-0 right-0 bg-accent text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Recommended
                </div>
              )}
              
              <div className="p-6 lg:p-8 space-y-6">
                <div className="space-y-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={tier.icon as any} size={28} variant="solid" className="text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {tier.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2 text-sm text-text-secondary">
                      <Icon name="UserGroupIcon" size={16} variant="solid" />
                      <span>{tier.studentRange}</span>
                    </div>
                    <div className="font-heading font-semibold text-lg text-primary">
                      {tier.pricing}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <Icon
                        name={feature.included ? 'CheckCircleIcon' : 'XCircleIcon'}
                        size={20}
                        variant="solid"
                        className={feature.included ? 'text-accent' : 'text-text-secondary/40'}
                      />
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-text-primary' : 'text-text-secondary/60'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
                
                <button
                  className={`w-full py-3 rounded-lg font-heading font-semibold transition-all duration-base ${
                    tier.recommended
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg'
                      : 'bg-muted text-foreground hover:bg-primary/10 border border-border'
                  }`}
                >
                  Select {tier.name}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-text-secondary mb-4">
            Need a custom solution? Our team can create a tailored partnership package.
          </p>
          <button className="px-8 py-3 bg-secondary text-secondary-foreground font-heading font-semibold rounded-lg hover:bg-secondary/90 transition-all duration-base shadow-md hover:shadow-lg">
            Request Custom Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnershipTiersSection;