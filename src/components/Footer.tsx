/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer id="contact" className="bg-brand-dark text-white/40 py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Brand */}
          <div className="space-y-8">
            <Logo color="gold" className="h-10" />
            <p className="text-sm leading-relaxed font-light">
              Conectando o polo calçadista de Nova Serrana com o Brasil. Excelência, sofisticação e tecnologia no atacado e varejo.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white/40 hover:text-brand-gold transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-white/40 hover:text-brand-gold transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-white/40 hover:text-brand-gold transition-colors"><MessageCircle className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">Navegação</h3>
            <ul className="space-y-4 text-xs font-medium tracking-widest uppercase">
              <li><a href="#catalog" className="hover:text-brand-gold transition-colors">Catálogo</a></li>
              <li><a href="#wholesale" className="hover:text-brand-gold transition-colors">Atacado</a></li>
              <li><a href="#testimonials" className="hover:text-brand-gold transition-colors">Sobre</a></li>
              <li><a href="#jobs" className="hover:text-brand-gold transition-colors">Vagas</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">Suporte</h3>
            <ul className="space-y-4 text-xs font-medium tracking-widest uppercase">
              <li><a href="#" className="hover:text-brand-gold transition-colors">Minha Conta</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Meus Pedidos</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Trocas e Devoluções</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Políticas</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-8">Contato</h3>
            <ul className="space-y-6 text-xs font-light">
              <li className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-brand-gold shrink-0" />
                <span className="leading-relaxed">Nova Serrana, MG<br />Polo Calçadista Nacional</span>
              </li>
              <li className="flex items-center space-x-4">
                <Phone className="h-5 w-5 text-brand-gold shrink-0" />
                <span>(37) 99999-9999</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-brand-gold shrink-0" />
                <span className="lowercase">contato@conectacalcados.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium tracking-[0.2em] uppercase text-white/20">
          <p>&copy; {new Date().getFullYear()} Conecta Calçados. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
