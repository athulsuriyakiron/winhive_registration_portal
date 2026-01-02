import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface InstitutionalBenefit {
  title: string;
  description: string;
  iconName: string;
  benefits: string[];
  impact: {
    label: string;
    value: string;
  }[];
}

const SuccessStoriesSection = () => {
  const institutionalBenefits: InstitutionalBenefit[] = [
    {
      title: 'Enhanced Institutional Reputation',
      description: 'Build credibility and attract top students through demonstrated placement success and industry partnerships.',
      iconName: 'AcademicCapIcon',
      benefits: [
        'Recognition as a placement-focused institution',
        'Increased student enrollment from top-tier candidates',
        'Competitive advantage over peer institutions',
        'Improved NAAC and NIRF rankings'
      ],
      impact: [
        { label: 'Student Enrollment Growth', value: '40%' },
        { label: 'Institutional Rankings', value: '↑25%' }
      ]
    },
    {
      title: 'Comprehensive Student Development',
      description: 'Provide holistic skill development through industry-designed curriculum and expert mentorship programs.',
      iconName: 'LightBulbIcon',
      benefits: [
        'Access to 100+ corporate training modules',
        'Industry-relevant skill assessments (WET)',
        'Personalized career guidance and mentorship',
        'Real-time progress tracking for faculty'
      ],
      impact: [
        { label: 'Placement Readiness', value: '85%' },
        { label: 'Student Satisfaction', value: '4.6/5' }
      ]
    },
    {
      title: 'Streamlined Administrative Operations',
      description: 'Reduce placement cell workload with automated systems, bulk student management, and comprehensive analytics.',
      iconName: 'ChartBarIcon',
      benefits: [
        'Centralized student profile management',
        'Automated application tracking and reporting',
        'Real-time placement statistics dashboard',
        'Reduced manual coordination by 70%'
      ],
      impact: [
        { label: 'Time Saved', value: '70%' },
        { label: 'Process Efficiency', value: '3x' }
      ]
    },
    {
      title: 'Direct Corporate Access',
      description: 'Leverage our network of 100+ hiring partners for exclusive campus recruitment opportunities.',
      iconName: 'BuildingOfficeIcon',
      benefits: [
        'Priority access to Fortune 500 companies',
        'Exclusive campus placement drives',
        'Internship and project opportunities',
        'Industry collaboration for curriculum design'
      ],
      impact: [
        { label: 'Hiring Partners', value: '100+' },
        { label: 'Avg. Package Increase', value: '45%' }
      ]
    },
    {
      title: 'Data-Driven Decision Making',
      description: 'Make informed strategic decisions with comprehensive analytics on student performance and placement trends.',
      iconName: 'PresentationChartLineIcon',
      benefits: [
        'Real-time placement analytics and forecasting',
        'Department-wise performance benchmarking',
        'Skill gap analysis and curriculum recommendations',
        'Predictive placement probability assessments'
      ],
      impact: [
        { label: 'Strategic Insights', value: '24/7' },
        { label: 'Data Accuracy', value: '99%' }
      ]
    },
    {
      title: 'Cost-Effective Partnership Model',
      description: 'Achieve superior placement outcomes without heavy infrastructure investment or additional staffing.',
      iconName: 'CurrencyRupeeIcon',
      benefits: [
        'No upfront technology or training costs',
        'Flexible partnership tiers for all budgets',
        'Pay-per-success model available',
        'Immediate ROI through improved placement rates'
      ],
      impact: [
        { label: 'Cost Reduction', value: '60%' },
        { label: 'ROI Timeline', value: '6 months' }
      ]
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Icon name="SparklesIcon" size={20} variant="solid" className="text-primary" />
            <span className="text-sm font-semibold text-primary">Partnership Benefits</span>
          </div>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
            Why Leading Institutions Choose Winhive
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Join 10+ progressive institutions transforming their placement ecosystem and delivering measurable career outcomes
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {institutionalBenefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-base hover:border-primary/30"
            >
              <div className="p-6 lg:p-8 space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon
                      name={benefit.iconName}
                      size={28}
                      variant="solid"
                      className="text-primary"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="font-heading font-semibold text-sm text-foreground flex items-center space-x-2">
                    <Icon name="CheckCircleIcon" size={18} variant="solid" className="text-accent" />
                    <span>Key Benefits</span>
                  </div>
                  <ul className="space-y-2">
                    {benefit.benefits.map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-text-primary">
                        <Icon
                          name="CheckIcon"
                          size={16}
                          variant="solid"
                          className="text-accent mt-0.5 flex-shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4">
                    {benefit.impact.map((metric, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-xs text-text-secondary">{metric.label}</div>
                        <div className="font-heading font-bold text-xl text-primary">
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 text-text-secondary">
            <Icon name="ShieldCheckIcon" size={20} variant="solid" className="text-primary" />
            <span className="text-sm">
              Trusted by 10+ partner colleges across India
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;