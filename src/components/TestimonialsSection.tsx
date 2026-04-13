/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "Ricardo Santos",
    role: "Lojista - São Paulo",
    content: "A Conecta Calçados facilitou muito meu processo de compra. O atendimento é ágil e os produtos de Nova Serrana são imbatíveis em qualidade.",
    rating: 5
  },
  {
    name: "Ana Oliveira",
    role: "Revendedora - Belo Horizonte",
    content: "Excelente variedade e preços competitivos para atacado. A entrega sempre chega no prazo e a curadoria de modelos é perfeita.",
    rating: 5
  },
  {
    name: "Marcos Pereira",
    role: "Proprietário de Loja - Curitiba",
    content: "O sistema de pedidos é intuitivo e a transparência nos estoques ajuda muito no planejamento das minhas coleções.",
    rating: 5
  }
];

export function TestimonialsSection({ id }: { id?: string }) {
  return (
    <section id={id} className="bg-[#0A0A0A] py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] font-bold tracking-[0.4em] text-brand-gold uppercase"
          >
            Depoimentos
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase">
            O que dizem nossos <br />
            <span className="gold-text">Parceiros</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="glass-panel p-10 relative group hover:border-brand-gold/30 transition-all duration-500"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-white/5 group-hover:text-brand-gold/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-brand-gold text-brand-gold" />
                ))}
              </div>

              <p className="text-white/60 text-sm leading-relaxed mb-8 font-light italic">
                "{t.content}"
              </p>

              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider">{t.name}</p>
                <p className="text-[10px] text-brand-gold/60 uppercase tracking-widest mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
