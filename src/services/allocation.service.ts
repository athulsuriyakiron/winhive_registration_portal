import { createClient } from '@/lib/supabase/client';
import type { 
  FreeAccountAllocation, 
  AllocationHistory,
  AllocationStats 
} from '@/types/models';
import type { FreeAccountAllocationRow, AllocationHistoryRow } from '@/types/database.types';

const supabase = createClient();

// ✅ Helper function to convert database row to camelCase model
const mapAllocationRowToModel = (row: FreeAccountAllocationRow & { college?: any }): FreeAccountAllocation => ({
  id: row.id,
  collegeId: row.college_id,
  course: row.course,
  batchYear: row.batch_year,
  totalQuota: row.total_quota,
  allocatedCount: row.allocated_count,
  availableCount: row.available_count,
  allocationStatus: row.allocation_status,
  renewalDate: row.renewal_date || undefined,
  notes: row.notes || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  createdBy: row.created_by || undefined,
  college: row.college
});

// ✅ Helper function to convert database history row to camelCase model
const mapHistoryRowToModel = (row: AllocationHistoryRow & { student?: any; performed_by_user?: any }): AllocationHistory => ({
  id: row.id,
  allocationId: row.allocation_id,
  actionType: row.action_type,
  previousAllocated: row.previous_allocated || undefined,
  newAllocated: row.new_allocated || undefined,
  studentId: row.student_id || undefined,
  performedBy: row.performed_by || undefined,
  notes: row.notes || undefined,
  createdAt: row.created_at,
  student: row.student ? {
    id: row.student.id,
    userProfiles: row.student.user_profiles ? {
      fullName: row.student.user_profiles.full_name,
      email: row.student.user_profiles.email
    } : undefined
  } : undefined,
  performedByUser: row.performed_by_user ? {
    fullName: row.performed_by_user.full_name,
    email: row.performed_by_user.email
  } : undefined
});

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
      return (data || []).map(mapAllocationRowToModel);
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
        totalQuota: data?.total_quota || 0,
        totalAllocated: data?.total_allocated || 0,
        totalAvailable: data?.total_available || 0,
        activeAllocations: data?.active_allocations || 0,
        depletedAllocations: data?.depleted_allocations || 0
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
      
      // ✅ Convert camelCase to snake_case for database insertion
      const { data, error } = await supabase
        .from('free_account_allocations')
        .insert({
          college_id: allocation.collegeId,
          course: allocation.course,
          batch_year: allocation.batchYear,
          total_quota: allocation.totalQuota,
          allocated_count: allocation.allocatedCount,
          available_count: allocation.availableCount,
          allocation_status: allocation.allocationStatus,
          renewal_date: allocation.renewalDate,
          notes: allocation.notes,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Create history entry
      await this.createHistoryEntry({
        allocationId: data.id,
        actionType: 'INITIAL_ALLOCATION',
        previousAllocated: 0,
        newAllocated: allocation.allocatedCount || 0,
        notes: 'Allocation created'
      });

      return mapAllocationRowToModel(data);
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

      // ✅ Convert camelCase to snake_case for database update
      const updateData: any = {};
      if (updates.collegeId !== undefined) updateData.college_id = updates.collegeId;
      if (updates.course !== undefined) updateData.course = updates.course;
      if (updates.batchYear !== undefined) updateData.batch_year = updates.batchYear;
      if (updates.totalQuota !== undefined) updateData.total_quota = updates.totalQuota;
      if (updates.allocatedCount !== undefined) updateData.allocated_count = updates.allocatedCount;
      if (updates.availableCount !== undefined) updateData.available_count = updates.availableCount;
      if (updates.allocationStatus !== undefined) updateData.allocation_status = updates.allocationStatus;
      if (updates.renewalDate !== undefined) updateData.renewal_date = updates.renewalDate;
      if (updates.notes !== undefined) updateData.notes = updates.notes;

      const { data, error } = await supabase
        .from('free_account_allocations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Create history entry if allocated count changed
      if (updates.allocatedCount !== undefined && current?.allocated_count !== updates.allocatedCount) {
        await this.createHistoryEntry({
          allocationId: id,
          actionType: 'ALLOCATION_UPDATED',
          previousAllocated: current?.allocated_count,
          newAllocated: updates.allocatedCount,
          notes: updates.notes || 'Allocation updated'
        });
      }

      return mapAllocationRowToModel(data);
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
        allocationId: allocationId,
        actionType: 'ACCOUNT_ALLOCATED',
        previousAllocated: allocation.allocated_count,
        newAllocated: allocation.allocated_count + 1,
        studentId: studentId,
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
      return (data || []).map(mapHistoryRowToModel);
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
      
      // ✅ Convert camelCase to snake_case for database insertion
      const { error } = await supabase
        .from('allocation_history')
        .insert({
          allocation_id: history.allocationId,
          action_type: history.actionType,
          previous_allocated: history.previousAllocated,
          new_allocated: history.newAllocated,
          student_id: history.studentId,
          notes: history.notes,
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