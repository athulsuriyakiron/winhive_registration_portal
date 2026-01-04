'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collegeAdminService, DashboardStats } from '@/services/college-admin.service';
import { realtimeService } from '@/services/realtime.service';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { StudentRow } from '@/types/database.types';
import { useRouter } from 'next/navigation';
import { trackFeatureUsage, trackDashboardAction } from '@/lib/analytics-events';

export default function CollegeAdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [collegeInfo, setCollegeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeNotifications, setRealtimeNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Track admin dashboard view
    trackFeatureUsage({
      feature_name: 'college_admin_dashboard',
      feature_category: 'admin',
      user_type: 'college_admin'
    });
    
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!collegeInfo?.id) return;

    // Subscribe to real-time student verification changes
    const unsubscribeVerifications = realtimeService.subscribeToCollegeStudentVerifications(
      collegeInfo.id,
      (payload: RealtimePostgresChangesPayload<StudentRow>) => {
        const student = payload?.new;
        const oldStatus = payload?.old?.verification_status;
        const newStatus = student?.verification_status;

        // Add notification for verification status change
        if (oldStatus && newStatus && oldStatus !== newStatus) {
          const notification = `Student ${student?.enrollment_number || 'Unknown'} verification status changed from ${oldStatus} to ${newStatus}`;
          setRealtimeNotifications(prev => [notification, ...prev].slice(0, 5));
          
          // Refresh dashboard stats
          fetchDashboardData();
        }
      }
    );

    return () => {
      unsubscribeVerifications();
    };
  }, [collegeInfo?.id]);

  const fetchDashboardData = async () => {
    if (authLoading) return;

    if (!user) {
      router?.push('/login');
      return;
    }

    try {
      setLoading(true);

      // Get college details for this admin
      const college = await collegeAdminService?.getCollegeDetails(user?.id);
      
      if (!college) {
        setError('College information not found. Please contact support.');
        setLoading(false);
        return;
      }

      setCollegeInfo(college);

      // Get dashboard statistics
      const dashboardStats = await collegeAdminService?.getDashboardStats(college?.id);
      
      if (dashboardStats) {
        setStats(dashboardStats);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError('An error occurred while loading the dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location?.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Real-time Notifications */}
      {realtimeNotifications?.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-2">
          {realtimeNotifications?.map((notification, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-4 animate-slide-in-right"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 flex-1">{notification}</p>
                <button
                  onClick={() => setRealtimeNotifications(prev => prev.filter((_, i) => i !== index))}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">College Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">{collegeInfo?.name || 'Loading...'}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router?.push('/student-verification-management')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Manage Verifications
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalStudents || 0}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Verifications */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.pendingVerifications || 0}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Verified Students */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Verified</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.verifiedStudents || 0}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Rejected</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.rejectedStudents || 0}</p>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Course Breakdown */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Students by Course</h3>
            <div className="space-y-4">
              {stats?.courseBreakdown && stats?.courseBreakdown?.length > 0 ? (
                stats?.courseBreakdown?.map((item, index) => {
                  const percentage = stats?.totalStudents > 0 ? (item?.count / stats?.totalStudents) * 100 : 0;
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{item?.course}</span>
                        <span className="text-sm font-bold text-gray-900">{item?.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-8">No course data available</p>
              )}
            </div>
          </div>

          {/* Batch Breakdown */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Students by Graduation Year</h3>
            <div className="space-y-4">
              {stats?.batchBreakdown && stats?.batchBreakdown?.length > 0 ? (
                stats?.batchBreakdown?.map((item, index) => {
                  const percentage = stats?.totalStudents > 0 ? (item?.count / stats?.totalStudents) * 100 : 0;
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Batch {item?.year}</span>
                        <span className="text-sm font-bold text-gray-900">{item?.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-8">No batch data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Membership Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Free Account Allocations by Tier</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats?.membershipBreakdown && stats?.membershipBreakdown?.length > 0 ? (
              stats?.membershipBreakdown?.map((item, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">{item?.tier}</p>
                  <p className="text-4xl font-bold text-gray-900">{item?.count}</p>
                  <p className="text-sm text-gray-500 mt-2">Active Accounts</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8 col-span-3">No membership data available</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => {
              // Track admin action
              trackDashboardAction({
                action: 'review_verifications',
                section: 'quick_actions',
                user_type: 'college_admin'
              });
              
              router?.push('/student-verification-management');
            }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Review Verifications</h4>
            <p className="text-gray-600 text-sm">Approve or reject pending student verifications</p>
          </button>

          <button
            onClick={() => {
              // Track admin action
              trackDashboardAction({
                action: 'view_reports',
                section: 'quick_actions',
                user_type: 'college_admin'
              });
              
              router?.push('/student-verification-management?status=verified');
            }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">View Reports</h4>
            <p className="text-gray-600 text-sm">Access detailed student verification reports</p>
          </button>

          <button
            onClick={() => {
              // Track admin action
              trackDashboardAction({
                action: 'bulk_import',
                section: 'quick_actions',
                user_type: 'college_admin'
              });
              
              router?.push('/student-verification-management?status=bulk_import');
            }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Bulk Import</h4>
            <p className="text-gray-600 text-sm">Import student data from CSV or Excel</p>
          </button>
        </div>
      </main>
    </div>
  );
}