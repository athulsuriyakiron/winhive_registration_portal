'use client';

import { AppIcon } from '@/components/ui/AppIcon';
import Link from 'next/link';

interface QuickActionsCardProps {
  studentId: string;
  membershipTier: string;
}

export default function QuickActionsCard({ studentId, membershipTier }: QuickActionsCardProps) {
  const actions = [
    {
      id: 'edit-profile',
      label: 'Edit Profile',
      icon: 'edit',
      color: 'bg-blue-500',
      href: '/student-personal-information'
    },
    {
      id: 'career-prefs',
      label: 'Career Preferences',
      icon: 'target',
      color: 'bg-purple-500',
      href: '/student-career-preferences'
    },
    {
      id: 'browse-jobs',
      label: 'Browse Jobs',
      icon: 'search',
      color: 'bg-green-500',
      href: '/jobs'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'bell',
      color: 'bg-orange-500',
      href: '/notifications'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-indigo-200 transition group"
          >
            <div className={`${action.color} p-3 rounded-lg mb-2 group-hover:scale-110 transition`}>
              <AppIcon name={action.icon} size={20} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Account Settings</h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center text-sm text-gray-600 transition">
            <AppIcon name="settings" size={16} className="mr-2" />
            Account Settings
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center text-sm text-gray-600 transition">
            <AppIcon name="shield" size={16} className="mr-2" />
            Privacy & Security
          </button>
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center text-sm text-gray-600 transition">
            <AppIcon name="bell" size={16} className="mr-2" />
            Notification Preferences
          </button>
        </div>
      </div>
    </div>
  );
}