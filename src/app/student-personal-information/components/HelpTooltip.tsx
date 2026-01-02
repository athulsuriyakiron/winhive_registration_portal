'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface HelpTooltipProps {
  content: string;
}

const HelpTooltip = ({ content }: HelpTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-text-secondary hover:text-primary transition-colors duration-200"
        aria-label="Help information"
      >
        <Icon name="QuestionMarkCircleIcon" size={18} variant="outline" />
      </button>
      
      {isVisible && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-foreground text-background text-xs rounded-lg p-3 shadow-lg z-50">
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
          {content}
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;