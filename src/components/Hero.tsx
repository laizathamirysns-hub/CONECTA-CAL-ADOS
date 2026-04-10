/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { ArrowRight, CreditCard, Banknote } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0A0A]">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]"></div>
        <img 
          src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=1920&h=1080&grayscale=true" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-12 max-w-4xl"
        >
          <div className="space-y-6 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <span className="h-[1px] w-12 bg-brand-gold"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">
                Nova Serrana • MG
              </span>
              <span className="h-[1px] w-12 bg-brand-gold"></span>
            </motion.div>
            
            <div className="overflow-hidden">
              <motion.h1 
                className="text-6xl md:text-9xl font-bold tracking-tighter text-white leading-[0.85] uppercase"
              >
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                  className="block"
                >
                  A Arte da
                </motion.span>
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.4 }}
                  className="block gold-text relative"
                >
                  <motion.span
                    animate={{ 
                      filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
                      textShadow: [
                        "0 0 0px rgba(212,175,55,0)",
                        "0 0 20px rgba(212,175,55,0.3)",
                        "0 0 0px rgba(212,175,55,0)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Conexão
                  </motion.span>
                </motion.span>
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.6 }}
                  className="block"
                >
                  em Seus Pés.
                </motion.span>
              </motion.h1>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed font-light mx-auto"
            >
              Onde a tradição do polo calçadista mineiro encontra a sofisticação tecnológica. Conectamos o atacado e o varejo com excelência.
            </motion.p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 px-12 py-8 text-sm font-bold tracking-widest uppercase rounded-none transition-all duration-500 hover:tracking-[0.3em]">
              Explorar Catálogo
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 px-12 py-8 text-sm font-bold tracking-widest uppercase rounded-none transition-all duration-500">
              Seja um Parceiro
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-12 pt-12 border-t border-white/10 w-full max-w-2xl mx-auto">
            <div>
              <p className="text-4xl font-light text-white">500<span className="text-brand-gold">+</span></p>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">Modelos</p>
            </div>
            <div>
              <p className="text-4xl font-light text-white">50<span className="text-brand-gold">+</span></p>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">Fábricas</p>
            </div>
            <div>
              <p className="text-4xl font-light text-white">10k<span className="text-brand-gold">+</span></p>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">Clientes</p>
            </div>
          </div>

          {/* Payment & Trust Card - Integrated Below */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="glass-panel p-8 w-full max-w-3xl mx-auto mt-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <p className="text-[10px] font-bold tracking-[0.2em] text-brand-gold uppercase mb-4">Pagamento Seguro</p>
                <div className="flex gap-4 text-white/60">
                  <div className="h-10 w-12 rounded-none border border-white/10 flex items-center justify-center bg-white/5">
                    <span className="text-[10px] font-bold">PIX</span>
                  </div>
                  <div className="h-10 w-12 rounded-none border border-white/10 flex items-center justify-center bg-white/5">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="h-10 w-12 rounded-none border border-white/10 flex items-center justify-center bg-white/5">
                    <Banknote className="h-5 w-5" />
                  </div>
                </div>
              </div>
              
              <div className="md:border-l md:border-white/10 md:pl-8 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-brand-dark bg-brand-graphite overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">+5k Clientes Satisfeitos</span>
                </div>
                <p className="text-sm text-white/70 italic leading-relaxed">
                  "Melhor fornecedor de Nova Serrana. Qualidade impecável e entrega rápida!"
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
