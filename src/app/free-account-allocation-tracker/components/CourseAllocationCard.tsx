import React, { useState } from 'react';
import type { FreeAccountAllocation } from '@/types/models';

interface CourseAllocationCardProps {
  allocation: FreeAccountAllocation;
  onUpdate: (id: string, updates: Partial<FreeAccountAllocation>) => void;
  onViewHistory: (allocation: FreeAccountAllocation) => void;
}

export default function CourseAllocationCard({ allocation, onUpdate, onViewHistory }: CourseAllocationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuota, setEditedQuota] = useState(allocation.total_quota);

  const usagePercentage = Math.round((allocation.allocated_count / allocation.total_quota) * 100);
  const isNearCapacity = usagePercentage >= 80;
  const isDepleted = allocation.allocation_status === 'depleted';

  const getStatusColor = () => {
    if (isDepleted) return 'bg-red-100 text-red-800';
    if (allocation.allocation_status === 'expired') return 'bg-gray-100 text-gray-800';
    if (isNearCapacity) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const handleSaveQuota = () => {
    if (editedQuota !== allocation.total_quota && editedQuota >= allocation.allocated_count) {
      onUpdate(allocation.id, { total_quota: editedQuota });
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{allocation.course}</h3>
          <p className="text-sm text-gray-600">Batch {allocation.batch_year}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {allocation.allocation_status.toUpperCase()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Allocation Progress</span>
          <span className="font-medium">{usagePercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${
              isDepleted ? 'bg-red-500' : isNearCapacity ?'bg-yellow-500': 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">
            {isEditing ? (
              <input
                type="number"
                value={editedQuota}
                onChange={(e) => setEditedQuota(parseInt(e.target.value) || 0)}
                className="w-full text-center border border-gray-300 rounded px-2 py-1"
                min={allocation.allocated_count}
              />
            ) : (
              allocation.total_quota
            )}
          </p>
          <p className="text-xs text-gray-600 mt-1">Total Quota</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{allocation.allocated_count}</p>
          <p className="text-xs text-gray-600 mt-1">Allocated</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{allocation.available_count}</p>
          <p className="text-xs text-gray-600 mt-1">Available</p>
        </div>
      </div>

      {/* Renewal Date */}
      {allocation.renewal_date && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-700">
              Renewal: {new Date(allocation.renewal_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Notes */}
      {allocation.notes && (
        <p className="text-sm text-gray-600 mb-4 italic">{allocation.notes}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveQuota}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedQuota(allocation.total_quota);
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Adjust Quota
            </button>
            <button
              onClick={() => onViewHistory(allocation)}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              View History
            </button>
          </>
        )}
      </div>
    </div>
  );
}