/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Briefcase, Building2, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { jobService } from '@/src/services/jobService';
import { Job } from '@/src/types';

export function JobRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    description: '',
    requirements: '',
    contact: '',
    type: 'CLT' as Job['type'],
    area: 'Produção' as Job['area']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await jobService.addJob({
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r !== ''),
        createdAt: Date.now()
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Error adding job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-12 text-center space-y-6 bg-brand-dark">
        <div className="h-20 w-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10 text-brand-gold" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Vaga Cadastrada!</h2>
          <p className="text-white/60">Sua oportunidade já está visível para os candidatos de Nova Serrana.</p>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none px-8"
        >
          Concluído
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-brand-dark text-white">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
        <Briefcase className="h-6 w-6 text-brand-gold" />
        <h2 className="text-2xl font-bold uppercase tracking-tighter">Cadastrar Vaga</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Empresa</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input 
                required
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                placeholder="Nome da Fábrica" 
                className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Cargo</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input 
                required
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                placeholder="Ex: Auxiliar de Produção" 
                className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Área</label>
            <select 
              value={formData.area}
              onChange={e => setFormData({...formData, area: e.target.value as Job['area']})}
              className="w-full bg-white/5 border border-white/10 focus:border-brand-gold/50 rounded-none h-10 px-3 text-sm"
            >
              <option value="Produção">Produção</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Vendas">Vendas</option>
              <option value="Logística">Logística</option>
              <option value="Design">Design</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tipo de Contrato</label>
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as Job['type']})}
              className="w-full bg-white/5 border border-white/10 focus:border-brand-gold/50 rounded-none h-10 px-3 text-sm"
            >
              <option value="CLT">CLT</option>
              <option value="PJ">PJ</option>
              <option value="Temporário">Temporário</option>
              <option value="Estágio">Estágio</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Descrição da Vaga</label>
          <textarea 
            required
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Descreva as atividades e responsabilidades..." 
            className="w-full bg-white/5 border border-white/10 focus:border-brand-gold/50 rounded-none min-h-[100px] p-3 text-sm text-white outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Requisitos (separados por vírgula)</label>
          <Input 
            required
            value={formData.requirements}
            onChange={e => setFormData({...formData, requirements: e.target.value})}
            placeholder="Ex: Experiência em montagem, Disponibilidade de horário" 
            className="bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">WhatsApp de Contato</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
            <Input 
              required
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
              placeholder="Ex: 37999999999" 
              className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
            />
          </div>
        </div>

        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none py-6 font-bold uppercase tracking-widest text-xs"
        >
          {isSubmitting ? 'Cadastrando...' : 'Publicar Vaga'}
        </Button>
      </form>
    </div>
  );
}
