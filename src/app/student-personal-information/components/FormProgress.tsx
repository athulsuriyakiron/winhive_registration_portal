import React from 'react';

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
}

const FormProgress = ({ currentStep, totalSteps }: FormProgressProps) => {
  const steps = [
    { number: 1, label: 'Plan Selection' },
    { number: 2, label: 'Personal Info' },
    { number: 3, label: 'Academic Details' },
    { number: 4, label: 'Career Preferences' },
    { number: 5, label: 'Payment' },
    { number: 6, label: 'Verification' }
  ];

  return (
    <div className="w-full bg-card rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Registration Progress</h3>
        <span className="text-xs text-text-secondary">Step {currentStep} of {totalSteps}</span>
      </div>
      
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  step.number < currentStep
                    ? 'bg-success text-success-foreground'
                    : step.number === currentStep
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-text-secondary'
                }`}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              <span className={`text-xs mt-2 font-medium hidden sm:block ${
                step.number === currentStep ? 'text-primary' : 'text-text-secondary'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default FormProgress;