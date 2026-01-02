'use client';

import { useState } from 'react';
import { AppIcon } from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import type { UserProfile, Student } from '@/types/models';

interface ProfileCardProps {
  userProfile: UserProfile;
  studentData: Student & { colleges?: any };
  profileCompletion: number;
}

export default function ProfileCard({ userProfile, studentData, profileCompletion }: ProfileCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {userProfile.avatar_url ? (
              <AppImage
                src={userProfile.avatar_url}
                alt={`${userProfile.full_name} profile picture`}
                className="w-16 h-16 rounded-full border-4 border-white object-cover"
                width={64}
                height={64}
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-4 border-white bg-white/20 flex items-center justify-center">
                <AppIcon name="user" size={32} className="text-white" />
              </div>
            )}
            {studentData.verification_status === 'verified' && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <AppIcon name="check" size={16} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{userProfile.full_name}</h2>
            <p className="text-indigo-100 text-sm">{studentData.enrollment_number}</p>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className={`text-sm font-bold ${getCompletionColor(profileCompletion)}`}>
              {profileCompletion}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(profileCompletion)}`}
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Course</span>
          <span className="font-semibold text-gray-900">{studentData.course}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Branch</span>
          <span className="font-semibold text-gray-900">{studentData.branch || 'Not specified'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">CGPA</span>
          <span className="font-semibold text-gray-900">{studentData.cgpa || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Year</span>
          <span className="font-semibold text-gray-900">
            {studentData.year_of_study ? `${studentData.year_of_study}th Year` : 'N/A'}
          </span>
        </div>

        {showDetails && (
          <>
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900 truncate ml-2">{userProfile.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium text-gray-900">{userProfile.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    studentData.verification_status === 'verified'
                      ? 'bg-green-100 text-green-700'
                      : studentData.verification_status === 'pending' ?'bg-yellow-100 text-yellow-700' :'bg-red-100 text-red-700'
                  }`}>
                    {studentData.verification_status}
                  </span>
                </div>
              </div>
            </div>

            {studentData.skills && studentData.skills.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {studentData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full mt-4 text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {showDetails ? 'Show Less' : 'Show More Details'}
        </button>

        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium">
          Edit Profile
        </button>
      </div>
    </div>
  );
}