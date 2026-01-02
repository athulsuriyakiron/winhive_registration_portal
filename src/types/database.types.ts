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
    };
  };
}