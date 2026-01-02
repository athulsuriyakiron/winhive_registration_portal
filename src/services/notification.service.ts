import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type NotificationType = 'verification_update' | 'allocation_change' | 'event_alert' | 'system_message';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  is_archived: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  read_at?: string;
  updated_at: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  priority?: NotificationPriority;
  startDate?: string;
  endDate?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

class NotificationService {
  private supabase = createClient();

  async getNotifications(filters?: NotificationFilters): Promise<Notification[]> {
    try {
      let query = this.supabase
        .from('notifications')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('notification_type', filters.type);
      }

      if (filters?.isRead !== undefined) {
        query = query.eq('is_read', filters.isRead);
      }

      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }

      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map((notification: any) => ({
        id: notification.id,
        user_id: notification.user_id,
        notification_type: notification.notification_type,
        priority: notification.priority,
        title: notification.title,
        message: notification.message,
        action_url: notification.action_url,
        is_read: notification.is_read,
        is_archived: notification.is_archived,
        metadata: notification.metadata,
        created_at: notification.created_at,
        read_at: notification.read_at,
        updated_at: notification.updated_at,
      })) || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationIds: string[]): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', notificationIds);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return false;
    }
  }

  async markAsUnread(notificationIds: string[]): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_read: false, read_at: null })
        .in('id', notificationIds);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking notifications as unread:', error);
      return false;
    }
  }

  async archiveNotifications(notificationIds: string[]): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ is_archived: true })
        .in('id', notificationIds);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error archiving notifications:', error);
      return false;
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) return 0;

      const { data, error } = await this.supabase.rpc('get_unread_notification_count', {
        user_uuid: user.id
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .select('notification_type, priority, is_read')
        .eq('is_archived', false);

      if (error) throw error;

      const stats: NotificationStats = {
        total: data?.length || 0,
        unread: data?.filter((n: any) => !n.is_read).length || 0,
        byType: {
          verification_update: 0,
          allocation_change: 0,
          event_alert: 0,
          system_message: 0,
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0,
        },
      };

      data?.forEach((notification: any) => {
        stats.byType[notification.notification_type as NotificationType]++;
        stats.byPriority[notification.priority as NotificationPriority]++;
      });

      return stats;
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return {
        total: 0,
        unread: 0,
        byType: {
          verification_update: 0,
          allocation_change: 0,
          event_alert: 0,
          system_message: 0,
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0,
        },
      };
    }
  }

  subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ): RealtimeChannel {
    const channel = this.supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as any;
          callback({
            id: notification.id,
            user_id: notification.user_id,
            notification_type: notification.notification_type,
            priority: notification.priority,
            title: notification.title,
            message: notification.message,
            action_url: notification.action_url,
            is_read: notification.is_read,
            is_archived: notification.is_archived,
            metadata: notification.metadata,
            created_at: notification.created_at,
            read_at: notification.read_at,
            updated_at: notification.updated_at,
          });
        }
      )
      .subscribe();

    return channel;
  }

  unsubscribe(channel: RealtimeChannel): void {
    this.supabase.removeChannel(channel);
  }
}

export const notificationService = new NotificationService();