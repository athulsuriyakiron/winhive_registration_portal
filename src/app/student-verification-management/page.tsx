'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collegeAdminService, StudentWithDetails } from '@/services/college-admin.service';
import { useRouter, useSearchParams } from 'next/navigation';

export default function StudentVerificationManagement() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<StudentWithDetails[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentWithDetails[]>([]);
  const [collegeInfo, setCollegeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [processingBulk, setProcessingBulk] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    async function loadVerificationData() {
      if (authLoading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);

        // Get college details
        const college = await collegeAdminService.getCollegeDetails(user.id);
        
        if (!college) {
          setError('College information not found');
          setLoading(false);
          return;
        }

        setCollegeInfo(college);

        // Load students
        await loadStudents(college.id);
      } catch (err) {
        console.error('Verification data loading error:', err);
        setError('Failed to load verification data');
      } finally {
        setLoading(false);
      }
    }

    loadVerificationData();
  }, [user, authLoading, router]);

  // Load students based on filters
  async function loadStudents(collegeId: string) {
    try {
      const filters: any = {};
      
      if (statusFilter !== 'all') {
        filters.verificationStatus = statusFilter as 'pending' | 'verified' | 'rejected';
      }

      if (courseFilter !== 'all') {
        filters.course = courseFilter;
      }

      if (yearFilter !== 'all') {
        filters.graduationYear = parseInt(yearFilter);
      }

      if (searchTerm) {
        filters.searchTerm = searchTerm;
      }

      const data = await collegeAdminService.getStudentsForVerification(collegeId, filters);
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error('Error loading students:', err);
      setError('Failed to load students');
    }
  }

  // Apply filters
  useEffect(() => {
    if (!collegeInfo) return;
    loadStudents(collegeInfo.id);
  }, [statusFilter, courseFilter, yearFilter, searchTerm, collegeInfo]);

  // Handle individual verification status update
  async function handleStatusUpdate(studentId: string, status: 'verified' | 'rejected') {
    try {
      const success = await collegeAdminService.updateVerificationStatus(studentId, status);
      
      if (success) {
        // Refresh the list
        if (collegeInfo) {
          await loadStudents(collegeInfo.id);
        }
        setSelectedStudents(new Set());
      } else {
        alert('Failed to update verification status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('An error occurred while updating status');
    }
  }

  // Handle bulk approval
  async function handleBulkApproval() {
    if (selectedStudents.size === 0) {
      alert('Please select students to approve');
      return;
    }

    try {
      setProcessingBulk(true);
      const successCount = await collegeAdminService.bulkApproveStudents(Array.from(selectedStudents));
      
      alert(`Successfully approved ${successCount} out of ${selectedStudents.size} students`);
      
      // Refresh the list
      if (collegeInfo) {
        await loadStudents(collegeInfo.id);
      }
      setSelectedStudents(new Set());
    } catch (err) {
      console.error('Error in bulk approval:', err);
      alert('An error occurred during bulk approval');
    } finally {
      setProcessingBulk(false);
    }
  }

  // Toggle student selection
  function toggleStudentSelection(studentId: string) {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  }

  // Select all filtered students
  function selectAllFiltered() {
    const allIds = filteredStudents.map(s => s.id);
    setSelectedStudents(new Set(allIds));
  }

  // Get unique courses and years for filters
  const uniqueCourses = Array.from(new Set(students.map(s => s.course)));
  const uniqueYears = Array.from(new Set(students.map(s => s.graduation_year))).sort((a, b) => b - a);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading verification management...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/college-admin-dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/college-admin-dashboard')}
                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Student Verification Management</h1>
              <p className="text-gray-600 mt-1">{collegeInfo?.name || 'Loading...'}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name or enrollment number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedStudents.size > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                {selectedStudents.size} student{selectedStudents.size > 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedStudents(new Set())}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleBulkApproval}
                  disabled={processingBulk}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingBulk ? 'Processing...' : 'Approve Selected'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                      onChange={selectAllFiltered}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course & Year</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">CGPA</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Membership</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No students found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.has(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{student.user_profiles.full_name}</p>
                          <p className="text-sm text-gray-500">{student.enrollment_number}</p>
                          <p className="text-sm text-gray-500">{student.user_profiles.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{student.course}</p>
                        <p className="text-sm text-gray-500">{student.branch}</p>
                        <p className="text-sm text-gray-500">Year {student.year_of_study} • Batch {student.graduation_year}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{student.cgpa.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          student.verification_status === 'verified' 
                            ? 'bg-green-100 text-green-800'
                            : student.verification_status === 'pending' ?'bg-yellow-100 text-yellow-800' :'bg-red-100 text-red-800'
                        }`}>
                          {student.verification_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {student.memberships && student.memberships.length > 0 ? (
                          <span className="text-sm text-gray-700 capitalize">
                            {student.memberships[0].tier}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No membership</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {student.verification_status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(student.id, 'verified')}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(student.id, 'rejected')}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
            <p className="text-sm text-gray-600">Total Results</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {filteredStudents.filter(s => s.verification_status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {filteredStudents.filter(s => s.verification_status === 'verified').length}
            </p>
            <p className="text-sm text-gray-600">Verified</p>
          </div>
        </div>
      </main>
    </div>
  );
}