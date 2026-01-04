import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'student' | 'college_admin' | 'admin';
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: 'student' | 'college_admin' | 'admin';
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'student' | 'college_admin' | 'admin';
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      colleges: {
        Row: {
          id: string;
          name: string;
          code: string;
          address: string | null;
          city: string | null;
          state: string | null;
          country: string;
          accreditation: string | null;
          website_url: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          admin_id: string | null;
          verification_status: 'pending' | 'verified' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          accreditation?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          admin_id?: string | null;
          verification_status?: 'pending' | 'verified' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          accreditation?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          admin_id?: string | null;
          verification_status?: 'pending' | 'verified' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          college_id: string | null;
          enrollment_number: string | null;
          course: string;
          branch: string | null;
          year_of_study: number | null;
          graduation_year: number | null;
          cgpa: number | null;
          date_of_birth: string | null;
          gender: string | null;
          student_status: 'active' | 'inactive' | 'graduated';
          verification_status: 'pending' | 'verified' | 'rejected';
          skills: string[] | null;
          resume_url: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          portfolio_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          college_id?: string | null;
          enrollment_number?: string | null;
          course: string;
          branch?: string | null;
          year_of_study?: number | null;
          graduation_year?: number | null;
          cgpa?: number | null;
          date_of_birth?: string | null;
          gender?: string | null;
          student_status?: 'active' | 'inactive' | 'graduated';
          verification_status?: 'pending' | 'verified' | 'rejected';
          skills?: string[] | null;
          resume_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          portfolio_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          college_id?: string | null;
          enrollment_number?: string | null;
          course?: string;
          branch?: string | null;
          year_of_study?: number | null;
          graduation_year?: number | null;
          cgpa?: number | null;
          date_of_birth?: string | null;
          gender?: string | null;
          student_status?: 'active' | 'inactive' | 'graduated';
          verification_status?: 'pending' | 'verified' | 'rejected';
          skills?: string[] | null;
          resume_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          portfolio_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          tier: 'free' | 'premium' | 'enterprise';
          start_date: string;
          end_date: string | null;
          is_active: boolean;
          payment_id: string | null;
          amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier?: 'free' | 'premium' | 'enterprise';
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          payment_id?: string | null;
          amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tier?: 'free' | 'premium' | 'enterprise';
          start_date?: string;
          end_date?: string | null;
          is_active?: boolean;
          payment_id?: string | null;
          amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      career_preferences: {
        Row: {
          id: string;
          student_id: string;
          preferred_industries: string[] | null;
          preferred_locations: string[] | null;
          expected_salary_min: number | null;
          expected_salary_max: number | null;
          job_types: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          preferred_industries?: string[] | null;
          preferred_locations?: string[] | null;
          expected_salary_min?: number | null;
          expected_salary_max?: number | null;
          job_types?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          preferred_industries?: string[] | null;
          preferred_locations?: string[] | null;
          expected_salary_min?: number | null;
          expected_salary_max?: number | null;
          job_types?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      free_account_allocations: {
        Row: {
          id: string;
          college_id: string;
          course: string;
          batch_year: number;
          total_quota: number;
          allocated_count: number;
          available_count: number;
          allocation_status: 'active' | 'depleted' | 'expired';
          renewal_date: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          course: string;
          batch_year: number;
          total_quota?: number;
          allocated_count?: number;
          available_count?: number;
          allocation_status?: 'active' | 'depleted' | 'expired';
          renewal_date?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          course?: string;
          batch_year?: number;
          total_quota?: number;
          allocated_count?: number;
          available_count?: number;
          allocation_status?: 'active' | 'depleted' | 'expired';
          renewal_date?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      allocation_history: {
        Row: {
          id: string;
          allocation_id: string;
          student_id: string | null;
          action_type: string;
          previous_allocated: number | null;
          new_allocated: number | null;
          performed_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          allocation_id: string;
          student_id?: string | null;
          action_type: string;
          previous_allocated?: number | null;
          new_allocated?: number | null;
          performed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          allocation_id?: string;
          student_id?: string | null;
          action_type?: string;
          previous_allocated?: number | null;
          new_allocated?: number | null;
          performed_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          notification_type: 'verification_update' | 'allocation_change' | 'event_alert' | 'system_message';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          title: string;
          message: string;
          action_url: string | null;
          is_read: boolean;
          is_archived: boolean;
          read_at: string | null;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notification_type: 'verification_update' | 'allocation_change' | 'event_alert' | 'system_message';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          title: string;
          message: string;
          action_url?: string | null;
          is_read?: boolean;
          is_archived?: boolean;
          read_at?: string | null;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          notification_type?: 'verification_update' | 'allocation_change' | 'event_alert' | 'system_message';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          title?: string;
          message?: string;
          action_url?: string | null;
          is_read?: boolean;
          is_archived?: boolean;
          read_at?: string | null;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      success_stories: {
        Row: {
          id: string;
          student_id: string | null;
          title: string;
          story_content: string;
          company_name: string;
          company_logo_url: string | null;
          before_role: string | null;
          after_role: string;
          before_salary: number | null;
          after_salary: number;
          industry: string | null;
          placement_year: number | null;
          video_url: string | null;
          is_published: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id?: string | null;
          title: string;
          story_content: string;
          company_name: string;
          company_logo_url?: string | null;
          before_role?: string | null;
          after_role: string;
          before_salary?: number | null;
          after_salary: number;
          industry?: string | null;
          placement_year?: number | null;
          video_url?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string | null;
          title?: string;
          story_content?: string;
          company_name?: string;
          company_logo_url?: string | null;
          before_role?: string | null;
          after_role?: string;
          before_salary?: number | null;
          after_salary?: number;
          industry?: string | null;
          placement_year?: number | null;
          video_url?: string | null;
          is_published?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Real-time subscription type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];
export type TableRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TableInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TableUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// ✅ STEP 1: Define Specific Row Types for All Tables
export type UserProfileRow = Database['public']['Tables']['user_profiles']['Row'];
export type CollegeRow = Database['public']['Tables']['colleges']['Row'];
export type StudentRow = Database['public']['Tables']['students']['Row'];
export type MembershipRow = Database['public']['Tables']['memberships']['Row'];
export type CareerPreferenceRow = Database['public']['Tables']['career_preferences']['Row'];
export type FreeAccountAllocationRow = Database['public']['Tables']['free_account_allocations']['Row'];
export type AllocationHistoryRow = Database['public']['Tables']['allocation_history']['Row'];
export type NotificationRow = Database['public']['Tables']['notifications']['Row'];
export type SuccessStoryRow = Database['public']['Tables']['success_stories']['Row'];

// Real-time payload types for each table
export type RealtimePayload<T extends keyof Database['public']['Tables']> = 
  RealtimePostgresChangesPayload<TableRow<T>>;

// Specific real-time payload types for commonly used tables
export type StudentRealtimePayload = RealtimePayload<'students'>;
export type NotificationRealtimePayload = RealtimePayload<'notifications'>;
export type AllocationRealtimePayload = RealtimePayload<'free_account_allocations'>;
export type SuccessStoryRealtimePayload = RealtimePayload<'success_stories'>;
export type CollegeRealtimePayload = RealtimePayload<'colleges'>;
export type UserProfileRealtimePayload = RealtimePayload<'user_profiles'>;
export type MembershipRealtimePayload = RealtimePayload<'memberships'>;
export type CareerPreferenceRealtimePayload = RealtimePayload<'career_preferences'>;
export type AllocationHistoryRealtimePayload = RealtimePayload<'allocation_history'>;

// Event type for real-time subscriptions
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

// Real-time subscription handler type
export type RealtimeHandler<T extends keyof Database['public']['Tables']> = (
  payload: RealtimePayload<T>
) => void;