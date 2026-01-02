'use client';

import { AppIcon } from '@/components/ui/AppIcon';

interface DashboardHeaderProps {
  userName?: string;
  collegeName?: string;
}

export default function DashboardHeader({ userName, collegeName }: DashboardHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
            <AppIcon name="dashboard" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userName?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-gray-600 mt-1">
              {collegeName || 'Your College'} • Student Dashboard
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Last login</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date().toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}