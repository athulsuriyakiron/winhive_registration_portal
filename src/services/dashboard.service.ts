import { createClient } from '@/lib/supabase/client';
import type { StudentDashboardData } from '@/types/models';

export class DashboardService {
  private supabase = createClient();

  async getStudentDashboardData(userId: string): Promise<StudentDashboardData | null> {
    try {
      // Fetch user profile
      const { data: userProfile, error: userError } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      if (!userProfile) return null;

      // Fetch student data with college info
      const { data: studentData, error: studentError } = await this.supabase
        .from('students')
        .select(`
          *,
          colleges (
            id,
            name,
            code,
            city,
            state,
            accreditation
          )
        `)
        .eq('user_id', userId)
        .single();

      if (studentError) throw studentError;

      // Fetch membership data
      const { data: membershipData, error: membershipError } = await this.supabase
        .from('memberships')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // If no membership found, default to free tier
      const membership = membershipData || {
        tier: 'free',
        is_active: true,
        start_date: new Date().toISOString(),
        end_date: null,
        amount: 0
      };

      // Fetch career preferences if student exists
      let careerPreferences = null;
      if (studentData) {
        const { data: careerData, error: careerError } = await this.supabase
          .from('career_preferences')
          .select('*')
          .eq('student_id', studentData.id)
          .single();

        if (!careerError && careerData) {
          careerPreferences = careerData;
        }
      }

      // Calculate profile completion percentage
      const profileCompletion = this.calculateProfileCompletion(studentData, careerPreferences);

      return {
        userProfile,
        studentData,
        membership,
        careerPreferences,
        profileCompletion
      };
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      throw new Error(error.message || 'Failed to load dashboard data');
    }
  }

  private calculateProfileCompletion(student: any, careerPrefs: any): number {
    let completed = 0;
    let total = 10;

    // Basic student info (5 fields)
    if (student?.course) completed++;
    if (student?.branch) completed++;
    if (student?.cgpa) completed++;
    if (student?.year_of_study) completed++;
    if (student?.graduation_year) completed++;

    // Additional profile fields (3 fields)
    if (student?.skills && student.skills.length > 0) completed++;
    if (student?.linkedin_url) completed++;
    if (student?.github_url) completed++;

    // Career preferences (2 fields)
    if (careerPrefs?.preferred_industries && careerPrefs.preferred_industries.length > 0) completed++;
    if (careerPrefs?.preferred_locations && careerPrefs.preferred_locations.length > 0) completed++;

    return Math.round((completed / total) * 100);
  }

  async updateStudentProfile(studentId: string, updates: any) {
    try {
      const { data, error } = await this.supabase
        .from('students')
        .update(updates)
        .eq('id', studentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating student profile:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  async updateUserProfile(userId: string, updates: any) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  async getPremiumFeatureStats(studentId: string) {
    // Mock data for now - can be extended with actual feature usage tables
    return {
      wetTestsTaken: 0,
      jobFairsAttended: 0,
      expertTalksWatched: 0,
      upcomingEvents: []
    };
  }
}

export const dashboardService = new DashboardService();