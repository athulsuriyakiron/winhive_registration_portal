import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface SuccessStory {
  id: number;
  name: string;
  college: string;
  company: string;
  package: string;
  image: string;
  alt: string;
  testimonial: string;
}

interface SuccessStoriesCardProps {
  stories: SuccessStory[];
}

const SuccessStoriesCard = ({ stories }: SuccessStoriesCardProps) => {
  return (
    <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg border border-accent/20 p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
          <Icon name="TrophyIcon" size={20} variant="solid" className="text-white" />
        </div>
        <h2 className="font-heading font-bold text-xl text-text-primary">Success Stories</h2>
      </div>

      <p className="text-sm text-text-secondary mb-6">
        While you wait, read how other students transformed their careers with Winhive. You're next!
      </p>

      <div className="space-y-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow duration-base"
          >
            <div className="flex items-start space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                <AppImage
                  src={story.image}
                  alt={story.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-text-primary">
                      {story.name}
                    </h3>
                    <p className="text-xs text-text-secondary">{story.college}</p>
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 bg-accent/10 rounded-full">
                    <Icon name="StarIcon" size={12} variant="solid" className="text-accent" />
                    <span className="text-xs font-medium text-accent">{story.package}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mb-2 line-clamp-2">{story.testimonial}</p>
                <div className="flex items-center space-x-2">
                  <Icon name="BuildingOfficeIcon" size={14} variant="outline" className="text-primary" />
                  <span className="text-xs font-medium text-primary">{story.company}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="UserGroupIcon" size={20} variant="solid" className="text-primary" />
            </div>
            <div>
              <p className="font-heading font-semibold text-sm text-text-primary">Join 5,000+ Placed Students</p>
              <p className="text-xs text-text-secondary">Average package: ₹4.5 LPA</p>
            </div>
          </div>
          <Icon name="ArrowRightIcon" size={20} variant="outline" className="text-primary" />
        </div>
      </div>
    </div>
  );
};

export default SuccessStoriesCard;