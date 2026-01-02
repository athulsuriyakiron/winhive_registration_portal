import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection = ({ onGetStarted }: CTASectionProps) => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-brand-primary to-brand-trust text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl lg:text-5xl mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg lg:text-xl text-white/90 mb-8">
            Join 15,000+ students who chose success over uncertainty. Your dream job is just one decision away.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-heading font-semibold text-lg rounded-lg hover:bg-accent/90 transition-all duration-base shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Start Registration Now</span>
              <Icon name="ArrowRightIcon" size={20} variant="solid" />
            </button>

            <button className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-heading font-semibold text-lg rounded-lg hover:bg-white/20 transition-all duration-base border border-white/20 flex items-center justify-center space-x-2">
              <Icon name="PhoneIcon" size={20} variant="solid" />
              <span>Talk to Expert</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Icon name="ClockIcon" size={24} variant="solid" className="text-accent mx-auto mb-2" />
              <div className="font-semibold mb-1">Instant Access</div>
              <div className="text-sm text-white/80">Start learning immediately</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Icon name="CreditCardIcon" size={24} variant="solid" className="text-accent mx-auto mb-2" />
              <div className="font-semibold mb-1">Secure Payment</div>
              <div className="text-sm text-white/80">Multiple payment options</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <Icon name="ChatBubbleLeftRightIcon" size={24} variant="solid" className="text-accent mx-auto mb-2" />
              <div className="font-semibold mb-1">24/7 Support</div>
              <div className="text-sm text-white/80">We're here to help</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;