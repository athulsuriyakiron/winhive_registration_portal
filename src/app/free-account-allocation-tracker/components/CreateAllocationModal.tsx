import React, { useState } from 'react';
import type { FreeAccountAllocation } from '@/types/models';

interface CreateAllocationModalProps {
  onClose: () => void;
  onSubmit: (data: Partial<FreeAccountAllocation>) => void;
}

export default function CreateAllocationModal({ onClose, onSubmit }: CreateAllocationModalProps) {
  const [formData, setFormData] = useState({
    course: '',
    batch_year: new Date().getFullYear(),
    total_quota: 0,
    allocated_count: 0,
    renewal_date: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.course.trim()) {
      newErrors.course = 'Course name is required';
    }

    if (formData.total_quota <= 0) {
      newErrors.total_quota = 'Total quota must be greater than 0';
    }

    if (formData.allocated_count < 0) {
      newErrors.allocated_count = 'Allocated count cannot be negative';
    }

    if (formData.allocated_count > formData.total_quota) {
      newErrors.allocated_count = 'Allocated count cannot exceed total quota';
    }

    if (formData.batch_year < 2000 || formData.batch_year > 2100) {
      newErrors.batch_year = 'Please enter a valid batch year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        renewal_date: formData.renewal_date ? new Date(formData.renewal_date).toISOString() : undefined
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Create New Allocation</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Course Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name *
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g., B.Tech Computer Science"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.course && <p className="text-red-600 text-sm mt-1">{errors.course}</p>}
            </div>

            {/* Batch Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Year *
              </label>
              <input
                type="number"
                value={formData.batch_year}
                onChange={(e) => setFormData({ ...formData, batch_year: parseInt(e.target.value) || 0 })}
                min="2000"
                max="2100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.batch_year && <p className="text-red-600 text-sm mt-1">{errors.batch_year}</p>}
            </div>

            {/* Total Quota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Quota *
              </label>
              <input
                type="number"
                value={formData.total_quota}
                onChange={(e) => setFormData({ ...formData, total_quota: parseInt(e.target.value) || 0 })}
                min="0"
                placeholder="Number of free accounts to allocate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.total_quota && <p className="text-red-600 text-sm mt-1">{errors.total_quota}</p>}
            </div>

            {/* Initial Allocated Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Already Allocated (Optional)
              </label>
              <input
                type="number"
                value={formData.allocated_count}
                onChange={(e) => setFormData({ ...formData, allocated_count: parseInt(e.target.value) || 0 })}
                min="0"
                max={formData.total_quota}
                placeholder="Leave 0 if starting fresh"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.allocated_count && <p className="text-red-600 text-sm mt-1">{errors.allocated_count}</p>}
              <p className="text-sm text-gray-500 mt-1">
                Available: {formData.total_quota - formData.allocated_count}
              </p>
            </div>

            {/* Renewal Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renewal Date (Optional)
              </label>
              <input
                type="date"
                value={formData.renewal_date}
                onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Any additional information about this allocation"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Allocation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}