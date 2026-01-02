import { supabase } from '@/lib/supabase/client';
import { UserProfile } from '@/types/models';
import { Database } from '@/types/database.types';

type UserProfileRow = Database['public']['Tables']['user_profiles']['Row'];

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signUp(
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    role: 'student' | 'college_admin' = 'student'
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: role,
        },
      },
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  async getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: Error | null }> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return { data: null, error };

    // Convert snake_case to camelCase
    const profile: UserProfile = {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone ?? undefined,
      role: data.role,
      avatarUrl: data.avatar_url ?? undefined,
      isActive: data.is_active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: profile, error: null };
  },

  async updateUserProfile(userId: string, updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>) {
    // Convert camelCase to snake_case
    const dbUpdates: any = {};
    if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },
};