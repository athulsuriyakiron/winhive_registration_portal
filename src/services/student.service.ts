import { supabase } from '@/lib/supabase/client';
import { Student } from '@/types/models';
import { Database } from '@/types/database.types';

type StudentRow = Database['public']['Tables']['students']['Row'];
type StudentInsert = Database['public']['Tables']['students']['Insert'];
type StudentUpdate = Database['public']['Tables']['students']['Update'];

export const studentService = {
  async createStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) {
    // Convert camelCase to snake_case
    const insertData: StudentInsert = {
      user_id: studentData.userId,
      college_id: studentData.collegeId,
      enrollment_number: studentData.enrollmentNumber,
      course: studentData.course,
      branch: studentData.branch,
      year_of_study: studentData.yearOfStudy,
      graduation_year: studentData.graduationYear,
      cgpa: studentData.cgpa,
      date_of_birth: studentData.dateOfBirth,
      gender: studentData.gender,
      student_status: studentData.studentStatus,
      verification_status: studentData.verificationStatus,
      skills: studentData.skills,
      resume_url: studentData.resumeUrl,
      linkedin_url: studentData.linkedinUrl,
      github_url: studentData.githubUrl,
      portfolio_url: studentData.portfolioUrl,
    };

    const { data, error } = await supabase
      .from('students')
      .insert(insertData)
      .select()
      .single();

    if (error) return { data: null, error };

    // Convert back to camelCase
    const student: Student = {
      id: data.id,
      userId: data.user_id,
      collegeId: data.college_id ?? undefined,
      enrollmentNumber: data.enrollment_number ?? undefined,
      course: data.course,
      branch: data.branch ?? undefined,
      yearOfStudy: data.year_of_study ?? undefined,
      graduationYear: data.graduation_year ?? undefined,
      cgpa: data.cgpa ?? undefined,
      dateOfBirth: data.date_of_birth ?? undefined,
      gender: data.gender ?? undefined,
      studentStatus: data.student_status,
      verificationStatus: data.verification_status,
      skills: data.skills ?? undefined,
      resumeUrl: data.resume_url ?? undefined,
      linkedinUrl: data.linkedin_url ?? undefined,
      githubUrl: data.github_url ?? undefined,
      portfolioUrl: data.portfolio_url ?? undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: student, error: null };
  },

  async getStudentByUserId(userId: string): Promise<{ data: Student | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return { data: null, error };

    const student: Student = {
      id: data.id,
      userId: data.user_id,
      collegeId: data.college_id ?? undefined,
      enrollmentNumber: data.enrollment_number ?? undefined,
      course: data.course,
      branch: data.branch ?? undefined,
      yearOfStudy: data.year_of_study ?? undefined,
      graduationYear: data.graduation_year ?? undefined,
      cgpa: data.cgpa ?? undefined,
      dateOfBirth: data.date_of_birth ?? undefined,
      gender: data.gender ?? undefined,
      studentStatus: data.student_status,
      verificationStatus: data.verification_status,
      skills: data.skills ?? undefined,
      resumeUrl: data.resume_url ?? undefined,
      linkedinUrl: data.linkedin_url ?? undefined,
      githubUrl: data.github_url ?? undefined,
      portfolioUrl: data.portfolio_url ?? undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: student, error: null };
  },

  async updateStudent(studentId: string, updates: Partial<Omit<Student, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
    // Convert camelCase to snake_case
    const dbUpdates: StudentUpdate = {};
    if (updates.collegeId !== undefined) dbUpdates.college_id = updates.collegeId;
    if (updates.enrollmentNumber !== undefined) dbUpdates.enrollment_number = updates.enrollmentNumber;
    if (updates.course !== undefined) dbUpdates.course = updates.course;
    if (updates.branch !== undefined) dbUpdates.branch = updates.branch;
    if (updates.yearOfStudy !== undefined) dbUpdates.year_of_study = updates.yearOfStudy;
    if (updates.graduationYear !== undefined) dbUpdates.graduation_year = updates.graduationYear;
    if (updates.cgpa !== undefined) dbUpdates.cgpa = updates.cgpa;
    if (updates.dateOfBirth !== undefined) dbUpdates.date_of_birth = updates.dateOfBirth;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.studentStatus !== undefined) dbUpdates.student_status = updates.studentStatus;
    if (updates.verificationStatus !== undefined) dbUpdates.verification_status = updates.verificationStatus;
    if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
    if (updates.resumeUrl !== undefined) dbUpdates.resume_url = updates.resumeUrl;
    if (updates.linkedinUrl !== undefined) dbUpdates.linkedin_url = updates.linkedinUrl;
    if (updates.githubUrl !== undefined) dbUpdates.github_url = updates.githubUrl;
    if (updates.portfolioUrl !== undefined) dbUpdates.portfolio_url = updates.portfolioUrl;

    const { data, error } = await supabase
      .from('students')
      .update(dbUpdates)
      .eq('id', studentId)
      .select()
      .single();

    return { data, error };
  },
};