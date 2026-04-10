/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Truck, MapPin, Store, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { shippingService } from '@/src/services/shippingService';
import { ShippingOption, PickupPoint } from '@/src/types';
import { useCart } from '@/src/contexts/CartContext';
import { cn } from '@/lib/utils';

export function ShippingCalculator() {
  const [cep, setCep] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  
  const { 
    selectedShippingOption, 
    selectedPickupPoint, 
    setShippingOption, 
    setPickupPoint 
  } = useCart();

  useEffect(() => {
    const fetchPickupPoints = async () => {
      const points = await shippingService.getPickupPoints();
      setPickupPoints(points);
    };
    fetchPickupPoints();
  }, []);

  const handleCalculate = async () => {
    if (cep.length < 8) {
      setError('CEP inválido');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results = await shippingService.calculateShipping(cep);
      setOptions(results);
    } catch (err) {
      setError('Erro ao calcular frete. Verifique o CEP.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-white/5 p-1 rounded-none border border-white/10">
        <button
          onClick={() => setDeliveryType('delivery')}
          className={cn(
            "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            deliveryType === 'delivery' 
              ? "bg-brand-gold text-brand-dark" 
              : "text-white/40 hover:text-white"
          )}
        >
          <Truck className="h-3 w-3" />
          Entrega
        </button>
        <button
          onClick={() => setDeliveryType('pickup')}
          className={cn(
            "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
            deliveryType === 'pickup' 
              ? "bg-brand-gold text-brand-dark" 
              : "text-white/40 hover:text-white"
          )}
        >
          <Store className="h-3 w-3" />
          Retirada
        </button>
      </div>

      {deliveryType === 'delivery' ? (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input 
                value={cep}
                onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="Digite seu CEP" 
                className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none text-white"
              />
            </div>
            <Button 
              onClick={handleCalculate}
              disabled={isLoading || cep.length < 8}
              className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none px-6 font-bold uppercase tracking-widest text-[10px]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Calcular'}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest">
              <AlertCircle className="h-3 w-3" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => setShippingOption(option)}
                className={cn(
                  "w-full p-4 border transition-all duration-300 text-left group flex items-center justify-between",
                  selectedShippingOption?.id === option.id
                    ? "bg-brand-gold/10 border-brand-gold"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                <div className="space-y-1">
                  <p className={cn(
                    "text-xs font-bold uppercase tracking-widest",
                    selectedShippingOption?.id === option.id ? "text-brand-gold" : "text-white"
                  )}>
                    {option.name}
                  </p>
                  <p className="text-[10px] text-white/40 font-medium">Prazo: {option.deliveryTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {option.price === 0 ? 'Grátis' : option.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  {selectedShippingOption?.id === option.id && (
                    <Check className="h-4 w-4 text-brand-gold ml-auto mt-1" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Unidades em Nova Serrana:</p>
          {pickupPoints.map((point) => (
            <button
              key={point.id}
              onClick={() => setPickupPoint(point)}
              className={cn(
                "w-full p-4 border transition-all duration-300 text-left group",
                selectedPickupPoint?.id === point.id
                  ? "bg-brand-gold/10 border-brand-gold"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="space-y-1">
                  <p className={cn(
                    "text-xs font-bold uppercase tracking-widest",
                    selectedPickupPoint?.id === point.id ? "text-brand-gold" : "text-white"
                  )}>
                    {point.name}
                  </p>
                  <p className="text-[10px] text-white/60 leading-relaxed">{point.address}</p>
                </div>
                {selectedPickupPoint?.id === point.id && (
                  <Check className="h-4 w-4 text-brand-gold" />
                )}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{point.hours}</p>
                {point.distance && <p className="text-[9px] text-brand-gold font-bold uppercase tracking-widest">{point.distance}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
