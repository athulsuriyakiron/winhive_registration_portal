'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface SalaryExpectationSliderProps {
  value: number;
  onChange: (value: number) => void;
  marketData: {
    percentile25: number;
    percentile50: number;
    percentile75: number;
    percentile90: number;
  };
}

const SalaryExpectationSlider = ({ value, onChange, marketData }: SalaryExpectationSliderProps) => {
  const formatSalary = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const getPercentilePosition = (amount: number) => {
    const min = 200000;
    const max = 2000000;
    return ((amount - min) / (max - min)) * 100;
  };

  const getComparisonMessage = () => {
    if (value < marketData.percentile25) {
      return { text: 'Below market average - Consider industry standards', color: 'text-warning', icon: 'ExclamationTriangleIcon' };
    } else if (value < marketData.percentile50) {
      return { text: 'Competitive entry-level expectation', color: 'text-accent', icon: 'CheckCircleIcon' };
    } else if (value < marketData.percentile75) {
      return { text: 'Above average - Strong negotiation position', color: 'text-success', icon: 'ArrowTrendingUpIcon' };
    } else {
      return { text: 'Premium range - Requires exceptional profile', color: 'text-primary', icon: 'StarIcon' };
    }
  };

  const comparison = getComparisonMessage();

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-4">
          <label className="font-heading font-semibold text-base text-text-primary">
            Expected Annual Salary
          </label>
          <div className="text-right">
            <p className="font-heading font-bold text-2xl text-primary">{formatSalary(value)}</p>
            <p className="text-xs text-text-secondary mt-1">Per Annum (CTC)</p>
          </div>
        </div>

        <div className="relative pt-8 pb-4">
          <input
            type="range"
            min="200000"
            max="2000000"
            step="50000"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, #1E40AF 0%, #1E40AF ${((value - 200000) / (2000000 - 200000)) * 100}%, #F1F5F9 ${((value - 200000) / (2000000 - 200000)) * 100}%, #F1F5F9 100%)`
            }}
          />
          
          <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-text-secondary">
            <span>₹2L</span>
            <span>₹20L</span>
          </div>

          <div className="absolute -bottom-2 left-0 right-0 h-1">
            <div
              className="absolute w-0.5 h-3 bg-warning"
              style={{ left: `${getPercentilePosition(marketData.percentile25)}%` }}
            />
            <div
              className="absolute w-0.5 h-3 bg-accent"
              style={{ left: `${getPercentilePosition(marketData.percentile50)}%` }}
            />
            <div
              className="absolute w-0.5 h-3 bg-success"
              style={{ left: `${getPercentilePosition(marketData.percentile75)}%` }}
            />
          </div>
        </div>

        <div className={`flex items-center space-x-2 mt-4 p-3 rounded-lg bg-muted`}>
          <Icon name={comparison.icon as any} size={20} variant="solid" className={comparison.color} />
          <p className={`text-sm font-medium ${comparison.color}`}>{comparison.text}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <p className="text-xs text-text-secondary mb-1">25th Percentile</p>
          <p className="font-heading font-semibold text-lg text-warning">{formatSalary(marketData.percentile25)}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <p className="text-xs text-text-secondary mb-1">Median (50th)</p>
          <p className="font-heading font-semibold text-lg text-accent">{formatSalary(marketData.percentile50)}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <p className="text-xs text-text-secondary mb-1">75th Percentile</p>
          <p className="font-heading font-semibold text-lg text-success">{formatSalary(marketData.percentile75)}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <p className="text-xs text-text-secondary mb-1">90th Percentile</p>
          <p className="font-heading font-semibold text-lg text-primary">{formatSalary(marketData.percentile90)}</p>
        </div>
      </div>
    </div>
  );
};

export default SalaryExpectationSlider;