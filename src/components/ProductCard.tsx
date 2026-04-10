/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '@/src/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ProductDetails } from './ProductDetails';
import { useAuth } from '@/src/contexts/AuthContext';

import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  priceMode?: 'retail' | 'wholesale';
  key?: string | number;
}

export function ProductCard({ product, priceMode = 'retail' }: ProductCardProps) {
  const { profile, toggleFavorite } = useAuth();
  const isFavorite = profile?.favorites?.includes(product.id);

  return (
    <Dialog>
      <motion.div
        whileHover={{ y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Card className="group overflow-hidden border-white/5 bg-brand-graphite hover:border-brand-gold/30 transition-all duration-500 rounded-none">
          <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0A]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <Badge className="bg-brand-gold text-brand-dark border-none rounded-none text-[10px] font-bold tracking-widest uppercase">Destaque</Badge>
              )}
              <Badge variant="secondary" className="bg-black/60 backdrop-blur-md text-white border-white/10 rounded-none text-[10px] font-medium tracking-widest uppercase">
                {product.category}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              className={cn(
                "absolute top-4 right-4 h-10 w-10 rounded-none bg-black/40 backdrop-blur-md border border-white/10 transition-all duration-300",
                isFavorite ? "bg-brand-gold text-brand-dark opacity-100" : "opacity-0 group-hover:opacity-100 hover:bg-brand-gold hover:text-brand-dark"
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-brand-dark")} />
            </Button>
          </div>
          
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-white/90 tracking-wider uppercase line-clamp-1 group-hover:text-brand-gold transition-colors">
              {product.name}
            </h3>
            <div className="flex flex-col gap-2">
              <div className={cn(
                "flex items-baseline justify-between transition-all duration-300",
                priceMode === 'retail' ? "opacity-100 scale-105" : "opacity-40"
              )}>
                <span className={cn(
                  "text-xl font-light",
                  priceMode === 'retail' ? "text-white" : "text-white/60"
                )}>
                  {product.retailPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em]">Varejo</span>
              </div>
              <div className={cn(
                "flex items-baseline justify-between pt-2 border-t border-white/5 transition-all duration-300",
                priceMode === 'wholesale' ? "opacity-100 scale-105" : "opacity-40"
              )}>
                <span className={cn(
                  "text-sm font-medium",
                  priceMode === 'wholesale' ? "text-brand-gold" : "text-brand-gold/60"
                )}>
                  {product.wholesalePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em]">Atacado</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <DialogTrigger
              render={
                <Button className="w-full bg-white/5 hover:bg-brand-gold text-white hover:text-brand-dark border border-white/10 hover:border-brand-gold rounded-none transition-all duration-500 font-bold uppercase tracking-widest text-[10px] py-6">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              }
            />
          </CardFooter>
        </Card>
      </motion.div>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <ProductDetails product={product} />
      </DialogContent>
    </Dialog>
  );
}
