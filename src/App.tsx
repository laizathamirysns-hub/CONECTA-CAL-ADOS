/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Filters } from './components/Filters';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { SplashScreen } from './components/SplashScreen';
import { TestimonialsSection } from './components/TestimonialsSection';
import { MusicPlayer } from './components/MusicPlayer';
import { JobBoard } from './components/JobBoard';
import { MOCK_PRODUCTS } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, List, SlidersHorizontal, Settings, ShoppingBag, Search, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { productService } from './services/productService';
import { Product } from './types';
import { useAuth } from './contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceMode, setPriceMode] = useState<'retail' | 'wholesale'>('retail');
  const [isAdminView, setIsAdminView] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showWishlist, setShowWishlist] = useState(false);
  const { isAdmin, isManufacturer, profile } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Check geolocation for Nova Serrana
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Approximate coordinates for Nova Serrana, MG
        const nsLat = -19.87;
        const nsLng = -44.98;
        const distance = Math.sqrt(Math.pow(latitude - nsLat, 2) + Math.pow(longitude - nsLng, 2));
        
        // If within ~50km (approx 0.5 degrees)
        if (distance < 0.5) {
          setShowJobs(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = productService.subscribeToProducts((fetchedProducts) => {
      setProducts(fetchedProducts);
    });
    return () => unsubscribe();
  }, []);

  const seedDatabase = async () => {
    if (!isAdmin) return;
    for (const product of MOCK_PRODUCTS) {
      const { id, ...productData } = product;
      await productService.addProduct(productData);
    }
    alert('Banco de dados populado com sucesso!');
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = !selectedCategory || product.category === selectedCategory;
      const colorMatch = !selectedColor || product.colors.some(c => c.name === selectedColor);
      const sizeMatch = !selectedSize || product.sizes.some(s => s.size === selectedSize && s.quantity > 0);
      const searchMatch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const wishlistMatch = !showWishlist || (profile?.favorites?.includes(product.id));
      
      return categoryMatch && colorMatch && sizeMatch && searchMatch && wishlistMatch;
    });
  }, [products, selectedCategory, selectedColor, selectedSize, searchTerm, showWishlist, profile]);

  if (isAdminView && profile) {
    return (
      <div className="min-h-screen bg-brand-dark">
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
          <Button 
            onClick={() => {
              setIsAdminView(false);
              window.location.hash = '';
            }}
            className="h-14 w-14 rounded-full bg-brand-gold text-brand-dark shadow-2xl hover:scale-110 transition-transform"
          >
            <ShoppingBag className="h-6 w-6" />
          </Button>
        </div>
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-sans selection:bg-brand-gold selection:text-brand-dark">
      <SplashScreen />
      <Navbar 
        priceMode={priceMode} 
        setPriceMode={setPriceMode} 
        showJobs={showJobs}
        setShowJobs={setShowJobs}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showWishlist={showWishlist}
        setShowWishlist={setShowWishlist}
      />
      
      <main className="flex-grow">
        <Hero />

        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-32 glass-panel p-8">
                <Filters 
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  selectedSize={selectedSize}
                  setSelectedSize={setSelectedSize}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow space-y-12">
              {/* Toolbar */}
              <div className="flex items-center justify-between pb-8 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold tracking-tight text-white uppercase">
                    Catálogo
                    <span className="ml-4 text-xs font-medium text-white/40 tracking-widest">
                      [{filteredProducts.length} ITENS]
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mobile Filter Trigger */}
                  <Sheet>
                    <SheetTrigger
                      render={
                        <Button variant="outline" size="sm" className="lg:hidden border-white/10 text-white hover:bg-white/5">
                          <SlidersHorizontal className="mr-2 h-4 w-4" />
                          Filtros
                        </Button>
                      }
                    />
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-brand-dark border-white/10">
                      <div className="py-8">
                        <Filters 
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          selectedColor={selectedColor}
                          setSelectedColor={setSelectedColor}
                          selectedSize={selectedSize}
                          setSelectedSize={setSelectedSize}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="hidden sm:flex items-center bg-white/5 p-1">
                    <Button 
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "h-8 w-8 p-0 rounded-none",
                        viewMode === 'grid' ? "bg-brand-gold text-brand-dark" : "text-white/40 hover:text-white"
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "h-8 w-8 p-0 rounded-none",
                        viewMode === 'list' ? "bg-brand-gold text-brand-dark" : "text-white/40 hover:text-white"
                      )}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                  <motion.div 
                    layout
                    className={`grid gap-8 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} priceMode={priceMode} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="h-24 w-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
                      <Search className="h-10 w-10 text-neutral-300" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900">Nenhum produto encontrado</h3>
                    <p className="text-neutral-500 mt-2">Tente ajustar seus filtros para encontrar o que procura.</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedColor(null);
                        setSelectedSize(null);
                      }}
                      className="mt-4 text-neutral-900 font-bold"
                    >
                      Limpar todos os filtros
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <TestimonialsSection id="testimonials" />

        {showJobs && <div id="jobs"><JobBoard /></div>}

        {/* Wholesale CTA */}
        <section id="wholesale" className="bg-brand-graphite py-32 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl space-y-10">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.4em] text-brand-gold uppercase">Parceria B2B</span>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9] uppercase">
                  COMPRE NO ATACADO <br />
                  <span className="gold-text">DIRETO DA FÁBRICA.</span>
                </h2>
              </div>
              <p className="text-xl text-white/40 leading-relaxed font-light">
                Condições exclusivas para lojistas e revendedores. Preços diferenciados e logística otimizada para todo o Brasil.
              </p>
              <div className="flex flex-wrap gap-6">
                <a href="#catalog">
                  <Button size="lg" className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 px-10 py-7 text-sm font-bold tracking-widest uppercase rounded-none">
                    Ver Catálogo e Preços
                  </Button>
                </a>
                <a href="#contact">
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 px-10 py-7 text-sm font-bold tracking-widest uppercase rounded-none">
                    Falar com Consultor
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <Button 
          onClick={() => setIsAdminView(true)}
          className="h-14 w-14 rounded-full bg-brand-gold text-brand-dark shadow-2xl hover:scale-110 transition-transform"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>

      <Footer />
      <MusicPlayer />
    </div>
  );
}
