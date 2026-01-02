import { supabase } from '@/lib/supabase/client';
import { College } from '@/types/models';
import { Database } from '@/types/database.types';

type CollegeRow = Database['public']['Tables']['colleges']['Row'];
type CollegeInsert = Database['public']['Tables']['colleges']['Insert'];

export const collegeService = {
  async getAllVerifiedColleges(): Promise<{ data: College[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('verification_status', 'verified')
      .order('name');

    if (error) return { data: null, error };

    const colleges: College[] = (data || []).map((row: CollegeRow) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      address: row.address ?? undefined,
      city: row.city ?? undefined,
      state: row.state ?? undefined,
      country: row.country,
      accreditation: row.accreditation ?? undefined,
      websiteUrl: row.website_url ?? undefined,
      contactEmail: row.contact_email ?? undefined,
      contactPhone: row.contact_phone ?? undefined,
      adminId: row.admin_id ?? undefined,
      verificationStatus: row.verification_status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { data: colleges, error: null };
  },

  async getCollegeById(collegeId: string): Promise<{ data: College | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', collegeId)
      .single();

    if (error) return { data: null, error };

    const college: College = {
      id: data.id,
      name: data.name,
      code: data.code,
      address: data.address ?? undefined,
      city: data.city ?? undefined,
      state: data.state ?? undefined,
      country: data.country,
      accreditation: data.accreditation ?? undefined,
      websiteUrl: data.website_url ?? undefined,
      contactEmail: data.contact_email ?? undefined,
      contactPhone: data.contact_phone ?? undefined,
      adminId: data.admin_id ?? undefined,
      verificationStatus: data.verification_status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: college, error: null };
  },

  async createCollege(collegeData: Omit<College, 'id' | 'createdAt' | 'updatedAt'>) {
    const insertData: CollegeInsert = {
      name: collegeData.name,
      code: collegeData.code,
      address: collegeData.address,
      city: collegeData.city,
      state: collegeData.state,
      country: collegeData.country,
      accreditation: collegeData.accreditation,
      website_url: collegeData.websiteUrl,
      contact_email: collegeData.contactEmail,
      contact_phone: collegeData.contactPhone,
      admin_id: collegeData.adminId,
      verification_status: collegeData.verificationStatus,
    };

    const { data, error } = await supabase
      .from('colleges')
      .insert(insertData)
      .select()
      .single();

    return { data, error };
  },
};