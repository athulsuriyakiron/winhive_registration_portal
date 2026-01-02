import React from 'react';
import Icon from '@/components/ui/AppIcon';

const HelpSection = () => {
  const helpItems = [
    {
      icon: 'QuestionMarkCircleIcon',
      title: 'Need Help?',
      description: 'Our support team is available 24/7 to assist you with registration',
      action: 'Contact Support',
    },
    {
      icon: 'VideoCameraIcon',
      title: 'Video Tutorial',
      description: 'Watch our step-by-step guide for completing academic details',
      action: 'Watch Now',
    },
    {
      icon: 'DocumentTextIcon',
      title: 'FAQ',
      description: 'Find answers to commonly asked questions about registration',
      action: 'View FAQs',
    },
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="LifebuoyIcon" size={24} className="text-primary" />
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Support & Resources
        </h3>
      </div>
      <div className="space-y-4">
        {helpItems.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-muted rounded-md hover:bg-muted/80 transition-colors duration-base cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name={item.icon as any} size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-text-primary mb-1">{item.title}</h4>
                <p className="text-xs text-text-secondary mb-2">{item.description}</p>
                <button className="text-xs text-primary font-medium hover:underline">
                  {item.action} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-md">
        <div className="flex items-start space-x-3">
          <Icon name="ShieldCheckIcon" size={20} className="text-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-success mb-1">Secure & Verified</p>
            <p className="text-xs text-text-secondary">
              Your academic information is encrypted and verified against institutional databases for authenticity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;