'use client';

import { useState, useEffect } from 'react';


import Link from 'next/link';
import { successStoryService } from '@/services/success-story.service';
import type { SuccessStory } from '@/types/models';
import { trackSuccessStoryView, trackSuccessStoryVideoPlay, trackSuccessStoryFilter, trackFeatureUsage } from '@/lib/analytics-events';

interface FilterState {
  industry: string;
  placementYear: string;
  salaryRange: string;
  searchQuery: string;
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState({
    totalStories: 0,
    averageSalaryIncrease: 0,
    placementRate: 0,
    companiesHired: 0,
  });
  const [filters, setFilters] = useState<FilterState>({
    industry: '',
    placementYear: '',
    salaryRange: '',
    searchQuery: '',
  });
  const [availableIndustries, setAvailableIndustries] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [filteredStories, setFilteredStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    // Track feature usage when page loads
    trackFeatureUsage({
      feature_name: 'success_stories_page',
      feature_category: 'career',
      user_type: 'guest'
    });
    
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await successStoryService.getPublishedStories({
        limit: 12,
        offset: 0
      });
      setStories(data);
    } catch (error) {
      console.error('Error fetching success stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPlay = (story: SuccessStory) => {
    // Track video play event
    trackSuccessStoryVideoPlay({
      story_id: story.id,
      graduate_name: story.graduate_name || undefined,
      company: story.current_company || undefined,
      salary_range: story.salary_progression ? JSON.stringify(story.salary_progression) : undefined
    });
    
    setSelectedVideo(story.video_url || '');
  };

  const handleFilterChange = (filterType: string, value: string) => {
    // Track filter usage
    trackSuccessStoryFilter({
      filter_type: filterType,
      filter_value: value
    });

    if (filterType === 'company') {
      setSelectedCompany(value);
    } else if (filterType === 'industry') {
      setSelectedIndustry(value);
    } else if (filterType === 'salary') {
      setSelectedSalaryRange(value);
    }
  };

  const loadStatistics = async () => {
    try {
      const { data, error: statsError } = await successStoryService.getStatistics();
      if (!statsError && data) {
        setStatistics(data);
      }
    } catch (err) {
      console.log('Failed to load statistics', err);
    }
  };

  const formatSalary = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  useEffect(() => {
    const uniqueCompanies = Array.from(new Set(stories.map(story => story.current_company || story.company_name || story.graduate_name)));
    const uniqueIndustries = Array.from(new Set(stories.map(story => story.industry || story.graduate_name)));
    
    setAvailableIndustries(uniqueIndustries);
    setAvailableYears(Array.from(new Set(stories.map(story => story.placement_year || story.year))));
  }, [stories]);

  useEffect(() => {
    const filtered = stories.filter(story => {
      const matchesSearch = searchTerm ? 
        story.graduate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.current_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.industry?.toLowerCase().includes(searchTerm.toLowerCase()) :
        true;
      
      const matchesCompany = selectedCompany ? story.current_company === selectedCompany : true;
      const matchesIndustry = selectedIndustry ? story.industry === selectedIndustry : true;
      const matchesSalary = selectedSalaryRange ? 
        (selectedSalaryRange === '0-5' && story.salary_progression?.length <= 5) ||
        (selectedSalaryRange === '5-10' && story.salary_progression?.length > 5 && story.salary_progression?.length <= 10) ||
        (selectedSalaryRange === '10-15' && story.salary_progression?.length > 10 && story.salary_progression?.length <= 15) ||
        (selectedSalaryRange === '15+' && story.salary_progression?.length > 15) :
        true;
      
      return matchesSearch && matchesCompany && matchesIndustry && matchesSalary;
    });
    
    setFilteredStories(filtered);
  }, [stories, searchTerm, selectedCompany, selectedIndustry, selectedSalaryRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl">
            Real stories from graduates who transformed their careers with Winhive
          </p>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold mb-2">{statistics.averageSalaryIncrease}%</div>
              <div className="text-sm opacity-90">Avg Salary Increase</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold mb-2">{statistics.placementRate}%</div>
              <div className="text-sm opacity-90">Placement Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold mb-2">{statistics.totalStories}+</div>
              <div className="text-sm opacity-90">Success Stories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold mb-2">{statistics.companiesHired}+</div>
              <div className="text-sm opacity-90">Partner Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Companies</option>
                {Array.from(new Set(stories.map(story => story.current_company || story.company_name || story.graduate_name))).map(company => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Industries</option>
                {Array.from(new Set(stories.map(story => story.industry || story.graduate_name))).map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
              <select
                value={selectedSalaryRange}
                onChange={(e) => handleFilterChange('salary', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Ranges</option>
                <option value="0-5">0-5 LPA</option>
                <option value="5-10">5-10 LPA</option>
                <option value="10-15">10-15 LPA</option>
                <option value="15+">15+ LPA</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No success stories found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStories.map((story) => {
                // Track story view when rendered
                useEffect(() => {
                  trackSuccessStoryView({
                    story_id: story.id,
                    graduate_name: story.graduate_name || undefined,
                    company: story.current_company || undefined,
                    salary_range: story.salary_progression ? JSON.stringify(story.salary_progression) : undefined,
                    engagement_type: 'view'
                  });
                }, [story.id]);

                return (
                  <div key={story.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Featured Badge */}
                    {story?.isFeatured && (
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-4 py-2 text-center">
                        ⭐ Featured Story
                      </div>
                    )}

                    {/* Video Thumbnail or Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
                      {story?.videoUrl ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full p-4">
                            <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎓</div>
                            <div className="text-sm text-gray-600">{story?.student?.course}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Student Info */}
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                          {story?.student?.userProfile?.fullName?.charAt(0) || 'S'}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-gray-900">
                            {story?.student?.userProfile?.fullName || 'Student'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {story?.student?.course} • {story?.student?.college?.name}
                          </p>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                        {story?.title}
                      </h4>

                      {/* Story Preview */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {story?.storyContent}
                      </p>

                      {/* Career Progression */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Before</span>
                          <span className="text-xs text-gray-600">After</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <div className="text-sm font-semibold text-gray-700">
                              {story?.beforeRole || 'Fresher'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {story?.beforeSalary ? formatSalary(story.beforeSalary) : 'Campus'}
                            </div>
                          </div>
                          <div className="mx-2">
                            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              {story?.afterRole}
                            </div>
                            <div className="text-xs text-green-600 font-semibold">
                              {formatSalary(story?.afterSalary || 0)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Company */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {story?.companyLogoUrl ? (
                            <img 
                              src={story.companyLogoUrl} 
                              alt={story.companyName}
                              className="w-8 h-8 rounded object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                {story?.companyName?.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span className="ml-2 text-sm font-semibold text-gray-900">
                            {story?.companyName}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {story?.placementYear}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {story?.industry && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {story.industry}
                          </span>
                        )}
                        {story?.student?.branch && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {story.student.branch}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Success Story Starts Here
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of graduates who transformed their careers with Winhive premium features
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/student-welcome-plan-selection"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              View Premium Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}