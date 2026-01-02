// src/lib/analytics-events.ts
import { trackEvent } from './analytics';
import type { EventParams } from '@/types/gtag';

// Student conversion funnel events
interface StudentRegistrationParams extends EventParams {
  step: 'personal_info' | 'academic_details' | 'career_preferences' | 'plan_selection';
  plan?: 'free' | 'premium';
  completion_time?: number;
}

interface StudentVerificationParams extends EventParams {
  status: 'pending' | 'approved' | 'rejected';
  college_id?: string;
}

// Success story engagement events
interface SuccessStoryParams extends EventParams {
  story_id: string;
  graduate_name?: string;
  company?: string;
  salary_range?: string;
  engagement_type: 'view' | 'video_play' | 'share' | 'filter';
}

// Feature usage events
interface FeatureUsageParams extends EventParams {
  feature_name: string;
  feature_category: 'dashboard' | 'registration' | 'career' | 'admin' | 'allocation';
  user_type: 'student' | 'college_admin' | 'guest';
  duration?: number;
}

// Student registration funnel tracking
export function trackStudentRegistrationStep(params: StudentRegistrationParams): void {
  trackEvent('student_registration_step', {
    ...params,
    funnel_stage: params.step,
    timestamp: new Date().toISOString()
  });
}

export function trackStudentRegistrationComplete(params: { plan: 'free' | 'premium'; completion_time: number }): void {
  trackEvent('student_registration_complete', {
    ...params,
    conversion: true,
    timestamp: new Date().toISOString()
  });
}

export function trackPlanSelection(params: { plan: 'free' | 'premium'; from_page: string }): void {
  trackEvent('plan_selection', {
    ...params,
    timestamp: new Date().toISOString()
  });
}

// Success story engagement tracking
export function trackSuccessStoryView(params: SuccessStoryParams): void {
  trackEvent('success_story_view', {
    ...params,
    timestamp: new Date().toISOString()
  });
}

export function trackSuccessStoryVideoPlay(params: Omit<SuccessStoryParams, 'engagement_type'>): void {
  trackEvent('success_story_video_play', {
    ...params,
    engagement_type: 'video_play',
    timestamp: new Date().toISOString()
  });
}

export function trackSuccessStoryFilter(params: { filter_type: string; filter_value: string }): void {
  trackEvent('success_story_filter', {
    ...params,
    timestamp: new Date().toISOString()
  });
}

// Feature usage tracking
export function trackFeatureUsage(params: FeatureUsageParams): void {
  trackEvent('feature_usage', {
    ...params,
    timestamp: new Date().toISOString()
  });
}

export function trackDashboardAction(params: { action: string; section: string; user_type: 'student' | 'college_admin' }): void {
  trackEvent('dashboard_action', {
    ...params,
    feature_category: 'dashboard',
    timestamp: new Date().toISOString()
  });
}

// College admin tracking
export function trackCollegeAdminAction(params: { action: string; student_count?: number; allocation_type?: string }): void {
  trackEvent('college_admin_action', {
    ...params,
    user_type: 'college_admin',
    timestamp: new Date().toISOString()
  });
}

// Student verification tracking
export function trackStudentVerification(params: StudentVerificationParams): void {
  trackEvent('student_verification', {
    ...params,
    timestamp: new Date().toISOString()
  });
}

// Generic button click tracking
export function trackButtonClick(params: { button_id: string; button_text?: string; page: string }): void {
  trackEvent('button_click', {
    ...params,
    timestamp: new Date().toISOString()
  });
}

// Form submission tracking
export function trackFormSubmit(params: { form_id: string; form_name: string; success: boolean }): void {
  trackEvent('form_submit', {
    ...params,
    timestamp: new Date().toISOString()
  });
}