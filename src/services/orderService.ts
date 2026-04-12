/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../lib/supabase';
import { Order } from '../types';

const TABLE_NAME = 'orders';

export const orderService = {
  async createOrder(order: Omit<Order, 'id'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([{ ...order, created_at: Date.now() }])
        .select();
      
      if (error) throw error;
      return data?.[0]?.id || '';
    } catch (error) {
      console.error('Error creating order:', error);
      return '';
    }
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },

  subscribeToUserOrders(userId: string, callback: (orders: Order[]) => void) {
    this.getOrdersByUser(userId).then(callback);

    const channel = supabase
      .channel(`user_orders:${userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: TABLE_NAME,
        filter: `user_id=eq.${userId}`
      }, () => {
        this.getOrdersByUser(userId).then(callback);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  subscribeToAllOrders(callback: (orders: Order[]) => void) {
    this.getAllOrders().then(callback);

    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, () => {
        this.getAllOrders().then(callback);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }
};
