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
      const dbOrder = {
        user_id: order.userId,
        items: order.items,
        subtotal: order.subtotal,
        shipping_cost: order.shippingCost,
        total: order.total,
        status: order.status,
        type: order.type,
        shipping_method: order.shippingMethod,
        shipping_details: order.shippingDetails,
        customer_info: order.customerInfo,
        created_at: order.createdAt || Date.now()
      };
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([dbOrder])
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
      return (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        items: item.items,
        subtotal: Number(item.subtotal),
        shippingCost: Number(item.shipping_cost),
        total: Number(item.total),
        status: item.status,
        type: item.type,
        shippingMethod: item.shipping_method,
        shippingDetails: item.shipping_details,
        customerInfo: item.customer_info,
        createdAt: item.created_at
      }));
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
      return (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        items: item.items,
        subtotal: Number(item.subtotal),
        shippingCost: Number(item.shipping_cost),
        total: Number(item.total),
        status: item.status,
        type: item.type,
        shippingMethod: item.shipping_method,
        shippingDetails: item.shipping_details,
        customerInfo: item.customer_info,
        createdAt: item.created_at
      }));
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
