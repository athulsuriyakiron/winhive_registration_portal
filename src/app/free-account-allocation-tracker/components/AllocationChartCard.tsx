import React from 'react';
import type { FreeAccountAllocation } from '@/types/models';

interface AllocationChartCardProps {
  allocations: FreeAccountAllocation[];
}

export default function AllocationChartCard({ allocations }: AllocationChartCardProps) {
  // Group allocations by course
  const courseData = allocations.reduce((acc, allocation) => {
    const course = allocation.course;
    if (!acc[course]) {
      acc[course] = {
        course,
        totalQuota: 0,
        allocated: 0,
        available: 0
      };
    }
    acc[course].totalQuota += allocation.total_quota;
    acc[course].allocated += allocation.allocated_count;
    acc[course].available += allocation.available_count;
    return acc;
  }, {} as Record<string, { course: string; totalQuota: number; allocated: number; available: number }>);

  const courses = Object.values(courseData);
  const maxValue = Math.max(...courses.map(c => c.totalQuota), 1);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Allocation Overview by Course</h2>
      
      {courses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No allocation data available</p>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((courseData, index) => {
            const allocatedPercentage = (courseData.allocated / maxValue) * 100;
            const availablePercentage = (courseData.available / maxValue) * 100;
            const usageRate = courseData.totalQuota > 0 
              ? Math.round((courseData.allocated / courseData.totalQuota) * 100)
              : 0;

            return (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{courseData.course}</h3>
                  <span className="text-sm text-gray-600">
                    {courseData.allocated} / {courseData.totalQuota} ({usageRate}%)
                  </span>
                </div>
                
                <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${allocatedPercentage}%` }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                      {courseData.allocated > 0 && `${courseData.allocated} Allocated`}
                    </span>
                  </div>
                  <div
                    className="absolute top-0 h-full bg-blue-300 transition-all duration-300"
                    style={{ 
                      left: `${allocatedPercentage}%`,
                      width: `${availablePercentage}%` 
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-gray-700 text-sm font-medium">
                      {courseData.available > 0 && `${courseData.available} Available`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Allocated: {courseData.allocated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-300 rounded"></div>
                    <span className="text-gray-600">Available: {courseData.available}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 rounded border border-gray-300"></div>
                    <span className="text-gray-600">Total: {courseData.totalQuota}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Capacity Planning Indicators:</p>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Healthy (below 80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Near Capacity (80-95%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600">Critical (above 95%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}