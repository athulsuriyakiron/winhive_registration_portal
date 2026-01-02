import { createClient } from '@/lib/supabase/client';

export interface DashboardStats {
  totalStudents: number;
  pendingVerifications: number;
  verifiedStudents: number;
  rejectedStudents: number;
  courseBreakdown: Array<{ course: string; count: number }>;
  batchBreakdown: Array<{ year: number; count: number }>;
  membershipBreakdown: Array<{ tier: string; count: number }>;
}

export interface StudentWithDetails {
  id: string;
  enrollment_number: string;
  course: string;
  branch: string;
  year_of_study: number;
  graduation_year: number;
  cgpa: number;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  user_profiles: {
    full_name: string;
    email: string;
    phone: string;
  };
  memberships: Array<{
    tier: string;
    is_active: boolean;
  }>;
}

export const collegeAdminService = {
  // Get dashboard statistics for college admin
  async getDashboardStats(collegeId: string): Promise<DashboardStats | null> {
    const supabase = createClient();

    try {
      // Get all students for this college
      const { data: students, error } = await supabase
        .from('students')
        .select(`
          id,
          course,
          graduation_year,
          verification_status,
          user_id
        `)
        .eq('college_id', collegeId);

      if (error) {
        throw error;
      }

      if (!students || students.length === 0) {
        return {
          totalStudents: 0,
          pendingVerifications: 0,
          verifiedStudents: 0,
          rejectedStudents: 0,
          courseBreakdown: [],
          batchBreakdown: [],
          membershipBreakdown: []
        };
      }

      // Get membership data for all students
      const userIds = students.map(s => s.user_id);
      const { data: memberships } = await supabase
        .from('memberships')
        .select('user_id, tier, is_active')
        .in('user_id', userIds)
        .eq('is_active', true);

      // Calculate statistics
      const totalStudents = students.length;
      const pendingVerifications = students.filter(s => s.verification_status === 'pending').length;
      const verifiedStudents = students.filter(s => s.verification_status === 'verified').length;
      const rejectedStudents = students.filter(s => s.verification_status === 'rejected').length;

      // Course breakdown
      const courseMap = new Map<string, number>();
      students.forEach(s => {
        courseMap.set(s.course, (courseMap.get(s.course) || 0) + 1);
      });
      const courseBreakdown = Array.from(courseMap.entries()).map(([course, count]) => ({ course, count }));

      // Batch breakdown by graduation year
      const batchMap = new Map<number, number>();
      students.forEach(s => {
        if (s.graduation_year) {
          batchMap.set(s.graduation_year, (batchMap.get(s.graduation_year) || 0) + 1);
        }
      });
      const batchBreakdown = Array.from(batchMap.entries()).map(([year, count]) => ({ year, count }));

      // Membership breakdown
      const membershipMap = new Map<string, number>();
      memberships?.forEach(m => {
        membershipMap.set(m.tier, (membershipMap.get(m.tier) || 0) + 1);
      });
      const membershipBreakdown = Array.from(membershipMap.entries()).map(([tier, count]) => ({ tier, count }));

      return {
        totalStudents,
        pendingVerifications,
        verifiedStudents,
        rejectedStudents,
        courseBreakdown,
        batchBreakdown,
        membershipBreakdown
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }
  },

  // Get students for verification with filters
  async getStudentsForVerification(
    collegeId: string,
    filters?: {
      verificationStatus?: 'pending' | 'verified' | 'rejected';
      course?: string;
      graduationYear?: number;
      searchTerm?: string;
    }
  ): Promise<StudentWithDetails[]> {
    const supabase = createClient();

    try {
      let query = supabase
        .from('students')
        .select(`
          id,
          enrollment_number,
          course,
          branch,
          year_of_study,
          graduation_year,
          cgpa,
          verification_status,
          created_at,
          user_id,
          user_profiles!inner (
            full_name,
            email,
            phone
          )
        `)
        .eq('college_id', collegeId);

      // Apply filters
      if (filters?.verificationStatus) {
        query = query.eq('verification_status', filters.verificationStatus);
      }

      if (filters?.course) {
        query = query.eq('course', filters.course);
      }

      if (filters?.graduationYear) {
        query = query.eq('graduation_year', filters.graduationYear);
      }

      if (filters?.searchTerm) {
        query = query.or(`enrollment_number.ilike.%${filters.searchTerm}%,user_profiles.full_name.ilike.%${filters.searchTerm}%`);
      }

      const { data: students, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!students || students.length === 0) {
        return [];
      }

      // Get membership data for each student
      const userIds = students.map(s => s.user_id);
      const { data: memberships } = await supabase
        .from('memberships')
        .select('user_id, tier, is_active')
        .in('user_id', userIds);

      // Combine data
      const studentsWithDetails: StudentWithDetails[] = students.map(student => ({
        id: student.id,
        enrollment_number: student.enrollment_number || '',
        course: student.course,
        branch: student.branch || '',
        year_of_study: student.year_of_study || 0,
        graduation_year: student.graduation_year || 0,
        cgpa: student.cgpa ? Number(student.cgpa) : 0,
        verification_status: student.verification_status,
        created_at: student.created_at || '',
        user_profiles: {
          full_name: student.user_profiles?.full_name || '',
          email: student.user_profiles?.email || '',
          phone: student.user_profiles?.phone || ''
        },
        memberships: memberships?.filter(m => m.user_id === student.user_id).map(m => ({
          tier: m.tier,
          is_active: m.is_active
        })) || []
      }));

      return studentsWithDetails;
    } catch (error) {
      console.error('Error fetching students for verification:', error);
      return [];
    }
  },

  // Update student verification status
  async updateVerificationStatus(
    studentId: string,
    status: 'pending' | 'verified' | 'rejected',
    adminNotes?: string
  ): Promise<boolean> {
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('students')
        .update({
          verification_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', studentId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error updating verification status:', error);
      return false;
    }
  },

  // Bulk approve students
  async bulkApproveStudents(studentIds: string[]): Promise<number> {
    const supabase = createClient();
    let successCount = 0;

    try {
      for (const studentId of studentIds) {
        const success = await this.updateVerificationStatus(studentId, 'verified');
        if (success) successCount++;
      }

      return successCount;
    } catch (error) {
      console.error('Error in bulk approval:', error);
      return successCount;
    }
  },

  // Get college details for admin
  async getCollegeDetails(adminId: string) {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('admin_id', adminId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching college details:', error);
      return null;
    }
  }
};