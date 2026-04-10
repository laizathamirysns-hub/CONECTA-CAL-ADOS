/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, CartItem } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WhatsAppButton } from './WhatsAppButton';
import { ShoppingCart, Heart, Check, Info, Ruler } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from '@/src/contexts/CartContext';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { SizeGuide } from './SizeGuide';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const currentStock = product.sizes.find(s => s.size === selectedSize)?.quantity || 0;

  const handleAddToCart = () => {
    if (!selectedSize) return;

    const isWholesale = quantity >= product.wholesaleMinQuantity;
    const price = isWholesale ? product.wholesalePrice : product.retailPrice;

    const item: CartItem = {
      productId: product.id,
      name: product.name,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      price,
      isWholesale
    };

    addToCart(item);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-brand-dark p-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-none bg-[#0A0A0A] border border-white/5">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((img, i) => (
            <div key={i} className="aspect-square rounded-none overflow-hidden border border-white/5 bg-white/5 cursor-pointer hover:opacity-80 transition-opacity">
              <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-8">
        <div className="space-y-2">
          <Badge variant="outline" className="text-brand-gold border-brand-gold/30 uppercase tracking-widest text-[10px] rounded-none">{product.category}</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase">{product.name}</h1>
          <p className="text-white/40 leading-relaxed font-light">{product.description}</p>
        </div>

        <div className="space-y-4 p-6 bg-white/5 rounded-none border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Preço Varejo</span>
            <span className="text-3xl font-bold text-white">
              {product.retailPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="space-y-1">
              <span className="text-xs text-brand-gold/60 uppercase tracking-widest font-bold">Preço Atacado</span>
              <p className="text-[10px] text-brand-gold/40">Mínimo de {product.wholesaleMinQuantity} pares</p>
            </div>
            <span className="text-2xl font-bold text-brand-gold">
              {product.wholesalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Cor: <span className="text-white font-normal">{selectedColor}</span></h3>
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`group relative h-10 w-10 rounded-full border-2 transition-all ${
                  selectedColor === color.name ? 'border-brand-gold scale-110' : 'border-transparent hover:scale-105'
                }`}
              >
                <span 
                  className="absolute inset-1 rounded-full border border-white/10"
                  style={{ backgroundColor: color.hex }}
                />
                {selectedColor === color.name && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-brand-dark drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Tamanho</h3>
            <Dialog>
              <DialogTrigger
                render={
                  <Button variant="link" size="sm" className="text-brand-gold text-[10px] font-bold uppercase tracking-widest h-auto p-0 hover:text-brand-gold/80">
                    <Ruler className="mr-1 h-3 w-3" />
                    Guia de Medidas
                  </Button>
                }
              />
              <DialogContent className="max-w-4xl bg-brand-dark border-white/10 p-0">
                <SizeGuide />
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.sizes.map((s) => (
              <Button
                key={s.size}
                variant={selectedSize === s.size ? 'default' : 'outline'}
                disabled={s.quantity === 0}
                onClick={() => setSelectedSize(s.size)}
                className={`h-12 text-sm transition-all relative rounded-none ${
                  selectedSize === s.size 
                    ? 'bg-brand-gold text-brand-dark border-brand-gold' 
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                {s.size}
                {s.quantity < 5 && s.quantity > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full" />
                )}
              </Button>
            ))}
          </div>
          {selectedSize && (
            <p className="text-[10px] text-white/40 flex items-center gap-1 uppercase tracking-widest font-bold">
              <Info className="h-3 w-3" />
              {currentStock > 0 ? `${currentStock} unidades disponíveis` : 'Sem estoque para este tamanho'}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 pt-6">
          <div className="flex gap-4">
            <div className="flex items-center border border-white/10 rounded-none overflow-hidden h-14 bg-white/5">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 hover:bg-white/5 transition-colors h-full text-white"
              >-</button>
              <span className="w-12 text-center font-bold text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 hover:bg-white/5 transition-colors h-full text-white"
              >+</button>
            </div>
            <Button 
              onClick={handleAddToCart}
              disabled={!selectedSize || currentStock === 0}
              className="flex-grow h-14 bg-brand-gold text-brand-dark hover:bg-brand-gold/90 text-sm font-bold uppercase tracking-widest rounded-none"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Adicionar ao Carrinho
            </Button>
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-none border-white/10 text-white hover:bg-white/5">
              <Heart className="h-6 w-6" />
            </Button>
          </div>
          
          <WhatsAppButton 
            phoneNumber="5537999999999" 
            message={`Olá! Gostaria de saber mais sobre o produto: ${product.name}`}
            className="h-14 rounded-none text-sm font-bold uppercase tracking-widest"
          />
        </div>
      </div>
    </div>
  );
}
