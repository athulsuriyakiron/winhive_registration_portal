import React from 'react';
import Icon from '@/components/ui/AppIcon';

const ProblemRecognition = () => {
  const challenges = [
    {
      icon: 'ExclamationTriangleIcon',
      title: 'Limited Campus Placements',
      description: 'Many colleges lack comprehensive placement support, leaving students to navigate the competitive job market independently with minimal guidance.'
    },
    {
      icon: 'ClockIcon',
      title: 'Time-Consuming Job Search',
      description: 'Freshers spend 6-8 months on average finding their first job, missing crucial career momentum.'
    },
    {
      icon: 'DocumentTextIcon',
      title: 'Resume & Interview Struggles',
      description: 'Without proper guidance, 70% of freshers fail to showcase their potential effectively to employers.'
    },
    {
      icon: 'CurrencyRupeeIcon',
      title: 'Below-Market Salaries',
      description: 'Unprepared candidates often accept offers 30-40% below market rates due to lack of negotiation skills.'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-text-primary mb-4">
            The Fresher Struggle is <span className="text-error">Real</span>
          </h2>
          <p className="text-lg text-text-secondary">
            We understand because we've solved it. Here's what most fresh graduates face without proper guidance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {challenges.map((challenge, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-base border border-border">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name={challenge.icon as any} size={24} variant="solid" className="text-error" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-text-secondary">
                    {challenge.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemRecognition;