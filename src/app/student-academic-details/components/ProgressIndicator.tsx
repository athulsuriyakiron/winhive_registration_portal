import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProgressStep {
  number: number;
  label: string;
  completed: boolean;
}

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  const steps: ProgressStep[] = [
    { number: 1, label: 'Plan Selection', completed: true },
    { number: 2, label: 'Personal Info', completed: true },
    { number: 3, label: 'Academic Details', completed: false },
    { number: 4, label: 'Career Preferences', completed: false },
    { number: 5, label: 'Verification', completed: false },
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-sm font-medium text-text-secondary mb-4">Registration Progress</h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-base ${
                  step.number < currentStep
                    ? 'bg-success text-success-foreground'
                    : step.number === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-text-secondary'
                }`}
              >
                {step.number < currentStep ? (
                  <Icon name="CheckIcon" size={16} variant="solid" />
                ) : (
                  step.number
                )}
              </div>
              <div className="ml-3 flex-1">
                <p
                  className={`text-sm font-medium ${
                    step.number === currentStep ? 'text-primary' : 'text-text-primary'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
            {step.number === currentStep && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-xs text-primary font-medium">In Progress</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;