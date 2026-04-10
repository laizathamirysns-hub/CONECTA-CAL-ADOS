/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { jobService } from '@/src/services/jobService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2, User, Phone, Mail, FileText } from 'lucide-react';
import { Job } from '../types';

interface JobApplicationFormProps {
  job: Job;
  onSuccess: () => void;
}

export function JobApplicationForm({ job, onSuccess }: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    experience: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await jobService.applyForJob({
        jobId: job.id,
        ...formData,
        status: 'pending',
        createdAt: Date.now()
      });
      onSuccess();
    } catch (error) {
      console.error('Error applying for job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-brand-dark text-white space-y-8">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <h3 className="text-2xl font-bold uppercase tracking-tighter text-white">Candidatar-se</h3>
        <p className="text-sm text-brand-gold font-bold uppercase tracking-widest">{job.role} @ {job.companyName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
              <Input 
                required
                value={formData.candidateName}
                onChange={e => setFormData({...formData, candidateName: e.target.value})}
                className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input 
                  required
                  type="email"
                  value={formData.candidateEmail}
                  onChange={e => setFormData({...formData, candidateEmail: e.target.value})}
                  className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                <Input 
                  required
                  value={formData.candidatePhone}
                  onChange={e => setFormData({...formData, candidatePhone: e.target.value})}
                  className="pl-10 bg-white/5 border-white/10 focus:border-brand-gold/50 rounded-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Experiência Profissional</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-white/20" />
              <textarea 
                required
                value={formData.experience}
                onChange={e => setFormData({...formData, experience: e.target.value})}
                placeholder="Conte um pouco sobre suas experiências anteriores..."
                className="w-full pl-10 bg-white/5 border border-white/10 focus:border-brand-gold/50 rounded-none min-h-[120px] p-3 text-sm text-white outline-none"
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full h-16 bg-brand-gold text-brand-dark hover:bg-brand-gold/90 text-xs font-bold uppercase tracking-[0.2em] rounded-none"
        >
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar Candidatura'}
        </Button>
      </form>
    </div>
  );
}
