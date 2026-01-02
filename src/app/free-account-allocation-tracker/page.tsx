'use client';

import React, { useEffect, useState } from 'react';
import { allocationService } from '@/services/allocation.service';
import { collegeService } from '@/services/college.service';
import { realtimeService } from '@/services/realtime.service';
import { useAuth } from '@/contexts/AuthContext';
import type { FreeAccountAllocation, AllocationStats } from '@/types/models';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { trackFeatureUsage, trackCollegeAdminAction } from '@/lib/analytics-events';

// Components
import AllocationStatsCard from './components/AllocationStatsCard';
import CourseAllocationCard from './components/CourseAllocationCard';
import AllocationChartCard from './components/AllocationChartCard';
import AllocationHistoryCard from './components/AllocationHistoryCard';
import CreateAllocationModal from './components/CreateAllocationModal';

export default function FreeAccountAllocationTracker() {
  const { user, loading: authLoading } = useAuth();
  const [allocations, setAllocations] = useState<FreeAccountAllocation[]>([]);
  const [stats, setStats] = useState<AllocationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collegeId, setCollegeId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<FreeAccountAllocation | null>(null);
  const [realtimeEvents, setRealtimeEvents] = useState<any[]>([]);

  useEffect(() => {
    // Track allocation tracker usage
    trackFeatureUsage({
      feature_name: 'free_account_allocation_tracker',
      feature_category: 'allocation',
      user_type: 'college_admin'
    });
    
    fetchAllocations();
  }, []);

  useEffect(() => {
    if (!collegeId) return;

    // Subscribe to real-time allocation and history updates
    const unsubscribe = realtimeService.subscribeToCollegeAllocations(
      collegeId,
      // Allocation changes callback
      (payload: RealtimePostgresChangesPayload<any>) => {
        const allocation = payload?.new;
        
        if (payload.eventType === 'INSERT') {
          // New allocation created
          setRealtimeEvents(prev => [
            {
              id: Date.now(),
              type: 'allocation_created',
              message: `New allocation created for ${allocation?.course}`,
              timestamp: new Date()
            },
            ...prev
          ].slice(0, 10));
          
          // Refresh allocations
          fetchAllocations();
        } else if (payload.eventType === 'UPDATE') {
          // Allocation updated
          const oldAllocation = payload?.old;
          
          if (allocation?.available_count !== oldAllocation?.available_count) {
            setRealtimeEvents(prev => [
              {
                id: Date.now(),
                type: 'allocation_updated',
                message: `${allocation?.course} available count changed from ${oldAllocation?.available_count} to ${allocation?.available_count}`,
                timestamp: new Date()
              },
              ...prev
            ].slice(0, 10));
          }
          
          // Update local state
          setAllocations(prev => 
            prev?.map(alloc => 
              alloc?.id === allocation?.id ? { ...alloc, ...allocation } : alloc
            ) || []
          );
        }
      },
      // Allocation history callback
      (payload: RealtimePostgresChangesPayload<any>) => {
        const history = payload?.new;
        
        setRealtimeEvents(prev => [
          {
            id: Date.now(),
            type: 'allocation_history',
            message: `${history?.action_type}: ${history?.notes || 'Allocation updated'}`,
            timestamp: new Date()
          },
          ...prev
        ].slice(0, 10));
      }
    );

    return () => {
      unsubscribe();
    };
  }, [collegeId]);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get college for current admin
      const colleges = await collegeService.getAllColleges();
      const userCollege = colleges.find(c => c.admin_id === user?.id);

      if (!userCollege) {
        setError('No college found for current user');
        return;
      }

      setCollegeId(userCollege.id);

      // Load allocations and stats
      const [allocationsData, statsData] = await Promise.all([
        allocationService.getCollegeAllocations(userCollege.id),
        allocationService.getCollegeAllocationStats(userCollege.id)
      ]);

      setAllocations(allocationsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load allocation data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAllocation = async (allocationData: any) => {
    try {
      // Track allocation creation
      trackCollegeAdminAction({
        action: 'create_allocation',
        allocation_type: allocationData.course_type
      });
      
      if (!collegeId) return;
      
      await allocationService.createAllocation({
        ...allocationData,
        college_id: collegeId
      });
      
      setShowCreateModal(false);
      await fetchAllocations();
    } catch (error) {
      console.error('Error creating allocation:', error);
    }
  };

  const handleUpdateAllocation = async (id: string, updates: Partial<FreeAccountAllocation>) => {
    try {
      await allocationService.updateAllocation(id, updates);
      await fetchAllocations();
    } catch (err) {
      console.error('Error updating allocation:', err);
      setError('Failed to update allocation');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading allocation data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to access allocation tracker</p>
          <a href="/login" className="text-blue-600 hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAllocations}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Real-time Event Feed */}
      {realtimeEvents?.length > 0 && (
        <div className="fixed top-20 right-4 z-50 max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Live Updates
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {realtimeEvents?.map((event) => (
              <div key={event?.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-2">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    event?.type === 'allocation_created' ? 'bg-green-500' :
                    event?.type === 'allocation_updated'? 'bg-blue-500' : 'bg-purple-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{event?.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event?.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
            <button
              onClick={() => setRealtimeEvents([])}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Free Account Allocation Tracker</h1>
              <p className="text-gray-600 mt-2">Monitor and optimize free account distribution across courses and batches</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Allocation
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && <AllocationStatsCard stats={stats} />}

        {/* Allocation Chart */}
        <AllocationChartCard allocations={allocations} />

        {/* Course-wise Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course-wise Allocation</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allocations.map((allocation) => (
              <CourseAllocationCard
                key={allocation.id}
                allocation={allocation}
                onUpdate={handleUpdateAllocation}
                onViewHistory={(alloc) => setSelectedAllocation(alloc)}
              />
            ))}
          </div>
          {allocations.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No allocations found. Create your first allocation to get started.</p>
            </div>
          )}
        </div>

        {/* Allocation History Modal */}
        {selectedAllocation && (
          <AllocationHistoryCard
            allocation={selectedAllocation}
            onClose={() => setSelectedAllocation(null)}
          />
        )}

        {/* Create Allocation Modal */}
        {showCreateModal && (
          <CreateAllocationModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateAllocation}
          />
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Export Report</p>
                  <p className="text-sm text-gray-500">Download allocation data</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Set Renewal Alert</p>
                  <p className="text-sm text-gray-500">Configure notifications</p>
                </div>
              </div>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">View Analytics</p>
                  <p className="text-sm text-gray-500">Detailed insights</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}