import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface NextStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  actionable: boolean;
}

interface NextStepsCardProps {
  steps: NextStep[];
}

const NextStepsCard = ({ steps }: NextStepsCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-md p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
          <Icon name="ListBulletIcon" size={20} variant="solid" className="text-secondary" />
        </div>
        <h2 className="font-heading font-bold text-xl text-text-primary">What Happens Next?</h2>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-start space-x-4 p-4 rounded-lg border transition-all duration-base ${
              step.actionable
                ? 'border-primary/30 bg-primary/5' :'border-border bg-white'
            }`}
          >
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.actionable ? 'bg-primary text-white' : 'bg-muted text-text-secondary'
              }`}>
                <span className="font-heading font-bold text-sm">{index + 1}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-heading font-semibold text-sm text-text-primary pr-2">
                  {step.title}
                </h3>
                <Icon
                  name={step.icon as any}
                  size={18}
                  variant={step.actionable ? 'solid' : 'outline'}
                  className={step.actionable ? 'text-primary' : 'text-text-secondary'}
                />
              </div>
              <p className="text-xs text-text-secondary">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-start space-x-3 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
          <Icon name="LightBulbIcon" size={20} variant="solid" className="text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-heading font-semibold text-sm text-text-primary mb-1">Pro Tip</p>
            <p className="text-xs text-text-secondary">
              Keep your email and phone notifications enabled. We'll send you instant updates about your verification status and important platform announcements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStepsCard;