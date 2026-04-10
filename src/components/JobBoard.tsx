/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, Search, Filter, MessageCircle, Plus, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { jobService } from '@/src/services/jobService';
import { Job } from '@/src/types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { JobRegistrationForm } from './JobRegistrationForm';
import { JobApplicationForm } from './JobApplicationForm';

export function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJob, setAppliedJob] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = jobService.subscribeToJobs((fetchedJobs) => {
      setJobs(fetchedJobs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = jobs;

    if (selectedArea) {
      result = result.filter(job => job.area === selectedArea);
    }

    if (selectedType) {
      result = result.filter(job => job.type === selectedType);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.role.toLowerCase().includes(term) || 
        job.companyName.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term)
      );
    }

    setFilteredJobs(result);
  }, [jobs, selectedArea, selectedType, searchTerm]);

  const areas = ['Produção', 'Administrativo', 'Vendas', 'Logística', 'Design', 'Outros'];
  const types = ['CLT', 'PJ', 'Temporário', 'Estágio'];

  return (
    <section id="jobs" className="py-32 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-12 bg-brand-gold"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">Oportunidades</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[0.9] uppercase">
              Vagas em <br />
              <span className="gold-text">Nova Serrana.</span>
            </h2>
          </div>

          <Dialog>
            <DialogTrigger
              render={
                <Button className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 px-8 py-6 text-xs font-bold tracking-widest uppercase rounded-none">
                  <Plus className="mr-2 h-4 w-4" />
                  Anunciar Vaga
                </Button>
              }
            />
            <DialogContent className="max-w-2xl bg-brand-dark border-white/10 p-0">
              <JobRegistrationForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="glass-panel p-8 mb-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-brand-gold transition-colors" />
              <Input 
                placeholder="Buscar cargo ou empresa..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none text-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(selectedArea === area ? null : area)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    selectedArea === area 
                      ? 'bg-brand-gold text-brand-dark border-brand-gold' 
                      : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    selectedType === type 
                      ? 'bg-brand-gold text-brand-dark border-brand-gold' 
                      : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-panel p-8 border border-white/5 hover:border-brand-gold/30 transition-all duration-500 group"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">{job.area}</span>
                      <h3 className="text-xl font-bold text-white group-hover:text-brand-gold transition-colors">{job.role}</h3>
                      <p className="text-sm text-white/40 font-medium">{job.companyName}</p>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-white/60 rounded-none uppercase text-[9px] tracking-widest">
                      {job.type}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Requisitos:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, idx) => (
                          <span key={idx} className="text-[10px] text-white/50 bg-white/5 px-2 py-1">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/40">
                      <MapPin className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Nova Serrana, MG</span>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger
                        render={
                          <Button className="bg-white/5 hover:bg-brand-gold text-white hover:text-brand-dark border border-white/10 hover:border-brand-gold rounded-none transition-all duration-500 font-bold uppercase tracking-widest text-[10px]">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Tenho Interesse
                          </Button>
                        }
                      />
                      <DialogContent className="max-w-2xl bg-brand-dark border-white/10 p-0">
                        {appliedJob === job.id ? (
                          <div className="p-12 text-center space-y-6 bg-brand-dark">
                            <div className="h-20 w-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle2 className="h-10 w-10 text-brand-gold" />
                            </div>
                            <div className="space-y-2">
                              <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Candidatura Enviada!</h2>
                              <p className="text-white/60">A empresa entrará em contato caso seu perfil seja selecionado.</p>
                            </div>
                            <Button 
                              onClick={() => setAppliedJob(null)}
                              className="bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none px-8"
                            >
                              Fechar
                            </Button>
                          </div>
                        ) : (
                          <JobApplicationForm 
                            job={job} 
                            onSuccess={() => setAppliedJob(job.id)} 
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-24">
            <Briefcase className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 font-medium">Nenhuma vaga encontrada para os filtros selecionados.</p>
          </div>
        )}
      </div>
    </section>
  );
}
