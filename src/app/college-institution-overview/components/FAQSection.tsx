'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface FAQ {
  question: string;
  answer: string;
}

const FAQSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const faqs: FAQ[] = [
    {
      question: 'What are the eligibility criteria for institutional partnership?',
      answer: 'Your institution must be accredited by AICTE, UGC, or equivalent regulatory bodies. We partner with engineering colleges, management institutes, universities, and polytechnics that have final year students requiring placement assistance. Minimum batch size requirements vary by partnership tier.'
    },
    {
      question: 'How long does the verification process take?',
      answer: 'The institutional verification process typically takes 5-7 business days. Our team validates your accreditation certificates through government databases and reviews your application details. You\'ll receive regular updates via email throughout the process.'
    },
    {
      question: 'What is included in the partnership package?',
      answer: 'All partnership tiers include access to WET testing platform, expert-led training sessions, job fair participation, and administrative dashboard. Higher tiers offer additional benefits like dedicated account managers, custom training modules, and priority job postings. Specific features vary by selected tier.'
    },
    {
      question: 'Can we customize the partnership based on our specific needs?',
      answer: 'Yes, we offer customized enterprise solutions for institutions with unique requirements. Our team can create tailored packages that align with your specific placement goals, student demographics, and budget constraints. Contact us to discuss custom partnership options.'
    },
    {
      question: 'How is student account allocation managed?',
      answer: 'After partnership approval, you\'ll receive access to the institutional dashboard where you can allocate premium accounts to final year students. The system supports bulk uploads, individual assignments, and automated distribution based on your preferences.'
    },
    {
      question: 'What kind of reporting and analytics do we receive?',
      answer: 'All partnership tiers include comprehensive reporting dashboards with real-time placement statistics, student progress tracking, engagement metrics, and outcome analysis. Professional and Enterprise tiers offer advanced analytics with customizable reports and data export capabilities.'
    },
    {
      question: 'Is there ongoing support after partnership activation?',
      answer: 'Yes, all partners receive dedicated support throughout the partnership duration. Foundation tier includes email support, Professional tier adds phone support with a dedicated account manager, and Enterprise tier provides 24/7 support with a senior account manager and priority assistance.'
    },
    {
      question: 'What is the typical ROI for institutional partnerships?',
      answer: 'Partner institutions typically see 40-60% improvement in placement rates within the first year. The enhanced placement outcomes lead to improved institutional reputation, increased student enrollment, and higher satisfaction scores. Specific ROI varies based on starting placement rates and partnership tier.'
    }
  ];

  const toggleFAQ = (index: number) => {
    if (isHydrated) {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  if (!isHydrated) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-lg"></div>
              ))}
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
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-text-secondary">
              Find answers to common questions about institutional partnership
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-base"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors duration-base"
                >
                  <span className="font-heading font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <Icon
                    name={openIndex === index ? 'ChevronUpIcon' : 'ChevronDownIcon'}
                    size={24}
                    variant="outline"
                    className="text-primary flex-shrink-0"
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-4 text-text-secondary leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary/5 rounded-xl p-8 border border-primary/20 text-center">
            <Icon name="QuestionMarkCircleIcon" size={48} variant="solid" className="text-primary mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
              Still Have Questions?
            </h3>
            <p className="text-text-secondary mb-6">
              Our partnership team is here to help you understand how Winhive can transform your institution's placement outcomes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:bg-primary/90 transition-all duration-base shadow-md hover:shadow-lg">
                Schedule Consultation
              </button>
              <button className="px-6 py-3 bg-white text-foreground font-heading font-semibold rounded-lg hover:bg-muted transition-all duration-base border border-border">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;