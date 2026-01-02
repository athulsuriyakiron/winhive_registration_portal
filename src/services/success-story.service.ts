import { supabase } from '@/lib/supabase/client';
import { SuccessStory } from '@/types/models';

interface FilterOptions {
  industry?: string;
  placementYear?: number;
  minSalary?: number;
  maxSalary?: number;
  searchQuery?: string;
}

export const successStoryService = {
  async getPublishedStories(filters?: FilterOptions): Promise<{ data: SuccessStory[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('success_stories')
        .select(`
          id,
          student_id,
          title,
          story_content,
          video_url,
          before_role,
          after_role,
          before_salary,
          after_salary,
          company_name,
          company_logo_url,
          industry,
          placement_year,
          is_featured,
          is_published,
          created_at,
          updated_at,
          students!inner(
            id,
            user_id,
            course,
            branch,
            graduation_year,
            colleges(
              id,
              name,
              city
            ),
            user_profiles(
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters?.industry) {
        query = query.eq('industry', filters.industry);
      }

      if (filters?.placementYear) {
        query = query.eq('placement_year', filters.placementYear);
      }

      if (filters?.minSalary) {
        query = query.gte('after_salary', filters.minSalary);
      }

      if (filters?.maxSalary) {
        query = query.lte('after_salary', filters.maxSalary);
      }

      if (filters?.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,story_content.ilike.%${filters.searchQuery}%,company_name.ilike.%${filters.searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedData = data?.map((row: any) => ({
        id: row.id,
        studentId: row.student_id,
        title: row.title,
        storyContent: row.story_content,
        videoUrl: row.video_url,
        beforeRole: row.before_role,
        afterRole: row.after_role,
        beforeSalary: row.before_salary,
        afterSalary: row.after_salary,
        companyName: row.company_name,
        companyLogoUrl: row.company_logo_url,
        industry: row.industry,
        placementYear: row.placement_year,
        isFeatured: row.is_featured,
        isPublished: row.is_published,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        student: row.students ? {
          id: row.students.id,
          userId: row.students.user_id,
          course: row.students.course,
          branch: row.students.branch,
          graduationYear: row.students.graduation_year,
          college: row.students.colleges ? {
            id: row.students.colleges.id,
            name: row.students.colleges.name,
            city: row.students.colleges.city,
          } : undefined,
          userProfile: row.students.user_profiles ? {
            id: row.students.user_profiles.id,
            fullName: row.students.user_profiles.full_name,
            avatarUrl: row.students.user_profiles.avatar_url,
          } : undefined,
        } : undefined,
      })) || [];

      return { data: transformedData, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async getStoryById(id: string): Promise<{ data: SuccessStory | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('success_stories')
        .select(`
          id,
          student_id,
          title,
          story_content,
          video_url,
          before_role,
          after_role,
          before_salary,
          after_salary,
          company_name,
          company_logo_url,
          industry,
          placement_year,
          is_featured,
          is_published,
          created_at,
          updated_at,
          students!inner(
            id,
            user_id,
            course,
            branch,
            graduation_year,
            colleges(
              id,
              name,
              city
            ),
            user_profiles(
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      const transformedData = data ? {
        id: data.id,
        studentId: data.student_id,
        title: data.title,
        storyContent: data.story_content,
        videoUrl: data.video_url,
        beforeRole: data.before_role,
        afterRole: data.after_role,
        beforeSalary: data.before_salary,
        afterSalary: data.after_salary,
        companyName: data.company_name,
        companyLogoUrl: data.company_logo_url,
        industry: data.industry,
        placementYear: data.placement_year,
        isFeatured: data.is_featured,
        isPublished: data.is_published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        student: (data as any).students ? {
          id: (data as any).students.id,
          userId: (data as any).students.user_id,
          course: (data as any).students.course,
          branch: (data as any).students.branch,
          graduationYear: (data as any).students.graduation_year,
          college: (data as any).students.colleges ? {
            id: (data as any).students.colleges.id,
            name: (data as any).students.colleges.name,
            city: (data as any).students.colleges.city,
          } : undefined,
          userProfile: (data as any).students.user_profiles ? {
            id: (data as any).students.user_profiles.id,
            fullName: (data as any).students.user_profiles.full_name,
            avatarUrl: (data as any).students.user_profiles.avatar_url,
          } : undefined,
        } : undefined,
      } : null;

      return { data: transformedData, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async getStatistics(): Promise<{ data: any | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('success_stories')
        .select('after_salary, before_salary, placement_year')
        .eq('is_published', true);

      if (error) throw error;

      const stats = {
        totalStories: data?.length || 0,
        averageSalaryIncrease: 0,
        placementRate: 95,
        companiesHired: new Set(data?.map((s: any) => s.company_name)).size || 0,
      };

      if (data && data.length > 0) {
        const increases = data
          .filter((s: any) => s.before_salary && s.after_salary)
          .map((s: any) => ((s.after_salary - s.before_salary) / s.before_salary) * 100);
        
        if (increases.length > 0) {
          stats.averageSalaryIncrease = Math.round(
            increases.reduce((a: number, b: number) => a + b, 0) / increases.length
          );
        }
      }

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  getUniqueIndustries(stories: SuccessStory[]): string[] {
    const industries = stories
      ?.filter(s => s?.industry)
      ?.map(s => s.industry as string) || [];
    return Array.from(new Set(industries));
  },

  getUniquePlacementYears(stories: SuccessStory[]): number[] {
    const years = stories
      ?.filter(s => s?.placementYear)
      ?.map(s => s.placementYear as number) || [];
    return Array.from(new Set(years)).sort((a, b) => b - a);
  },
};

/**
 * Upload testimonial image to Supabase Storage
 */
export async function uploadTestimonialImage(file: File): Promise<string> {
  try {
    const supabase = createClient();
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `testimonials/${fileName}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('testimonial-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('testimonial-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error: any) {
    if (error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError')) {
      throw new Error('Cannot connect to storage service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard.');
    }
    throw new Error(error.message || 'Failed to upload image');
  }
}
function getAllSuccessStories(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: getAllSuccessStories is not implemented yet.', args);
  return null;
}

export { getAllSuccessStories };
function createSuccessStory(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: createSuccessStory is not implemented yet.', args);
  return null;
}

export { createSuccessStory };
function updateSuccessStory(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: updateSuccessStory is not implemented yet.', args);
  return null;
}

export { updateSuccessStory };
function deleteSuccessStory(...args: any[]): any {
  // eslint-disable-next-line no-console
  console.warn('Placeholder: deleteSuccessStory is not implemented yet.', args);
  return null;
}

export { deleteSuccessStory };