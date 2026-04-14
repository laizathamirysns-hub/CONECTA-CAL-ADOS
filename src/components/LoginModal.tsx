/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { signInWithEmail, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    isManufacturer: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmail(formData.email, formData.password);
      } else {
        await signUp(
          formData.email, 
          formData.password, 
          formData.name, 
          formData.isManufacturer ? 'manufacturer' : 'customer'
        );
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-brand-dark border-white/10 text-white p-0 overflow-hidden max-w-md">
        <div className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase tracking-tighter text-center">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </DialogTitle>
            <p className="text-center text-white/40 text-xs uppercase tracking-widest font-bold">
              {isLogin ? 'Acesse sua conta de vendedor ou cliente' : 'Cadastre-se para vender ou comprar'}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <Input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input 
                  required
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isManufacturer"
                  checked={formData.isManufacturer}
                  onChange={e => setFormData({...formData, isManufacturer: e.target.checked})}
                  className="rounded-none bg-white/5 border-white/10 text-brand-gold focus:ring-brand-gold"
                />
                <label htmlFor="isManufacturer" className="text-[10px] font-bold uppercase tracking-widest text-white/60 cursor-pointer">
                  Quero ser um vendedor (Fabricante)
                </label>
              </div>
            )}

            {error && <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>}
            {error && error.includes('rate limit') && (
              <p className="text-brand-gold text-[9px] font-bold uppercase text-center mt-2">
                Dica: Se você for o administrador, desative a confirmação de e-mail no painel do Supabase para evitar este limite durante testes.
              </p>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none h-12 font-bold uppercase tracking-widest text-xs"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isLogin ? 'Entrar' : 'Cadastrar')}
            </Button>
          </form>

          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/40">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-brand-gold hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Faça Login'}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
