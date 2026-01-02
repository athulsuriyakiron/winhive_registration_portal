import React from 'react';
import Icon from '@/components/ui/AppIcon';

const TrustBadges = () => {
  const badges = [
    { icon: 'ShieldCheckIcon', text: 'Secure & Encrypted' },
    { icon: 'LockClosedIcon', text: 'Data Protected' },
    { icon: 'CheckBadgeIcon', text: 'Verified Platform' }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center space-x-2 text-text-secondary">
          <Icon name={badge.icon as any} size={18} variant="solid" className="text-success" />
          <span className="text-xs font-medium">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;