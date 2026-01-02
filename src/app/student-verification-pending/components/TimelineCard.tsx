import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TimelineCardProps {
  estimatedDays: number;
  notificationMethods: string[];
}

const TimelineCard = ({ estimatedDays, notificationMethods }: TimelineCardProps) => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/20 p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <Icon name="CalendarDaysIcon" size={20} variant="solid" className="text-white" />
        </div>
        <h2 className="font-heading font-bold text-xl text-text-primary">Expected Timeline</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="font-heading font-bold text-2xl text-primary">{estimatedDays}</span>
          </div>
          <div>
            <p className="font-heading font-semibold text-base text-text-primary">Business Days</p>
            <p className="text-sm text-text-secondary">Average verification time</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="font-heading font-semibold text-sm text-text-primary mb-3">
            You'll receive updates via:
          </p>
          <div className="space-y-2">
            {notificationMethods.map((method, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center">
                  <Icon name="CheckIcon" size={14} variant="solid" className="text-accent" />
                </div>
                <span className="text-sm text-text-secondary">{method}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-start space-x-3 p-4 bg-warning/5 rounded-lg border border-warning/20">
            <Icon name="InformationCircleIcon" size={20} variant="solid" className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary">
              Verification may take longer during peak admission periods. We'll keep you updated on any delays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;