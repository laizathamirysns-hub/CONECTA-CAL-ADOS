/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ruler, Info } from 'lucide-react';
import { motion } from 'motion/react';

const SIZE_DATA = [
  { size: 33, length: '22,0 cm' },
  { size: 34, length: '22,7 cm' },
  { size: 35, length: '23,3 cm' },
  { size: 36, length: '24,0 cm' },
  { size: 37, length: '24,7 cm' },
  { size: 38, length: '25,3 cm' },
  { size: 39, length: '26,0 cm' },
  { size: 40, length: '26,7 cm' },
  { size: 41, length: '27,3 cm' },
  { size: 42, length: '28,0 cm' },
  { size: 43, length: '28,7 cm' },
];

export function SizeGuide() {
  return (
    <div className="space-y-8 p-6 bg-brand-dark text-white">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Ruler className="h-6 w-6 text-brand-gold" />
        <h2 className="text-2xl font-bold uppercase tracking-tighter">Guia de Tamanhos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Table */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Tabela de Medidas</h3>
          <div className="border border-white/10 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Numeração (BR)</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Comprimento (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {SIZE_DATA.map((item) => (
                  <tr key={item.size} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium">{item.size}</td>
                    <td className="px-4 py-3 text-white/60">{item.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Como medir seu pé</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-8 w-8 shrink-0 bg-brand-gold text-brand-dark flex items-center justify-center font-bold">1</div>
              <p className="text-sm text-white/70 leading-relaxed">
                Coloque uma folha de papel no chão, encostada na parede.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-8 shrink-0 bg-brand-gold text-brand-dark flex items-center justify-center font-bold">2</div>
              <p className="text-sm text-white/70 leading-relaxed">
                Pise na folha com o calcanhar encostado na parede.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-8 shrink-0 bg-brand-gold text-brand-dark flex items-center justify-center font-bold">3</div>
              <p className="text-sm text-white/70 leading-relaxed">
                Marque com um lápis onde termina o seu dedo mais longo.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="h-8 w-8 shrink-0 bg-brand-gold text-brand-dark flex items-center justify-center font-bold">4</div>
              <p className="text-sm text-white/70 leading-relaxed">
                Meça a distância da marca até o início da folha (calcanhar) com uma régua.
              </p>
            </div>
          </div>

          <div className="bg-white/5 p-4 border-l-2 border-brand-gold flex gap-3">
            <Info className="h-5 w-5 text-brand-gold shrink-0" />
            <p className="text-xs text-white/50 leading-relaxed italic">
              Dica: Se sua medida ficar entre dois tamanhos, recomendamos escolher o maior para maior conforto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
