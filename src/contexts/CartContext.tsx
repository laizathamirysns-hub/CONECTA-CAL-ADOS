/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ShippingOption, PickupPoint } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: number, color: string) => void;
  updateQuantity: (productId: string, size: number, color: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  subtotal: number;
  itemCount: number;
  shippingCost: number;
  selectedShippingOption: ShippingOption | null;
  selectedPickupPoint: PickupPoint | null;
  setShippingOption: (option: ShippingOption | null) => void;
  setPickupPoint: (point: PickupPoint | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PickupPoint | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('conecta_calcados_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('conecta_calcados_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart(prev => {
      const existingItemIndex = prev.findIndex(
        item => item.productId === newItem.productId && 
                item.size === newItem.size && 
                item.color === newItem.color
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      }

      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, size: number, color: string) => {
    setCart(prev => prev.filter(
      item => !(item.productId === productId && item.size === size && item.color === color)
    ));
  };

  const updateQuantity = (productId: string, size: number, color: string, quantity: number) => {
    setCart(prev => prev.map(item => 
      (item.productId === productId && item.size === size && item.color === color)
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedShippingOption(null);
    setSelectedPickupPoint(null);
  };

  const setShippingOption = (option: ShippingOption | null) => {
    setSelectedShippingOption(option);
    setSelectedPickupPoint(null);
  };

  const setPickupPoint = (point: PickupPoint | null) => {
    setSelectedPickupPoint(point);
    setSelectedShippingOption(null);
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const shippingCost = selectedShippingOption?.price || 0;
  const total = subtotal + shippingCost;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      total, 
      subtotal,
      itemCount,
      shippingCost,
      selectedShippingOption,
      selectedPickupPoint,
      setShippingOption,
      setPickupPoint
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
