'use client';

import { AppIcon } from '@/components/ui/AppIcon';
import type { Student, CareerPreference } from '@/types/models';

interface CareerProgressCardProps {
  studentData: Student;
  careerPreferences: CareerPreference | null;
}

export default function CareerProgressCard({ studentData, careerPreferences }: CareerProgressCardProps) {
  const milestones = [
    {
      id: 'profile-complete',
      label: 'Profile Complete',
      completed: studentData.cgpa && studentData.skills && studentData.skills.length > 0,
      icon: 'user'
    },
    {
      id: 'career-prefs-set',
      label: 'Career Preferences Set',
      completed: careerPreferences !== null,
      icon: 'target'
    },
    {
      id: 'resume-uploaded',
      label: 'Resume Uploaded',
      completed: !!studentData.resume_url,
      icon: 'file'
    },
    {
      id: 'verified',
      label: 'Profile Verified',
      completed: studentData.verification_status === 'verified',
      icon: 'check'
    }
  ];

  const completedCount = milestones.filter(m => m.completed).length;
  const progress = (completedCount / milestones.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Career Progress</h3>
        <span className="text-sm font-semibold text-indigo-600">
          {completedCount}/{milestones.length} Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`flex items-center space-x-3 p-3 rounded-lg transition ${
              milestone.completed
                ? 'bg-green-50 border border-green-200' :'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className={`p-2 rounded-lg ${
              milestone.completed ? 'bg-green-100' : 'bg-gray-200'
            }`}>
              <AppIcon
                name={milestone.icon}
                size={16}
                className={milestone.completed ? 'text-green-600' : 'text-gray-400'}
              />
            </div>
            <span className={`text-sm font-medium flex-1 ${
              milestone.completed ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {milestone.label}
            </span>
            {milestone.completed ? (
              <AppIcon name="check" size={16} className="text-green-600" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Career Preferences Summary */}
      {careerPreferences && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Career Goals</h4>
          <div className="space-y-2">
            {careerPreferences.preferred_industries && careerPreferences.preferred_industries.length > 0 && (
              <div>
                <span className="text-xs text-gray-500">Industries:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {careerPreferences.preferred_industries.slice(0, 3).map((industry, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs"
                    >
                      {industry}
                    </span>
                  ))}
                  {careerPreferences.preferred_industries.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      +{careerPreferences.preferred_industries.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
            {careerPreferences.preferred_locations && careerPreferences.preferred_locations.length > 0 && (
              <div>
                <span className="text-xs text-gray-500">Locations:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {careerPreferences.preferred_locations.slice(0, 3).map((location, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs"
                    >
                      {location}
                    </span>
                  ))}
                  {careerPreferences.preferred_locations.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      +{careerPreferences.preferred_locations.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {progress < 100 && (
        <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
          Complete Your Profile
        </button>
      )}
    </div>
  );
}