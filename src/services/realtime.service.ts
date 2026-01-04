import { supabase } from '@/lib/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { StudentRow, RealtimePayload } from '@/types/database.types';

// ✅ Define proper typed payloads for real-time subscriptions
type StudentPayload = RealtimePayload<'students'>;
type AllocationPayload = RealtimePayload<'free_account_allocations'>;
type AllocationHistoryPayload = RealtimePayload<'allocation_history'>;

// Real-time subscription service for Supabase database changes
export const realtimeService = {
  /**
   * Subscribe to student verification status changes
   * @param userId - The user ID to filter updates for specific student
   * @param onUpdate - Callback when student data changes
   * @returns Cleanup function to unsubscribe
   */
  subscribeToStudentVerification(
    userId: string,
    onUpdate: (payload: StudentPayload) => void
  ): () => void {
    const channel: RealtimeChannel = supabase
      .channel(`student-verification-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students',
          filter: `user_id=eq.${userId}`
        },
        (payload: StudentPayload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribe to allocation changes for a specific college
   * @param collegeId - The college ID to filter updates
   * @param onUpdate - Callback when allocation data changes
   * @returns Cleanup function to unsubscribe
   */
  subscribeToAllocations(
    collegeId: string,
    onUpdate: (payload: AllocationPayload) => void
  ): () => void {
    const channel: RealtimeChannel = supabase
      .channel(`allocations-${collegeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'free_account_allocations',
          filter: `college_id=eq.${collegeId}`
        },
        (payload: AllocationPayload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribe to allocation history events for a specific allocation
   * @param allocationId - The allocation ID to filter events
   * @param onUpdate - Callback when history events occur
   * @returns Cleanup function to unsubscribe
   */
  subscribeToAllocationHistory(
    allocationId: string,
    onUpdate: (payload: AllocationHistoryPayload) => void
  ): () => void {
    const channel: RealtimeChannel = supabase
      .channel(`allocation-history-${allocationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'allocation_history',
          filter: `allocation_id=eq.${allocationId}`
        },
        (payload: AllocationHistoryPayload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribe to all student verification changes for college admin
   * @param collegeId - The college ID to filter student updates
   * @param onUpdate - Callback when any student verification status changes
   * @returns Cleanup function to unsubscribe
   */
  subscribeToCollegeStudentVerifications(
    collegeId: string,
    onUpdate: (payload: StudentPayload) => void
  ): () => void {
    const channel: RealtimeChannel = supabase
      .channel(`college-students-${collegeId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'students',
          filter: `college_id=eq.${collegeId}`
        },
        (payload: RealtimePostgresChangesPayload<StudentRow>) => {
          // ✅ FIXED: Use proper RealtimePostgresChangesPayload<StudentRow> type
          // payload.new and payload.old are now properly typed as StudentRow | null
          const oldStatus = payload.old?.verification_status;
          const newStatus = payload.new?.verification_status;
          
          // Only trigger callback if verification_status changed
          if (newStatus !== oldStatus) {
            onUpdate(payload as StudentPayload);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Subscribe to multiple allocation changes for a college
   * @param collegeId - The college ID to monitor
   * @param onAllocationUpdate - Callback for allocation changes
   * @param onHistoryUpdate - Callback for allocation history events
   * @returns Cleanup function to unsubscribe from all channels
   */
  subscribeToCollegeAllocations(
    collegeId: string,
    onAllocationUpdate: (payload: AllocationPayload) => void,
    onHistoryUpdate: (payload: AllocationHistoryPayload) => void
  ): () => void {
    // Subscribe to allocation changes
    const allocationChannel: RealtimeChannel = supabase
      .channel(`allocations-${collegeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'free_account_allocations',
          filter: `college_id=eq.${collegeId}`
        },
        (payload: AllocationPayload) => {
          onAllocationUpdate(payload);
        }
      )
      .subscribe();

    // Subscribe to allocation history for all allocations of this college
    const historyChannel: RealtimeChannel = supabase
      .channel(`allocation-history-${collegeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'allocation_history'
        },
        (payload: AllocationHistoryPayload) => {
          onHistoryUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(allocationChannel);
      supabase.removeChannel(historyChannel);
    };
  }
};