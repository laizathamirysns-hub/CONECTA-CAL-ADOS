/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingCart, User, Search, Menu, Heart, LogOut, LogIn, Bell, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/src/contexts/CartContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartSheet } from './CartSheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { NotificationCenter } from './NotificationCenter';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';
import { LoginModal } from './LoginModal';

interface NavbarProps {
  priceMode: 'retail' | 'wholesale';
  setPriceMode: (mode: 'retail' | 'wholesale') => void;
  showJobs: boolean;
  setShowJobs: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showWishlist: boolean;
  setShowWishlist: (show: boolean) => void;
}

export function Navbar({ 
  priceMode, 
  setPriceMode, 
  showJobs, 
  setShowJobs,
  searchTerm,
  setSearchTerm,
  showWishlist,
  setShowWishlist
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user, profile, signIn, logout, isLoginModalOpen, setIsLoginModalOpen } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = notificationService.subscribeToUserNotifications(user.uid, setNotifications);
    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10 py-3" 
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo color="gold" className="h-10" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <a href="#" className="text-[11px] font-semibold text-white/60 hover:text-brand-gold transition-colors tracking-[0.2em] uppercase">Início</a>
            <a href="#catalog" className="text-[11px] font-semibold text-white/60 hover:text-brand-gold transition-colors tracking-[0.2em] uppercase">Catálogo</a>
            
            <button 
              onClick={() => setShowJobs(!showJobs)}
              className={cn(
                "text-[11px] font-semibold transition-colors tracking-[0.2em] uppercase",
                showJobs ? "text-brand-gold" : "text-white/60 hover:text-brand-gold"
              )}
            >
              Vagas
            </button>

            {/* Price Mode Toggle */}
            <div className="flex bg-white/5 p-1 rounded-none border border-white/10">
              <button
                onClick={() => setPriceMode('retail')}
                className={cn(
                  "px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                  priceMode === 'retail' 
                    ? "bg-brand-gold text-brand-dark" 
                    : "text-white/40 hover:text-white"
                )}
              >
                Varejo
              </button>
              <button
                onClick={() => setPriceMode('wholesale')}
                className={cn(
                  "px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all",
                  priceMode === 'wholesale' 
                    ? "bg-brand-gold text-brand-dark" 
                    : "text-white/40 hover:text-white"
                )}
              >
                Atacado
              </button>
            </div>

            <a href="#wholesale" className="text-[11px] font-semibold text-white/60 hover:text-brand-gold transition-colors tracking-[0.2em] uppercase">Atacado</a>
            <a href="#testimonials" className="text-[11px] font-semibold text-white/60 hover:text-brand-gold transition-colors tracking-[0.2em] uppercase">Sobre</a>
            <a href="#contact" className="text-[11px] font-semibold text-white/60 hover:text-brand-gold transition-colors tracking-[0.2em] uppercase">Contato</a>
          </div>

          {/* Search and Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-brand-gold transition-colors" />
              <Input 
                type="search" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-48 bg-white/5 border-white/10 focus:border-brand-gold/50 focus:ring-0 transition-all text-sm rounded-none"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-brand-gold hover:bg-white/5 relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-brand-gold text-brand-dark text-[10px] font-bold flex items-center justify-center rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  }
                />
                <PopoverContent className="p-0 bg-transparent border-none shadow-none" align="end">
                  <NotificationCenter />
                </PopoverContent>
              </Popover>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowWishlist(!showWishlist)}
                className={cn(
                  "text-white/60 hover:text-brand-gold hover:bg-white/5",
                  showWishlist && "text-brand-gold"
                )}
              >
                <Heart className={cn("h-5 w-5", showWishlist && "fill-brand-gold")} />
              </Button>
              
              <Sheet>
                <SheetTrigger 
                  render={
                    <Button variant="ghost" size="icon" className="text-white/60 hover:text-brand-gold hover:bg-white/5 relative">
                      <ShoppingCart className="h-5 w-5" />
                      {itemCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-brand-gold text-brand-dark text-[10px] font-bold flex items-center justify-center rounded-full">
                          {itemCount}
                        </span>
                      )}
                    </Button>
                  }
                />
                <SheetContent className="w-full sm:max-w-md bg-brand-dark border-white/10">
                  <CartSheet />
                </SheetContent>
              </Sheet>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="text-white/60 hover:text-brand-gold hover:bg-white/5">
                        <User className="h-5 w-5" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-56 bg-brand-graphite border-white/10 text-white">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {profile?.displayName && <p className="font-medium">{profile.displayName}</p>}
                        {user.email && <p className="w-[200px] truncate text-sm text-white/40">{user.email}</p>}
                        {profile?.role && <p className="text-[9px] uppercase tracking-widest text-brand-gold font-bold">{profile.role}</p>}
                      </div>
                    </div>
                    <DropdownMenuItem className="cursor-pointer hover:bg-white/5">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    {profile?.role === 'admin' || profile?.role === 'manufacturer' ? (
                      <DropdownMenuItem className="cursor-pointer hover:bg-white/5" onClick={() => window.location.hash = '#admin'}>
                        <Package className="mr-2 h-4 w-4" />
                        <span>Painel {profile.role === 'admin' ? 'Admin' : 'Vendedor'}</span>
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 focus:text-red-400 hover:bg-white/5">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsLoginModalOpen(true)} className="text-white/60 hover:text-brand-gold hover:bg-white/5">
                  <LogIn className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-dark border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input 
                  type="search" 
                  placeholder="Buscar..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-white/5 border-white/10 rounded-none"
                />
              </div>

              {/* Mobile Price Mode Toggle */}
              <div className="flex bg-white/5 p-1 rounded-none border border-white/10">
                <button
                  onClick={() => setPriceMode('retail')}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                    priceMode === 'retail' 
                      ? "bg-brand-gold text-brand-dark" 
                      : "text-white/40 hover:text-white"
                  )}
                >
                  Varejo
                </button>
                <button
                  onClick={() => setPriceMode('wholesale')}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                    priceMode === 'wholesale' 
                      ? "bg-brand-gold text-brand-dark" 
                      : "text-white/40 hover:text-white"
                  )}
                >
                  Atacado
                </button>
              </div>

              <div className="flex flex-col space-y-4">
                <a href="#catalog" className="text-sm font-medium text-white/60 hover:text-brand-gold tracking-widest uppercase">Catálogo</a>
                <button 
                  onClick={() => {
                    setShowJobs(!showJobs);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "text-sm font-medium tracking-widest uppercase text-left",
                    showJobs ? "text-brand-gold" : "text-white/60 hover:text-brand-gold"
                  )}
                >
                  Vagas em Nova Serrana
                </button>
                <a href="#wholesale" className="text-sm font-medium text-white/60 hover:text-brand-gold tracking-widest uppercase">Atacado</a>
                <a href="#testimonials" className="text-sm font-medium text-white/60 hover:text-brand-gold tracking-widest uppercase">Sobre</a>
                <a href="#contact" className="text-sm font-medium text-white/60 hover:text-brand-gold tracking-widest uppercase">Contato</a>
              </div>
              <div className="flex space-x-4 pt-6 border-t border-white/10">
                {!user ? (
                  <Button onClick={() => setIsLoginModalOpen(true)} variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/5">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Entrar</span>
                  </Button>
                ) : (
                  <Button onClick={logout} variant="outline" className="flex-1 border-white/10 text-red-400 hover:bg-white/5">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                )}
                
                <Sheet>
                  <SheetTrigger
                    render={
                      <Button className="flex-1 space-x-2 bg-brand-gold text-brand-dark hover:bg-brand-gold/90">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Carrinho ({itemCount})</span>
                      </Button>
                    }
                  />
                  <SheetContent side="right" className="w-full sm:max-w-md bg-brand-dark border-white/10">
                    <CartSheet />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
}
