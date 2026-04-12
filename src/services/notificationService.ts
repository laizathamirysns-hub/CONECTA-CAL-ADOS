/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../lib/supabase';
import { Notification } from '../types';

const TABLE_NAME = 'notifications';

export const notificationService = {
  async sendNotification(notification: Omit<Notification, 'id'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([{ ...notification, created_at: Date.now() }])
        .select();
      
      if (error) throw error;
      return data?.[0]?.id || '';
    } catch (error) {
      console.error('Error sending notification:', error);
      return '';
    }
  },

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  subscribeToUserNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    this.getUserNotifications(userId).then(callback);

    const channel = supabase
      .channel(`user_notifications:${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: TABLE_NAME,
        filter: `user_id=eq.${userId}`
      }, () => {
        this.getUserNotifications(userId).then(callback);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }
};
