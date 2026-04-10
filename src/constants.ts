/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tênis Sport Ultra',
    description: 'Tênis leve e confortável para o dia a dia, ideal para caminhadas e esportes leves.',
    category: 'Tênis',
    retailPrice: 159.90,
    wholesalePrice: 89.90,
    wholesaleMinQuantity: 12,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
    colors: [
      { name: 'Preto', hex: '#000000' },
      { name: 'Cinza', hex: '#808080' }
    ],
    sizes: [
      { size: 37, quantity: 10 },
      { size: 38, quantity: 15 },
      { size: 39, quantity: 20 },
      { size: 40, quantity: 12 }
    ],
    featured: true,
    manufacturerId: 'admin-default',
    createdAt: Date.now()
  },
  {
    id: '2',
    name: 'Sandália Elegance',
    description: 'Sandália feminina com design moderno e acabamento premium.',
    category: 'Sandália',
    retailPrice: 129.90,
    wholesalePrice: 65.00,
    wholesaleMinQuantity: 10,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'],
    colors: [
      { name: 'Bege', hex: '#F5F5DC' },
      { name: 'Branco', hex: '#FFFFFF' }
    ],
    sizes: [
      { size: 34, quantity: 5 },
      { size: 35, quantity: 8 },
      { size: 36, quantity: 12 },
      { size: 37, quantity: 10 }
    ],
    manufacturerId: 'admin-default',
    createdAt: Date.now()
  },
  {
    id: '3',
    name: 'Bota Adventure Robust',
    description: 'Bota resistente para trilhas e terrenos acidentados, com solado antiderrapante.',
    category: 'Bota',
    retailPrice: 249.90,
    wholesalePrice: 145.00,
    wholesaleMinQuantity: 6,
    images: ['https://images.unsplash.com/photo-1520639889313-7272a74b1c73?auto=format&fit=crop&q=80&w=800'],
    colors: [
      { name: 'Marrom', hex: '#8B4513' },
      { name: 'Preto', hex: '#000000' }
    ],
    sizes: [
      { size: 38, quantity: 8 },
      { size: 39, quantity: 10 },
      { size: 40, quantity: 15 },
      { size: 41, quantity: 12 },
      { size: 42, quantity: 5 }
    ],
    featured: true,
    manufacturerId: 'admin-default',
    createdAt: Date.now()
  },
  {
    id: '4',
    name: 'Chinelo Comfort Soft',
    description: 'Chinelo macio com tecnologia de amortecimento, perfeito para relaxar.',
    category: 'Chinelo',
    retailPrice: 49.90,
    wholesalePrice: 22.00,
    wholesaleMinQuantity: 24,
    images: ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=80&w=800'],
    colors: [
      { name: 'Branco', hex: '#FFFFFF' },
      { name: 'Azul Marinho', hex: '#000080' }
    ],
    sizes: [
      { size: 35, quantity: 20 },
      { size: 37, quantity: 25 },
      { size: 39, quantity: 30 },
      { size: 41, quantity: 20 }
    ],
    manufacturerId: 'admin-default',
    createdAt: Date.now()
  }
];

export const CATEGORIES = ['Tênis', 'Sandália', 'Bota', 'Chinelo'];
export const COLORS = ['Preto', 'Branco', 'Bege', 'Marrom', 'Cinza', 'Azul Marinho'];
export const SIZES = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];
