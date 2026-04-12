/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

const TABLE_NAME = 'profiles';

export const userService = {
  async getUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  subscribeToUsers(callback: (users: UserProfile[]) => void) {
    this.getUsers().then(callback);

    const channel = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, () => {
        this.getUsers().then(callback);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async updateUserRole(uid: string, role: UserProfile['role']) {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({ role })
        .eq('uid', uid);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  }
};
