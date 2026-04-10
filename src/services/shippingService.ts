/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShippingOption, PickupPoint } from '../types';

export const shippingService = {
  async calculateShipping(cep: string): Promise<ShippingOption[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Basic validation
    if (!/^\d{8}$/.test(cep.replace(/\D/g, ''))) {
      throw new Error('CEP inválido');
    }

    // Mock logic: Different prices based on CEP range
    const isLocal = cep.startsWith('355'); // Nova Serrana region starts with 355
    
    return [
      {
        id: 'std',
        name: 'Entrega Padrão (Correios)',
        price: isLocal ? 15.00 : 25.90,
        deliveryTime: isLocal ? '2-4 dias úteis' : '5-8 dias úteis',
        type: 'standard'
      },
      {
        id: 'exp',
        name: 'Entrega Expressa',
        price: isLocal ? 22.00 : 45.00,
        deliveryTime: isLocal ? '1-2 dias úteis' : '2-3 dias úteis',
        type: 'express'
      }
    ];
  },

  async getPickupPoints(): Promise<PickupPoint[]> {
    // Mock pickup points in Nova Serrana
    return [
      {
        id: 'factory-1',
        name: 'Fábrica Matriz - Conecta',
        address: 'Av. das Indústrias, 1200, Centro, Nova Serrana - MG',
        hours: 'Seg-Sex: 08:00 às 18:00',
        distance: '1.2 km'
      },
      {
        id: 'outlet-1',
        name: 'Outlet Nova Serrana',
        address: 'Rua do Calçado, 450, Planalto, Nova Serrana - MG',
        hours: 'Seg-Sáb: 09:00 às 19:00',
        distance: '3.5 km'
      }
    ];
  }
};
