'use client';

import React, { useState } from 'react';
import type { SuccessStory } from '@/types/success-story';
import type { Database } from '@/types/database';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';





export default function AdminTestimonialManagement() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Mock testimonials data with camelCase properties
  const [testimonials] = useState<SuccessStory[]>([
    {
      id: '1',
      graduateName: 'Priya Sharma',
      previousRole: 'Fresher',
      currentRole: 'Software Engineer',
      currentCompany: 'TCS',
      salaryBefore: 0,
      salaryAfter: 450000,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dd7e75a9-1766824954462.png",
      testimonialText: 'Winhive helped me transition from a fresher to a confident professional. The mentorship and resources were invaluable.',
      rating: 5,
      date: '2024-01-15',
      status: 'approved'
    },
    {
      id: '2',
      graduateName: 'Rahul Verma',
      previousRole: 'Intern',
      currentRole: 'Data Analyst',
      currentCompany: 'Infosys',
      salaryBefore: 180000,
      salaryAfter: 550000,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_19f9678cf-1766041086804.png",
      testimonialText: 'The career guidance and placement support at Winhive exceeded my expectations. Highly recommended!',
      rating: 5,
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: '3',
      graduateName: 'Sneha Patel',
      previousRole: 'Fresher',
      currentRole: 'UI/UX Designer',
      currentCompany: 'Wipro',
      salaryBefore: 0,
      salaryAfter: 400000,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1745333ba-1766480865582.png",
      testimonialText: 'Fantastic platform for students! The mock interviews prepared me well for real job interviews.',
      rating: 4,
      date: '2024-01-13',
      status: 'approved'
    },
    {
      id: '4',
      graduateName: 'Amit Kumar',
      previousRole: 'Fresher',
      currentRole: 'Business Analyst',
      currentCompany: 'Accenture',
      salaryBefore: 0,
      salaryAfter: 350000,
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_161425a76-1767268611699.png",
      testimonialText: 'Not satisfied with the service provided.',
      rating: 2,
      date: '2024-01-12',
      status: 'rejected'
    }
  ]);

  const filteredTestimonials = testimonials.filter((t) =>
    activeTab === 'all' ? true : t.status === activeTab
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (id: string) => {
    console.log('Approving testimonial:', id);
    alert('Testimonial approved successfully!');
  };

  const handleReject = (id: string) => {
    console.log('Rejecting testimonial:', id);
    alert('Testimonial rejected successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      console.log('Deleting testimonial:', id);
      alert('Testimonial deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Testimonial Management</h1>
              <p className="mt-1 text-sm text-gray-500">Review and manage student testimonials</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Testimonials</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{testimonials.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {testimonials.filter((t) => t.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {testimonials.filter((t) => t.status === 'approved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {testimonials.filter((t) => t.status === 'rejected').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Testimonials List */}
          <div className="p-6">
            <div className="space-y-6">
              {filteredTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Profile Image */}
                    <img
                      src={testimonial.image}
                      alt={testimonial.graduateName}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{testimonial.graduateName}</h3>
                          <p className="text-sm text-gray-600">
                            {testimonial.currentRole} at {testimonial.currentCompany}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Previously: {testimonial.previousRole}
                          </p>
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            Salary Growth: ₹{(testimonial.salaryBefore / 100000).toFixed(1)}L → ₹{(testimonial.salaryAfter / 100000).toFixed(1)}L
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(testimonial.status)}`}>
                          {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{testimonial.rating}/5</span>
                      </div>

                      {/* Testimonial Text */}
                      <p className="mt-3 text-gray-700">{testimonial.testimonialText}</p>

                      {/* Date */}
                      <p className="mt-2 text-sm text-gray-500">
                        Submitted on {new Date(testimonial.date).toLocaleDateString()}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3 mt-4">
                        {testimonial.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(testimonial.id)}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(testimonial.id)}
                              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTestimonials.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No testimonials found</h3>
                <p className="mt-1 text-sm text-gray-500">No testimonials match the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}