import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-brand-primary to-brand-secondary text-white py-20 lg:py-28">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Icon name="AcademicCapIcon" size={20} variant="solid" className="text-accent" />
            <span className="text-sm font-semibold">Institutional Partnership Program</span>
          </div>
          
          <h1 className="font-heading font-bold text-4xl lg:text-5xl xl:text-6xl mb-6 leading-tight">
            Transform Your Institution's Placement Success
          </h1>
          
          <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join India's premier fresher placement ecosystem. Partner with Winhive to deliver measurable career outcomes, enhance institutional reputation, and provide students with comprehensive placement preparation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-heading font-semibold text-lg rounded-lg hover:bg-accent/90 transition-all duration-base shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Start Partnership Application</span>
              <Icon name="ArrowRightIcon" size={20} variant="outline" />
            </button>
            
            <button className="w-full sm:w-auto px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-heading font-semibold text-lg rounded-lg hover:bg-white/30 transition-all duration-base border-2 border-white/40">
              Schedule Demo
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '10+', label: 'Partner Colleges' },
              { value: '95%', label: 'Placement Rate' },
              { value: '2500+', label: 'Students Placed' },
              { value: '100+', label: 'Hiring Partners' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-heading font-bold text-3xl lg:text-4xl mb-1">{stat.value}</div>
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