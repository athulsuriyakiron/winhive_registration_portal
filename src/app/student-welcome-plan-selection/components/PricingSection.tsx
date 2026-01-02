'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PricingSectionProps {
  onSelectPlan: () => void;
}

const PricingSection = ({ onSelectPlan }: PricingSectionProps) => {
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [currentSalary, setCurrentSalary] = useState(250000); // ₹2.5 LPA default
  const [targetSalary, setTargetSalary] = useState(450000); // ₹4.5 LPA (average package)
  const calculatorRef = React.useRef<HTMLDivElement>(null);

  const features = [
    { text: 'Comprehensive WET Testing System', included: true },
    { text: 'Access to 500+ Exclusive Job Fairs', included: true },
    { text: 'Weekly Expert Talk Sessions', included: true },
    { text: 'Professional Resume & Profile Building', included: true },
    { text: 'Unlimited Mock Interview Training', included: true },
    { text: 'Real-time Placement Analytics Dashboard', included: true },
    { text: 'Direct Company Connect Opportunities', included: true },
    { text: 'Personalized Career Mentorship', included: true },
    { text: 'LinkedIn Profile Optimization', included: true },
    { text: 'Salary Negotiation Workshops', included: true },
    { text: 'Lifetime Alumni Network Access', included: true },
    { text: '24/7 Placement Support', included: true }
  ];

  const roiMetrics = [
    { label: 'Students Placed', value: '2,500+', description: 'Successfully launched careers' },
    { label: 'Average Package', value: '₹4.5 LPA', description: 'Competitive starting salaries' },
    { label: 'Time to Placement', value: '2-3 months', description: 'vs 6-8 months average' },
    { label: 'Success Rate', value: '92%', description: 'Members get placed within 4 months' }
  ];

  // ROI Calculations
  const membershipCost = 3500;
  const salaryGain = targetSalary - currentSalary;
  const monthlyGain = Math.round(salaryGain / 12);
  const roiPercentage = Math.round((salaryGain / membershipCost) * 100);
  const paybackMonths = Math.ceil(membershipCost / monthlyGain);
  const firstYearNetGain = salaryGain - membershipCost;

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} LPA`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatMonthly = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleToggleCalculator = () => {
    const newState = !showROICalculator;
    setShowROICalculator(newState);
    
    // Scroll to calculator when opening
    if (newState) {
      setTimeout(() => {
        calculatorRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-text-primary mb-4">
            Invest in Your Future for Just <span className="text-primary">₹3,500/Year</span>
          </h2>
          <p className="text-lg text-text-secondary">
            Less than ₹10 per day for complete career transformation. No hidden fees, no surprises.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow-xl border-2 border-primary overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-brand-trust text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-2xl mb-1">Premium Membership</h3>
                    <p className="text-white/80">Complete Placement Ecosystem</p>
                  </div>
                  <div className="bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold">
                    BEST VALUE
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-heading font-bold text-5xl">₹3,500</span>
                  <span className="text-white/80">/year</span>
                </div>
                <div className="text-sm text-white/80 mt-2">
                  ₹291/month • Less than ₹10/day
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-heading font-semibold text-lg text-text-primary mb-4">Everything You Need to Succeed:</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Icon name="CheckCircleIcon" size={20} variant="solid" className="text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-text-primary">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onSelectPlan}
                  className="w-full py-4 bg-primary text-white font-heading font-semibold text-lg rounded-lg hover:bg-primary/90 transition-all duration-base shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Start Your Journey Now</span>
                  <Icon name="ArrowRightIcon" size={20} variant="solid" />
                </button>

                <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon name="ShieldCheckIcon" size={16} variant="solid" className="text-success" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="ClockIcon" size={16} variant="solid" className="text-primary" />
                    <span>Instant Access</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="UserGroupIcon" size={16} variant="solid" className="text-accent" />
                    <span>2,500+ Members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-success/10 to-accent/10 rounded-xl p-6 border border-success/20">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="CalculatorIcon" size={24} variant="solid" className="text-success" />
                <h4 className="font-heading font-semibold text-lg text-text-primary">ROI Calculator</h4>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Calculate how Winhive membership pays for itself with your career growth
              </p>
              <button
                onClick={handleToggleCalculator}
                className="w-full py-3 bg-success text-white font-semibold rounded-lg hover:bg-success/90 transition-all duration-base"
              >
                {showROICalculator ? 'Hide Calculator' : 'Calculate Your ROI'}
              </button>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="SparklesIcon" size={24} variant="solid" className="text-warning" />
                <h4 className="font-heading font-semibold text-lg text-text-primary">Limited Time Offer</h4>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                Join now and get 3 months of premium mentorship absolutely free (Worth ₹5,000)
              </p>
              <div className="bg-warning/10 rounded-lg p-3 border border-warning/20">
                <div className="text-xs text-text-secondary mb-1">Offer expires in:</div>
                <div className="font-heading font-bold text-xl text-warning">7 Days</div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="AcademicCapIcon" size={24} variant="solid" className="text-primary" />
                <h4 className="font-heading font-semibold text-lg text-text-primary">College Partnership?</h4>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                If your college is partnered with Winhive, you may get special discounts or free access
              </p>
              <a
                href="/college-institution-overview"
                className="text-primary font-semibold text-sm hover:underline flex items-center space-x-1"
              >
                <span>Check College Partnerships</span>
                <Icon name="ArrowRightIcon" size={16} variant="solid" />
              </a>
            </div>
          </div>
        </div>

        {showROICalculator && (
          <div 
            ref={calculatorRef}
            className="max-w-4xl mx-auto bg-card rounded-xl shadow-xl p-8 border border-border scroll-mt-24"
          >
            <h3 className="font-heading font-bold text-2xl text-text-primary mb-6 text-center">
              Interactive ROI Calculator
            </h3>
            
            {/* Success Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {roiMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="font-heading font-bold text-3xl text-primary mb-2">{metric.value}</div>
                  <div className="font-semibold text-text-primary mb-1">{metric.label}</div>
                  <div className="text-sm text-text-secondary">{metric.description}</div>
                </div>
              ))}
            </div>

            {/* Interactive Salary Sliders */}
            <div className="space-y-6 mb-8">
              <div className="bg-background rounded-lg p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold text-text-primary">Current Expected Salary (Without Winhive)</label>
                    <span className="font-bold text-primary text-lg">{formatCurrency(currentSalary)}</span>
                  </div>
                  <input
                    type="range"
                    min="150000"
                    max="500000"
                    step="50000"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>₹1.5 LPA</span>
                    <span>₹5 LPA</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold text-text-primary">Target Salary (With Winhive Training)</label>
                    <span className="font-bold text-success text-lg">{formatCurrency(targetSalary)}</span>
                  </div>
                  <input
                    type="range"
                    min="300000"
                    max="800000"
                    step="50000"
                    value={targetSalary}
                    onChange={(e) => setTargetSalary(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-success"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>₹3 LPA</span>
                    <span>₹8 LPA</span>
                  </div>
                  <div className="mt-2 text-sm text-text-secondary">
                    <Icon name="InformationCircleIcon" size={16} variant="solid" className="inline mr-1" />
                    Based on 2,500+ successful placements, average package is ₹4.5 LPA
                  </div>
                </div>
              </div>

              {/* ROI Results */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-success/10 to-accent/10 rounded-lg p-6 border border-success/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="TrendingUpIcon" size={24} variant="solid" className="text-success" />
                    <h4 className="font-heading font-semibold text-lg text-text-primary">Salary Increase</h4>
                  </div>
                  <div className="font-heading font-bold text-4xl text-success mb-2">
                    {formatCurrency(salaryGain)}
                  </div>
                  <div className="text-sm text-text-secondary">
                    Annual increase with Winhive membership
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-brand-trust/10 rounded-lg p-6 border border-primary/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="CurrencyRupeeIcon" size={24} variant="solid" className="text-primary" />
                    <h4 className="font-heading font-semibold text-lg text-text-primary">Monthly Gain</h4>
                  </div>
                  <div className="font-heading font-bold text-4xl text-primary mb-2">
                    {formatMonthly(monthlyGain)}
                  </div>
                  <div className="text-sm text-text-secondary">
                    Extra income per month after placement
                  </div>
                </div>
              </div>

              {/* Investment Analysis */}
              <div className="bg-gradient-to-r from-accent/10 to-warning/10 rounded-lg p-6 border border-accent/20">
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-sm text-text-secondary mb-1">Return on Investment</div>
                    <div className="font-heading font-bold text-3xl text-accent">
                      {roiPercentage}%
                    </div>
                    <div className="text-xs text-text-secondary mt-1">In first year alone</div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary mb-1">Payback Period</div>
                    <div className="font-heading font-bold text-3xl text-warning">
                      {paybackMonths} {paybackMonths === 1 ? 'month' : 'months'}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">To recover investment</div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary mb-1">Net Gain Year 1</div>
                    <div className="font-heading font-bold text-3xl text-success">
                      {formatCurrency(firstYearNetGain)}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">After membership cost</div>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-r from-success/20 to-accent/20 rounded-lg p-6 border-2 border-success">
                <div className="flex items-start space-x-3">
                  <Icon name="CheckBadgeIcon" size={32} variant="solid" className="text-success flex-shrink-0" />
                  <div>
                    <h4 className="font-heading font-bold text-xl text-text-primary mb-2">Your Investment Summary</h4>
                    <p className="text-text-primary mb-3">
                      With a ₹3,500 investment in Winhive premium membership, you can potentially:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <Icon name="CheckCircleIcon" size={16} variant="solid" className="text-success flex-shrink-0" />
                        <span>Increase your salary by <strong>{formatCurrency(salaryGain)}</strong> annually</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Icon name="CheckCircleIcon" size={16} variant="solid" className="text-success flex-shrink-0" />
                        <span>Earn an extra <strong>{formatMonthly(monthlyGain)}</strong> every month</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Icon name="CheckCircleIcon" size={16} variant="solid" className="text-success flex-shrink-0" />
                        <span>Recover your investment in just <strong>{paybackMonths} {paybackMonths === 1 ? 'month' : 'months'}</strong></span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Icon name="CheckCircleIcon" size={16} variant="solid" className="text-success flex-shrink-0" />
                        <span>Gain <strong>{formatCurrency(firstYearNetGain)}</strong> net profit in your first year</span>
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-success/20">
                      <p className="text-sm text-text-secondary italic">
                        Based on real placement data from 2,500+ Winhive members. Individual results may vary.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={onSelectPlan}
                className="px-8 py-4 bg-primary text-white font-heading font-semibold text-lg rounded-lg hover:bg-primary/90 transition-all duration-base shadow-md hover:shadow-lg inline-flex items-center space-x-2"
              >
                <span>Invest in Your Future Now</span>
                <Icon name="ArrowRightIcon" size={20} variant="solid" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;