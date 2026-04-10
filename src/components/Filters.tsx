/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CATEGORIES, COLORS, SIZES } from '@/src/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Filter, X } from 'lucide-react';

interface FiltersProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedSize: number | null;
  setSelectedSize: (size: number | null) => void;
}

export function Filters({
  selectedCategory,
  setSelectedCategory,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize
}: FiltersProps) {
  const hasFilters = selectedCategory || selectedColor || selectedSize;

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedColor(null);
    setSelectedSize(null);
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-brand-gold" />
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white">Filtros</h2>
        </div>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-8 px-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-brand-gold hover:bg-transparent"
          >
            Limpar
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">Categorias</h3>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`flex items-center justify-between px-4 py-3 text-[11px] font-medium tracking-widest uppercase transition-all duration-300 border ${
                  selectedCategory === category 
                    ? 'bg-brand-gold text-brand-dark border-brand-gold' 
                    : 'bg-white/5 text-white/60 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {category}
                {selectedCategory === category && <span className="h-1 w-1 bg-brand-dark rounded-full"></span>}
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Colors */}
        <div className="space-y-4">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">Cores</h3>
          <div className="flex flex-wrap gap-4">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                className={`group relative h-8 w-8 rounded-none border transition-all duration-300 ${
                  selectedColor === color ? 'border-brand-gold scale-110' : 'border-white/10 hover:border-white/30'
                }`}
                title={color}
              >
                <span 
                  className="absolute inset-1 border border-white/10"
                  style={{ 
                    backgroundColor: color === 'Branco' ? '#FFFFFF' : 
                                     color === 'Preto' ? '#000000' :
                                     color === 'Bege' ? '#F5F5DC' :
                                     color === 'Marrom' ? '#8B4513' :
                                     color === 'Cinza' ? '#808080' :
                                     color === 'Azul Marinho' ? '#000080' : '#ccc'
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Sizes */}
        <div className="space-y-4">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30">Tamanhos</h3>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? 'default' : 'outline'}
                className={`h-10 w-full text-[10px] font-bold rounded-none transition-all duration-300 ${
                  selectedSize === size 
                    ? 'bg-brand-gold text-brand-dark border-brand-gold' 
                    : 'bg-white/5 text-white/60 border-white/5 hover:border-white/20 hover:text-white'
                }`}
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
