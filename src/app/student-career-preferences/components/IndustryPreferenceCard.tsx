'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface IndustryPreferenceCardProps {
  industry: {
    id: string;
    name: string;
    icon: string;
    description: string;
    avgSalary: string;
    openings: number;
    growth: string;
  };
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const IndustryPreferenceCard = ({ industry, isSelected, onToggle }: IndustryPreferenceCardProps) => {
  return (
    <button
      onClick={() => onToggle(industry.id)}
      className={`w-full p-6 rounded-lg border-2 transition-all duration-300 text-left ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-muted text-primary'}`}>
            <Icon name={industry.icon as any} size={24} variant={isSelected ? 'solid' : 'outline'} />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-base text-text-primary">{industry.name}</h3>
            <p className="text-sm text-text-secondary mt-0.5">{industry.description}</p>
          </div>
        </div>
        <div className={`p-1 rounded-full ${isSelected ? 'bg-primary' : 'bg-muted'}`}>
          <Icon
            name={isSelected ? 'CheckIcon' : 'PlusIcon'}
            size={16}
            variant="solid"
            className={isSelected ? 'text-white' : 'text-text-secondary'}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-text-secondary mb-1">Avg. Salary</p>
          <p className="font-heading font-semibold text-sm text-success">{industry.avgSalary}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1">Openings</p>
          <p className="font-heading font-semibold text-sm text-text-primary">{industry.openings.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary mb-1">Growth</p>
          <p className="font-heading font-semibold text-sm text-accent">{industry.growth}</p>
        </div>
      </div>
    </button>
  );
};

export default IndustryPreferenceCard;