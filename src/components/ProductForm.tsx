/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { productService } from '@/src/services/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Product;
}

export function ProductForm({ onSuccess, onCancel, initialData }: ProductFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    retailPrice: initialData?.retailPrice || 0,
    wholesalePrice: initialData?.wholesalePrice || 0,
    wholesaleMinQuantity: initialData?.wholesaleMinQuantity || 12,
    category: initialData?.category || 'Casual',
    images: initialData?.images || [''],
    colors: initialData?.colors || [{ name: 'Preto', hex: '#000000' }],
    sizes: initialData?.sizes || [
      { size: 35, quantity: 10 },
      { size: 36, quantity: 10 },
      { size: 37, quantity: 10 },
      { size: 38, quantity: 10 },
      { size: 39, quantity: 10 },
      { size: 40, quantity: 10 }
    ],
    featured: initialData?.featured || false,
    manufacturerId: initialData?.manufacturerId || user?.uid || ''
  });

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingImage(index);
    try {
      const url = await productService.uploadImage(file);
      if (url) {
        updateImage(index, url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        manufacturerId: initialData?.manufacturerId || user.uid,
        createdAt: initialData?.createdAt || Date.now()
      };

      if (initialData?.id) {
        await productService.updateProduct(initialData.id, productData);
      } else {
        await productService.addProduct(productData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImage = () => setFormData({ ...formData, images: [...formData.images, ''] });
  const removeImage = (index: number) => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-brand-dark text-white space-y-8 max-h-[90vh] overflow-y-auto">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <h3 className="text-2xl font-bold uppercase tracking-tighter text-white">
          {initialData ? 'Editar Produto' : 'Novo Produto'}
        </h3>
        <p className="text-sm text-white/40 font-light">Preencha as informações do calçado.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nome do Produto</label>
            <Input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Descrição</label>
            <textarea 
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 focus:border-brand-gold/50 rounded-none p-3 text-sm outline-none min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Preço Varejo</label>
              <Input 
                type="number"
                required
                value={formData.retailPrice}
                onChange={e => setFormData({...formData, retailPrice: parseFloat(e.target.value)})}
                className="bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Preço Atacado</label>
              <Input 
                type="number"
                required
                value={formData.wholesalePrice}
                onChange={e => setFormData({...formData, wholesalePrice: parseFloat(e.target.value)})}
                className="bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Categoria</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full bg-white/5 border border-white/10 focus:border-brand-gold/50 rounded-none p-3 text-sm outline-none"
            >
              <option value="Casual">Casual</option>
              <option value="Esportivo">Esportivo</option>
              <option value="Social">Social</option>
              <option value="Bota">Bota</option>
              <option value="Sandália">Sandália</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Imagens (URLs)</label>
              <Button type="button" variant="ghost" size="sm" onClick={addImage} className="text-brand-gold hover:bg-white/5 h-8 text-[10px] uppercase tracking-widest">
                <Plus className="h-3 w-3 mr-1" /> Adicionar
              </Button>
            </div>
            <div className="space-y-3">
              {formData.images.map((url, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                      <Input 
                        value={url}
                        onChange={e => updateImage(index, e.target.value)}
                        placeholder="URL da imagem ou use o botão ao lado"
                        className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        id={`image-upload-${index}`}
                        className="hidden"
                        accept="image/*"
                        onChange={e => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])}
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        disabled={uploadingImage === index}
                        onClick={() => document.getElementById(`image-upload-${index}`)?.click()}
                        className="text-brand-gold hover:bg-white/5"
                      >
                        {uploadingImage === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                    </div>
                    {formData.images.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)} className="text-white/20 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {url && (
                    <div className="h-20 w-20 border border-white/10 overflow-hidden">
                      <img src={url} alt="Preview" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Estoque por Tamanho</label>
            <div className="grid grid-cols-3 gap-3">
              {formData.sizes.map((s, index) => (
                <div key={s.size} className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-white/40 text-center">{s.size}</span>
                  <Input 
                    type="number"
                    value={s.quantity}
                    onChange={e => {
                      const newSizes = [...formData.sizes];
                      newSizes[index].quantity = parseInt(e.target.value);
                      setFormData({ ...formData, sizes: newSizes });
                    }}
                    className="h-10 bg-white/5 border-white/10 text-center rounded-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-8 border-t border-white/10">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-none h-14 uppercase tracking-widest text-[10px] font-bold"
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="flex-[2] bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none h-14 uppercase tracking-widest text-[10px] font-bold"
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Salvar Produto'}
        </Button>
      </div>
    </form>
  );
}
