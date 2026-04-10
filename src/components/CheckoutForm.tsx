/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCart } from '@/src/contexts/CartContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { orderService } from '@/src/services/orderService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
  const { 
    cart, 
    subtotal, 
    shippingCost, 
    total, 
    selectedShippingOption, 
    selectedPickupPoint,
    clearCart 
  } = useCart();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    cep: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await orderService.createOrder({
        userId: user?.uid || 'anonymous',
        items: cart,
        subtotal,
        shippingCost,
        total,
        status: 'pending',
        type: cart.some(item => item.isWholesale) ? 'wholesale' : 'retail',
        shippingMethod: selectedPickupPoint ? 'pickup' : 'delivery',
        shippingDetails: selectedPickupPoint || selectedShippingOption || undefined,
        customerInfo: formData,
        createdAt: Date.now()
      });
      
      clearCart();
      onSuccess();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-brand-gold transition-colors text-[10px] font-bold uppercase tracking-widest"
      >
        <ArrowLeft className="h-3 w-3" />
        Voltar ao Carrinho
      </button>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold uppercase tracking-tighter text-white">Finalizar Pedido</h3>
        <p className="text-sm text-white/40 font-light">Preencha seus dados para concluir a compra.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nome Completo</label>
            <Input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">E-mail</label>
              <Input 
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">WhatsApp</label>
              <Input 
                required
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="(37) 99999-9999"
                className="bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none text-white"
              />
            </div>
          </div>

          {selectedShippingOption && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Endereço de Entrega</label>
                <Input 
                  required
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  className="bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">CEP</label>
                <Input 
                  required
                  value={formData.cep}
                  onChange={e => setFormData({...formData, cep: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none text-white"
                />
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-white/5 border border-white/10 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Total a Pagar</span>
            <span className="text-brand-gold font-bold text-lg">
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <p className="text-[9px] text-white/30 text-center uppercase tracking-widest leading-relaxed">
            Ao clicar em finalizar, seu pedido será enviado para análise e entraremos em contato via WhatsApp.
          </p>
        </div>

        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full h-16 bg-brand-gold text-brand-dark hover:bg-brand-gold/90 text-xs font-bold uppercase tracking-[0.2em] rounded-none"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Confirmar Pedido'
          )}
        </Button>
      </form>
    </div>
  );
}
