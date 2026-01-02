import React from 'react';
import Icon from '@/components/ui/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'ShieldCheckIcon',
      title: 'Secure & Verified',
      description: 'Bank-grade encryption for all your data'
    },
    {
      icon: 'CheckBadgeIcon',
      title: 'ISO Certified',
      description: 'Quality management standards certified'
    },
    {
      icon: 'StarIcon',
      title: '4.8/5 Rating',
      description: 'Based on 10,000+ student reviews'
    },
    {
      icon: 'BuildingOfficeIcon',
      title: '200+ Colleges',
      description: 'Trusted by leading institutions'
    }
  ];

  const industryPartners = [
    { name: 'NASSCOM', description: 'Technology Industry Partner' },
    { name: 'CII', description: 'Industry Association Member' },
    { name: 'AICTE', description: 'Recognized Training Partner' },
    { name: 'NSDC', description: 'Skill Development Partner' }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-text-primary mb-4">
            Trusted by Students & <span className="text-primary">Industry Leaders</span>
          </h2>
          <p className="text-lg text-text-secondary">
            Your success is backed by India's most credible placement ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          {trustBadges.map((badge, index) => (
            <div key={index} className="bg-card rounded-lg p-6 text-center shadow-md border border-border hover:shadow-lg transition-shadow duration-base">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={badge.icon as any} size={32} variant="solid" className="text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
                {badge.title}
              </h3>
              <p className="text-sm text-text-secondary">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="font-heading font-semibold text-xl text-text-primary text-center mb-8">
            Industry Partnerships & Recognition
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industryPartners.map((partner, index) => (
              <div key={index} className="bg-card rounded-lg p-6 text-center shadow-sm border border-border">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-brand-trust rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="BuildingOfficeIcon" size={24} variant="solid" className="text-white" />
                </div>
                <div className="font-heading font-bold text-lg text-text-primary mb-1">{partner.name}</div>
                <div className="text-xs text-text-secondary">{partner.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Icon name="LockClosedIcon" size={48} variant="solid" className="text-primary" />
              <div>
                <h4 className="font-heading font-semibold text-lg text-text-primary mb-1">
                  Your Data is Safe
                </h4>
                <p className="text-sm text-text-secondary">
                  We never share your information with third parties without consent
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="ShieldCheckIcon" size={20} variant="solid" className="text-success" />
              <span>SSL Secured</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;