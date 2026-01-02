import { createClient } from '@/lib/supabase/client';
import type { 
  FreeAccountAllocation, 
  AllocationHistory,
  AllocationStats 
} from '@/types/models';

const supabase = createClient();

export const allocationService = {
  /**
   * Get all allocations for a specific college
   */
  async getCollegeAllocations(collegeId: string): Promise<FreeAccountAllocation[]> {
    try {
      const { data, error } = await supabase
        .from('free_account_allocations')
        .select(`
          *,
          college:colleges(id, name, code)
        `)
        .eq('college_id', collegeId)
        .order('batch_year', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching college allocations:', error);
      throw error;
    }
  },

  /**
   * Get allocation statistics for a college
   */
  async getCollegeAllocationStats(collegeId: string): Promise<AllocationStats> {
    try {
      const { data, error } = await supabase
        .rpc('get_college_allocation_stats', { college_uuid: collegeId })
        .single();

      if (error) throw error;
      
      return {
        total_quota: data?.total_quota || 0,
        total_allocated: data?.total_allocated || 0,
        total_available: data?.total_available || 0,
        active_allocations: data?.active_allocations || 0,
        depleted_allocations: data?.depleted_allocations || 0
      };
    } catch (error) {
      console.error('Error fetching allocation stats:', error);
      throw error;
    }
  },

  /**
   * Get allocations grouped by course
   */
  async getAllocationsByCourse(collegeId: string): Promise<Record<string, FreeAccountAllocation[]>> {
    try {
      const allocations = await this.getCollegeAllocations(collegeId);
      
      return allocations.reduce((acc, allocation) => {
        const course = allocation.course;
        if (!acc[course]) {
          acc[course] = [];
        }
        acc[course].push(allocation);
        return acc;
      }, {} as Record<string, FreeAccountAllocation[]>);
    } catch (error) {
      console.error('Error grouping allocations by course:', error);
      throw error;
    }
  },

  /**
   * Create a new allocation
   */
  async createAllocation(allocation: Partial<FreeAccountAllocation>): Promise<FreeAccountAllocation> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('free_account_allocations')
        .insert({
          ...allocation,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Create history entry
      await this.createHistoryEntry({
        allocation_id: data.id,
        action_type: 'INITIAL_ALLOCATION',
        previous_allocated: 0,
        new_allocated: allocation.allocated_count || 0,
        notes: 'Allocation created'
      });

      return data;
    } catch (error) {
      console.error('Error creating allocation:', error);
      throw error;
    }
  },

  /**
   * Update allocation
   */
  async updateAllocation(id: string, updates: Partial<FreeAccountAllocation>): Promise<FreeAccountAllocation> {
    try {
      // Get current allocation for history
      const { data: current } = await supabase
        .from('free_account_allocations')
        .select('allocated_count')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('free_account_allocations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Create history entry if allocated count changed
      if (updates.allocated_count !== undefined && current?.allocated_count !== updates.allocated_count) {
        await this.createHistoryEntry({
          allocation_id: id,
          action_type: 'ALLOCATION_UPDATED',
          previous_allocated: current?.allocated_count,
          new_allocated: updates.allocated_count,
          notes: updates.notes || 'Allocation updated'
        });
      }

      return data;
    } catch (error) {
      console.error('Error updating allocation:', error);
      throw error;
    }
  },

  /**
   * Allocate account to student
   */
  async allocateToStudent(allocationId: string, studentId: string): Promise<void> {
    try {
      // Get current allocation
      const { data: allocation } = await supabase
        .from('free_account_allocations')
        .select('allocated_count, available_count')
        .eq('id', allocationId)
        .single();

      if (!allocation || allocation.available_count <= 0) {
        throw new Error('No available accounts in this allocation');
      }

      // Increment allocated count
      const { error } = await supabase
        .from('free_account_allocations')
        .update({ allocated_count: allocation.allocated_count + 1 })
        .eq('id', allocationId);

      if (error) throw error;

      // Create history entry
      await this.createHistoryEntry({
        allocation_id: allocationId,
        action_type: 'ACCOUNT_ALLOCATED',
        previous_allocated: allocation.allocated_count,
        new_allocated: allocation.allocated_count + 1,
        student_id: studentId,
        notes: 'Free account allocated to student'
      });
    } catch (error) {
      console.error('Error allocating to student:', error);
      throw error;
    }
  },

  /**
   * Get allocation history
   */
  async getAllocationHistory(allocationId: string): Promise<AllocationHistory[]> {
    try {
      const { data, error } = await supabase
        .from('allocation_history')
        .select(`
          *,
          student:students(id, user_profiles(full_name, email)),
          performed_by_user:user_profiles!allocation_history_performed_by_fkey(full_name, email)
        `)
        .eq('allocation_id', allocationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching allocation history:', error);
      throw error;
    }
  },

  /**
   * Create history entry
   */
  async createHistoryEntry(history: Partial<AllocationHistory>): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('allocation_history')
        .insert({
          ...history,
          performed_by: user?.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating history entry:', error);
      throw error;
    }
  },

  /**
   * Delete allocation
   */
  async deleteAllocation(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('free_account_allocations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting allocation:', error);
      throw error;
    }
  }
};