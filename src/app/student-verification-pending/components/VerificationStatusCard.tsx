import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface VerificationStage {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  estimatedTime: string;
}

interface VerificationStatusCardProps {
  stages: VerificationStage[];
}

const VerificationStatusCard = ({ stages }: VerificationStatusCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircleIcon' as const, color: 'text-success' };
      case 'in-progress':
        return { name: 'ClockIcon' as const, color: 'text-warning' };
      default:
        return { name: 'ClockIcon' as const, color: 'text-text-secondary' };
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-6 lg:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="DocumentCheckIcon" size={20} variant="solid" className="text-primary" />
        </div>
        <h2 className="font-heading font-bold text-xl text-text-primary">Verification Progress</h2>
      </div>

      <div className="space-y-6">
        {stages.map((stage, index) => {
          const statusIcon = getStatusIcon(stage.status);
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className="relative">
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    stage.status === 'completed' ? 'bg-success/10' :
                    stage.status === 'in-progress' ? 'bg-warning/10' : 'bg-muted'
                  }`}>
                    <Icon 
                      name={statusIcon.name} 
                      size={20} 
                      variant={stage.status === 'completed' ? 'solid' : 'outline'}
                      className={statusIcon.color}
                    />
                  </div>
                  {!isLast && (
                    <div className={`absolute left-5 top-10 w-0.5 h-12 ${
                      stage.status === 'completed' ? 'bg-success/30' : 'bg-border'
                    }`} />
                  )}
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading font-semibold text-base text-text-primary">
                      {stage.title}
                    </h3>
                    {stage.status === 'in-progress' && (
                      <span className="px-3 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                        In Progress
                      </span>
                    )}
                    {stage.status === 'completed' && (
                      <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{stage.description}</p>
                  <p className="text-xs text-text-secondary flex items-center space-x-1">
                    <Icon name="ClockIcon" size={14} variant="outline" />
                    <span>Est. Time: {stage.estimatedTime}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationStatusCard;