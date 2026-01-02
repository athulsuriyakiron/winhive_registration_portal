import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-brand-primary to-brand-trust text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Icon name="SparklesIcon" size={20} variant="solid" className="text-accent" />
            <span className="text-sm font-medium">India's First Fresher-Focused Job Placement Ecosystem</span>
          </div>
          
          <h1 className="font-heading font-bold text-4xl lg:text-6xl mb-6 leading-tight">
            Your First Job Shapes Your <span className="text-accent">Entire Career</span>
          </h1>
          
          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands who transformed uncertainty into career success. Get expert guidance, exclusive job fairs, and proven placement strategies for just ₹3,500/year.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-heading font-semibold text-lg rounded-lg hover:bg-accent/90 transition-all duration-base shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Start Your Journey</span>
              <Icon name="ArrowRightIcon" size={20} variant="solid" />
            </button>
            
            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-heading font-semibold text-lg rounded-lg hover:bg-white/20 transition-all duration-base border border-white/20">
              Watch Success Stories
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '2,500+', label: 'Students Placed', icon: 'UserGroupIcon' },
              { value: '100+', label: 'Partner Companies', icon: 'BuildingOfficeIcon' },
              { value: '₹4.5L', label: 'Avg. Package', icon: 'CurrencyRupeeIcon' },
              { value: '95%', label: 'Success Rate', icon: 'ChartBarIcon' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Icon name={stat.icon as any} size={24} variant="solid" className="text-accent mx-auto mb-2" />
                <div className="font-heading font-bold text-2xl lg:text-3xl mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;