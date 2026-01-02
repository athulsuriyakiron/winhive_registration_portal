import { supabase } from '@/lib/supabase/client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

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
    onUpdate: (payload: RealtimePostgresChangesPayload<any>) => void
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
        (payload: RealtimePostgresChangesPayload<any>) => {
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
    onUpdate: (payload: RealtimePostgresChangesPayload<any>) => void
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
        (payload: RealtimePostgresChangesPayload<any>) => {
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
    onUpdate: (payload: RealtimePostgresChangesPayload<any>) => void
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
        (payload: RealtimePostgresChangesPayload<any>) => {
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
    onUpdate: (payload: RealtimePostgresChangesPayload<any>) => void
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
        (payload: RealtimePostgresChangesPayload<any>) => {
          // Only trigger callback if verification_status changed
          if (payload?.new?.verification_status !== payload?.old?.verification_status) {
            onUpdate(payload);
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
    onAllocationUpdate: (payload: RealtimePostgresChangesPayload<any>) => void,
    onHistoryUpdate: (payload: RealtimePostgresChangesPayload<any>) => void
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
        (payload: RealtimePostgresChangesPayload<any>) => {
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
        (payload: RealtimePostgresChangesPayload<any>) => {
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