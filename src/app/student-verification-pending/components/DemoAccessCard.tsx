import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface DemoFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
  alt: string;
  available: boolean;
}

interface DemoAccessCardProps {
  features: DemoFeature[];
  onFeatureClick: (featureId: number) => void;
}

const DemoAccessCard = ({ features, onFeatureClick }: DemoAccessCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-md p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
            <Icon name="PlayCircleIcon" size={20} variant="solid" className="text-accent" />
          </div>
          <h2 className="font-heading font-bold text-xl text-text-primary">Explore Demo Content</h2>
        </div>
        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
          Free Access
        </span>
      </div>

      <p className="text-sm text-text-secondary mb-6">
        While your account is being verified, explore our premium features with demo content. Get a preview of what awaits you!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onFeatureClick(feature.id)}
            disabled={!feature.available}
            className={`text-left p-4 rounded-lg border transition-all duration-base ${
              feature.available
                ? 'border-border hover:border-primary hover:shadow-md bg-white cursor-pointer'
                : 'border-border bg-muted cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                <AppImage
                  src={feature.image}
                  alt={feature.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon 
                    name={feature.icon as any} 
                    size={16} 
                    variant="solid" 
                    className={feature.available ? 'text-primary' : 'text-text-secondary'}
                  />
                  <h3 className="font-heading font-semibold text-sm text-text-primary truncate">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2">{feature.description}</p>
                {feature.available && (
                  <div className="flex items-center space-x-1 mt-2 text-primary">
                    <span className="text-xs font-medium">Try Demo</span>
                    <Icon name="ArrowRightIcon" size={12} variant="outline" />
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoAccessCard;