import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { label: string; icon: string }[];
}

const ProgressIndicator = ({ currentStep, totalSteps, steps }: ProgressIndicatorProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-base text-text-primary">Registration Progress</h3>
        <span className="text-sm font-medium text-primary">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        
        <div className="relative flex justify-between">
          {steps.map((step, idx) => {
            const stepNumber = idx + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-muted text-text-secondary'
                  }`}
                >
                  {isCompleted ? (
                    <Icon name="CheckIcon" size={20} variant="solid" />
                  ) : (
                    <Icon name={step.icon as any} size={20} variant={isCurrent ? 'solid' : 'outline'} />
                  )}
                </div>
                <p
                  className={`text-xs mt-2 text-center max-w-[80px] ${
                    isCurrent ? 'text-primary font-semibold' : 'text-text-secondary'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;