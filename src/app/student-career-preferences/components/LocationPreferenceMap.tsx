'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface LocationPreferenceMapProps {
  locations: {
    id: string;
    city: string;
    state: string;
    opportunities: number;
    avgSalary: string;
    topIndustries: string[];
  }[];
  selectedLocations: string[];
  onToggleLocation: (id: string) => void;
}

const LocationPreferenceMap = ({ locations, selectedLocations, onToggleLocation }: LocationPreferenceMapProps) => {
  return (
    <div className="space-y-3">
      {locations.map((location) => {
        const isSelected = selectedLocations.includes(location.id);
        return (
          <button
            key={location.id}
            onClick={() => onToggleLocation(location.id)}
            className={`w-full p-5 rounded-lg border-2 transition-all duration-300 text-left ${
              isSelected
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-muted text-primary'}`}>
                  <Icon name="MapPinIcon" size={20} variant={isSelected ? 'solid' : 'outline'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-heading font-semibold text-base text-text-primary">{location.city}</h4>
                    <span className="text-sm text-text-secondary">• {location.state}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Job Opportunities</p>
                      <p className="font-heading font-semibold text-sm text-primary">
                        {location.opportunities.toLocaleString()}+
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary mb-1">Avg. Salary</p>
                      <p className="font-heading font-semibold text-sm text-success">{location.avgSalary}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-text-secondary mb-2">Top Industries:</p>
                    <div className="flex flex-wrap gap-2">
                      {location.topIndustries.map((industry, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-muted text-text-primary text-xs rounded-md font-medium"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`p-1 rounded-full ml-3 ${isSelected ? 'bg-primary' : 'bg-muted'}`}>
                <Icon
                  name={isSelected ? 'CheckIcon' : 'PlusIcon'}
                  size={16}
                  variant="solid"
                  className={isSelected ? 'text-white' : 'text-text-secondary'}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default LocationPreferenceMap;