import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Benefit {
  icon: string;
  title: string;
  description: string;
  metrics: string;
}

const BenefitsSection = () => {
  const benefits: Benefit[] = [
    {
      icon: 'ChartBarIcon',
      title: 'Enhanced Placement Rates',
      description: 'Proven track record of improving institutional placement statistics by 40-60% through structured preparation and industry connections.',
      metrics: '40-60% improvement'
    },
    {
      icon: 'UserGroupIcon',
      title: 'Comprehensive Student Support',
      description: 'End-to-end placement preparation including WET testing, mock interviews, resume building, and soft skills development for all final year students.',
      metrics: '360° preparation'
    },
    {
      icon: 'BuildingOfficeIcon',
      title: 'Corporate Network Access',
      description: 'Direct connections to 100+ hiring partners across industries, exclusive job fairs, and priority access to campus recruitment drives.',
      metrics: '100+ companies'
    },
    {
      icon: 'AcademicCapIcon',
      title: 'Expert-Led Training',
      description: 'Industry veterans conduct specialized sessions on interview techniques, technical skills, and professional development tailored to your students.',
      metrics: '50+ expert trainers'
    },
    {
      icon: 'DocumentCheckIcon',
      title: 'Administrative Efficiency',
      description: 'Streamlined bulk account management, automated progress tracking, and comprehensive reporting dashboards for placement officers.',
      metrics: 'Zero manual overhead'
    },
    {
      icon: 'TrophyIcon',
      title: 'Institutional Reputation',
      description: 'Strengthen your college brand through superior placement outcomes, student satisfaction, and recognition as a progressive institution.',
      metrics: 'Brand enhancement'
    },
    {
      icon: 'CurrencyRupeeIcon',
      title: 'Better Salary Packages',
      description: 'Students secure 30-50% higher packages through interview preparation and skill training',
      impact: '₹4.5L average'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
            Why Leading Institutions Choose Winhive
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Comprehensive partnership benefits designed to elevate your institution's placement success and student career outcomes
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 lg:p-8 shadow-md hover:shadow-lg transition-all duration-base border border-border group hover:border-primary"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-base">
                <Icon name={benefit.icon as any} size={28} variant="outline" className="text-primary" />
              </div>
              
              <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                {benefit.title}
              </h3>
              
              <p className="text-text-secondary mb-4 leading-relaxed">
                {benefit.description}
              </p>
              
              <div className="inline-flex items-center space-x-2 text-sm font-semibold text-accent">
                <Icon name="CheckCircleIcon" size={18} variant="solid" />
                <span>{benefit.metrics}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;