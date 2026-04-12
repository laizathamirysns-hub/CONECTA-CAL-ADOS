/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../lib/supabase';
import { Product } from '../types';

const TABLE_NAME = 'products';

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  subscribeToProducts(callback: (products: Product[]) => void) {
    // Initial fetch
    this.getProducts().then(callback);

    // Real-time subscription
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, () => {
        this.getProducts().then(callback);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async getManufacturerProducts(manufacturerId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('manufacturer_id', manufacturerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  subscribeToManufacturerProducts(manufacturerId: string, callback: (products: Product[]) => void) {
    this.getManufacturerProducts(manufacturerId).then(callback);

    const channel = supabase
      .channel(`manufacturer:${manufacturerId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: TABLE_NAME,
        filter: `manufacturer_id=eq.${manufacturerId}`
      }, () => {
        this.getManufacturerProducts(manufacturerId).then(callback);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([product])
        .select();
      
      if (error) throw error;
      return data?.[0]?.id || '';
    } catch (error) {
      console.error('Error adding product:', error);
      return '';
    }
  },

  async updateProduct(id: string, product: Partial<Product>) {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .update(product)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating product:', error);
    }
  },

  async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};
