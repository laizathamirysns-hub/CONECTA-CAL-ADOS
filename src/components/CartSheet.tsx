/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCart } from '@/src/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, CheckCircle2 } from 'lucide-react';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ShippingCalculator } from './ShippingCalculator';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { CheckoutForm } from './CheckoutForm';

export function CartSheet() {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    total, 
    itemCount, 
    shippingCost,
    selectedShippingOption,
    selectedPickupPoint
  } = useCart();

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 bg-brand-dark text-center px-8">
        <div className="h-24 w-24 bg-brand-gold/20 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="h-12 w-12 text-brand-gold" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-bold text-white uppercase tracking-tighter">Pedido Recebido!</h3>
          <p className="text-sm text-white/40 font-light leading-relaxed">
            Obrigado pela preferência. Em instantes entraremos em contato via WhatsApp para confirmar os detalhes do pagamento e envio.
          </p>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          className="w-full h-14 bg-brand-gold text-brand-dark hover:bg-brand-gold/90 text-xs font-bold uppercase tracking-widest rounded-none"
        >
          Continuar Comprando
        </Button>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <div className="flex flex-col h-full bg-brand-dark p-6">
        <CheckoutForm 
          onBack={() => setStep('cart')} 
          onSuccess={() => setStep('success')} 
        />
      </div>
    );
  }

  if (cart.length === 0) {
// ... existing empty cart logic ...
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 bg-brand-dark">
        <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-white/20" />
        </div>
        <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Seu carrinho está vazio</h3>
        <p className="text-sm text-white/40 text-center px-8 font-light">
          Parece que você ainda não adicionou nenhum calçado ao seu carrinho.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-brand-dark text-white">
      <SheetHeader className="pb-6 border-b border-white/10">
        <SheetTitle className="text-2xl font-bold tracking-tighter uppercase text-white">
          Meu Carrinho
          <span className="ml-2 text-sm font-normal text-white/40">({itemCount} itens)</span>
        </SheetTitle>
      </SheetHeader>

      <ScrollArea className="flex-grow pr-4 py-6">
        <div className="space-y-8">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 group">
                <div className="h-24 w-24 rounded-none overflow-hidden bg-[#0A0A0A] shrink-0 border border-white/5">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider line-clamp-1 group-hover:text-brand-gold transition-colors">{item.name}</h4>
                    <button 
                      onClick={() => removeFromCart(item.productId, item.size, item.color)}
                      className="text-white/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    Tamanho: {item.size} • Cor: {item.color}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-white/10 rounded-none overflow-hidden h-8 bg-white/5">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="px-2 hover:bg-white/5 transition-colors h-full text-white/60"
                      ><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="px-2 hover:bg-white/5 transition-colors h-full text-white/60"
                      ><Plus className="h-3 w-3" /></button>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  {item.isWholesale && (
                    <span className="inline-block text-[9px] font-bold text-brand-gold/60 uppercase tracking-[0.2em] mt-1">Preço de Atacado</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold mb-4">Envio ou Retirada</h4>
            <ShippingCalculator />
          </div>
        </div>
      </ScrollArea>

      <div className="pt-6 space-y-4 border-t border-white/10">
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
            <span className="text-white/40">Subtotal</span>
            <span className="text-white">
              {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest">
            <span className="text-white/40">Frete</span>
            <span className={cn(
              "transition-colors",
              shippingCost > 0 ? "text-white" : "text-brand-gold"
            )}>
              {selectedPickupPoint 
                ? 'Grátis (Retirada)' 
                : selectedShippingOption 
                  ? shippingCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : 'A calcular'}
            </span>
          </div>
          <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/5">
            <span className="uppercase tracking-tighter">Total</span>
            <span className="text-brand-gold">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        </div>
        <Button 
          disabled={!selectedShippingOption && !selectedPickupPoint}
          onClick={() => setStep('checkout')}
          className="w-full h-16 bg-brand-gold text-brand-dark hover:bg-brand-gold/90 text-xs font-bold uppercase tracking-[0.2em] rounded-none group"
        >
          Finalizar Pedido
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
