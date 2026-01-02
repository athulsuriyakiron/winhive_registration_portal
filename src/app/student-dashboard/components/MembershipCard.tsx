'use client';

import { AppIcon } from '@/components/ui/AppIcon';
import type { Membership } from '@/types/models';

interface MembershipCardProps {
  membership: Membership;
}

export default function MembershipCard({ membership }: MembershipCardProps) {
  const tierInfo = {
    free: {
      name: 'Free Tier',
      color: 'from-gray-500 to-gray-600',
      icon: 'star',
      features: ['Basic job listings', 'Resume builder', 'Profile visibility']
    },
    premium: {
      name: 'Premium Tier',
      color: 'from-amber-500 to-orange-600',
      icon: 'crown',
      features: ['WET Testing', 'Priority job alerts', 'Expert talks', 'Job fairs access']
    },
    enterprise: {
      name: 'Enterprise Tier',
      color: 'from-purple-600 to-indigo-600',
      icon: 'diamond',
      features: ['All premium features', 'Dedicated support', 'Custom branding', 'Advanced analytics']
    }
  };

  const currentTier = tierInfo[membership.tier as keyof typeof tierInfo];
  const endDate = membership.end_date ? new Date(membership.end_date) : null;
  const daysRemaining = endDate 
    ? Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Membership Header */}
      <div className={`bg-gradient-to-r ${currentTier.color} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <AppIcon name={currentTier.icon} size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{currentTier.name}</h3>
              <p className="text-sm opacity-90">
                {membership.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
          {membership.is_active && (
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <AppIcon name="check" size={16} className="text-white" />
            </div>
          )}
        </div>

        {membership.tier !== 'free' && daysRemaining !== null && (
          <div className="mt-4 bg-white/10 rounded-lg p-3">
            <div className="flex justify-between items-center text-sm">
              <span>Valid until</span>
              <span className="font-semibold">
                {endDate?.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between items-center text-xs mb-1">
                <span>{daysRemaining} days remaining</span>
                <span>{Math.round((daysRemaining / 365) * 100)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((daysRemaining / 365) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Benefits</h4>
        <ul className="space-y-2">
          {currentTier.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <AppIcon name="check" size={16} className="text-green-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>

        {membership.tier === 'free' && (
          <button className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 rounded-lg hover:shadow-lg transition font-medium">
            Upgrade to Premium
          </button>
        )}

        {membership.tier !== 'free' && (
          <div className="mt-6 space-y-2">
            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
              Manage Subscription
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium">
              View Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}