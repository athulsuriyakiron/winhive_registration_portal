'use client';

import { AppIcon } from '@/components/ui/AppIcon';
import type { Membership, PremiumFeatureStats } from '@/types/models';

interface PremiumFeaturesCardProps {
  membership: Membership;
  featureStats: PremiumFeatureStats | null;
}

export default function PremiumFeaturesCard({ membership, featureStats }: PremiumFeaturesCardProps) {
  const isPremium = membership.tier === 'premium' || membership.tier === 'enterprise';

  const features = [
    {
      id: 'wet-testing',
      name: 'WET Testing',
      description: 'Aptitude & Technical Assessments',
      icon: 'brain',
      stat: featureStats?.wetTestsTaken || 0,
      statLabel: 'Tests Taken',
      locked: !isPremium
    },
    {
      id: 'job-fairs',
      name: 'Job Fairs',
      description: 'Virtual & On-campus Events',
      icon: 'briefcase',
      stat: featureStats?.jobFairsAttended || 0,
      statLabel: 'Events Attended',
      locked: !isPremium
    },
    {
      id: 'expert-talks',
      name: 'Expert Talks',
      description: 'Industry Leaders Sessions',
      icon: 'users',
      stat: featureStats?.expertTalksWatched || 0,
      statLabel: 'Sessions Watched',
      locked: !isPremium
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Premium Features</h3>
        {!isPremium && (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            Premium Only
          </span>
        )}
      </div>

      <div className="space-y-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`relative border rounded-lg p-4 transition ${
              feature.locked
                ? 'border-gray-200 bg-gray-50' :'border-indigo-200 bg-indigo-50/50 hover:shadow-md'
            }`}
          >
            {feature.locked && (
              <div className="absolute top-2 right-2">
                <div className="bg-gray-200 p-1 rounded">
                  <AppIcon name="lock" size={14} className="text-gray-500" />
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                feature.locked ? 'bg-gray-200' : 'bg-indigo-100'
              }`}>
                <AppIcon 
                  name={feature.icon} 
                  size={20} 
                  className={feature.locked ? 'text-gray-500' : 'text-indigo-600'} 
                />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold text-sm ${
                  feature.locked ? 'text-gray-500' : 'text-gray-900'
                }`}>
                  {feature.name}
                </h4>
                <p className={`text-xs mt-1 ${
                  feature.locked ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feature.description}
                </p>
                {!feature.locked && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-2xl font-bold text-indigo-600">
                      {feature.stat}
                    </span>
                    <span className="text-xs text-gray-600">{feature.statLabel}</span>
                  </div>
                )}
              </div>
            </div>

            {!feature.locked && (
              <button className="w-full mt-3 bg-white border border-indigo-200 text-indigo-600 py-1.5 rounded text-sm font-medium hover:bg-indigo-50 transition">
                Access Now
              </button>
            )}
          </div>
        ))}
      </div>

      {!isPremium && (
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AppIcon name="crown" size={20} className="text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">Unlock Premium Features</h4>
              <p className="text-xs text-gray-600 mt-1">
                Get access to WET testing, job fairs, expert talks and much more!
              </p>
              <button className="mt-3 w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 rounded-lg hover:shadow-lg transition text-sm font-medium">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}