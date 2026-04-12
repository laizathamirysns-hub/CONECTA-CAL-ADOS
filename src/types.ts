/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Tênis' | 'Sandália' | 'Bota' | 'Chinelo';

export interface SizeStock {
  size: number;
  quantity: number;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  manufacturerId: string;
  name: string;
  description: string;
  category: Category;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleMinQuantity: number;
  images: string[];
  colors: ColorOption[];
  sizes: SizeStock[];
  featured?: boolean;
  createdAt: number;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  size: number;
  color: string;
  quantity: number;
  price: number;
  isWholesale: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'manufacturer' | 'admin';
  favorites: string[];
  createdAt: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  type: 'retail' | 'wholesale';
  shippingMethod: 'delivery' | 'pickup';
  shippingDetails?: ShippingOption | PickupPoint;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    cep?: string;
  };
  createdAt: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  experience: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'rejected';
  createdAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'job' | 'promo' | 'system';
  read: boolean;
  link?: string;
  createdAt: number;
}

export interface Job {
  id: string;
  companyName: string;
  role: string;
  description: string;
  requirements: string[];
  contact: string;
  type: 'CLT' | 'PJ' | 'Temporário' | 'Estágio';
  area: 'Produção' | 'Administrativo' | 'Vendas' | 'Logística' | 'Design' | 'Outros';
  createdAt: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
  type: 'standard' | 'express';
}

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  hours: string;
  distance?: string;
}

export interface UserEvent {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: string;
  createdAt: number;
}

export interface UserNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  color?: string;
  createdAt: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserChecklist {
  id: string;
  userId: string;
  title: string;
  items: ChecklistItem[];
  createdAt: number;
}
