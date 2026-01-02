'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { dashboardService } from '@/services/dashboard.service';
import type { StudentDashboardData, PremiumFeatureStats } from '@/types/models';
import Header from '@/components/common/Header';
import DashboardHeader from './components/DashboardHeader';
import ProfileCard from './components/ProfileCard';
import MembershipCard from './components/MembershipCard';
import PremiumFeaturesCard from './components/PremiumFeaturesCard';
import QuickActionsCard from './components/QuickActionsCard';
import CareerProgressCard from './components/CareerProgressCard';
import UpcomingEventsCard from './components/UpcomingEventsCard';
import { trackFeatureUsage } from '@/lib/analytics-events';

export default function StudentDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [featureStats, setFeatureStats] = useState<PremiumFeatureStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track dashboard view
    trackFeatureUsage({
      feature_name: 'student_dashboard',
      feature_category: 'dashboard',
      user_type: 'student'
    });
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const [data, stats] = await Promise.all([
        dashboardService.getStudentDashboardData(user.id),
        dashboardService.getPremiumFeatureStats(user.id)
      ]);

      if (!data) {
        setError('Unable to load dashboard data. Please try again.');
        return;
      }

      setDashboardData(data);
      setFeatureStats(stats);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
      console.error('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Dashboard</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader 
          userName={dashboardData.userProfile.full_name}
          collegeName={dashboardData.studentData.colleges?.name}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column - Profile & Membership */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard 
              userProfile={dashboardData.userProfile}
              studentData={dashboardData.studentData}
              profileCompletion={dashboardData.profileCompletion}
            />
            <MembershipCard 
              membership={dashboardData.membership}
            />
          </div>

          {/* Middle Column - Premium Features & Career Progress */}
          <div className="lg:col-span-1 space-y-6">
            <PremiumFeaturesCard 
              membership={dashboardData.membership}
              featureStats={featureStats}
            />
            <CareerProgressCard 
              studentData={dashboardData.studentData}
              careerPreferences={dashboardData.careerPreferences}
            />
          </div>

          {/* Right Column - Quick Actions & Events */}
          <div className="lg:col-span-1 space-y-6">
            <QuickActionsCard 
              studentId={dashboardData.studentData.id}
              membershipTier={dashboardData.membership.tier}
            />
            <UpcomingEventsCard 
              events={featureStats?.upcomingEvents || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}