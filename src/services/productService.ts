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
      return (data || []).map(item => ({
        id: item.id,
        manufacturerId: item.manufacturer_id,
        name: item.name,
        description: item.description,
        category: item.category,
        retailPrice: Number(item.retail_price),
        wholesalePrice: Number(item.wholesale_price),
        wholesaleMinQuantity: item.wholesale_min_quantity,
        images: item.images,
        colors: item.colors,
        sizes: item.sizes,
        featured: item.featured,
        createdAt: item.created_at
      }));
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
    return (data || []).map(item => ({
      id: item.id,
      manufacturerId: item.manufacturer_id,
      name: item.name,
      description: item.description,
      category: item.category,
      retailPrice: Number(item.retail_price),
      wholesalePrice: Number(item.wholesale_price),
      wholesaleMinQuantity: item.wholesale_min_quantity,
      images: item.images,
      colors: item.colors,
      sizes: item.sizes,
      featured: item.featured,
      createdAt: item.created_at
    }));
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

  async uploadImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return '';
    }
  },

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const dbProduct = {
        manufacturer_id: product.manufacturerId,
        name: product.name,
        description: product.description,
        category: product.category,
        retail_price: product.retailPrice,
        wholesale_price: product.wholesalePrice,
        wholesale_min_quantity: product.wholesaleMinQuantity,
        images: product.images,
        colors: product.colors,
        sizes: product.sizes,
        featured: product.featured,
        created_at: product.createdAt || Date.now()
      };

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([dbProduct])
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
      const dbProduct: any = {};
      if (product.manufacturerId) dbProduct.manufacturer_id = product.manufacturerId;
      if (product.name) dbProduct.name = product.name;
      if (product.description) dbProduct.description = product.description;
      if (product.category) dbProduct.category = product.category;
      if (product.retailPrice !== undefined) dbProduct.retail_price = product.retailPrice;
      if (product.wholesalePrice !== undefined) dbProduct.wholesale_price = product.wholesalePrice;
      if (product.wholesaleMinQuantity !== undefined) dbProduct.wholesale_min_quantity = product.wholesaleMinQuantity;
      if (product.images) dbProduct.images = product.images;
      if (product.colors) dbProduct.colors = product.colors;
      if (product.sizes) dbProduct.sizes = product.sizes;
      if (product.featured !== undefined) dbProduct.featured = product.featured;
      if (product.createdAt) dbProduct.created_at = product.createdAt;

      const { error } = await supabase
        .from(TABLE_NAME)
        .update(dbProduct)
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
