/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../lib/supabase';
import { Job, JobApplication } from '../types';

const TABLE_NAME = 'jobs';
const APPLICATIONS_TABLE = 'job_applications';

export const jobService = {
  async getJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        companyName: item.company_name,
        role: item.role,
        description: item.description,
        requirements: item.requirements,
        contact: item.contact,
        type: item.type,
        area: item.area,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  },

  subscribeToJobs(callback: (jobs: Job[]) => void) {
    this.getJobs().then(callback);

    const channel = supabase
      .channel('public:jobs')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_NAME }, () => {
        this.getJobs().then(callback);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async addJob(job: Omit<Job, 'id'>): Promise<string> {
    try {
      const dbJob = {
        company_name: job.companyName,
        role: job.role,
        description: job.description,
        requirements: job.requirements,
        contact: job.contact,
        type: job.type,
        area: job.area,
        created_at: job.createdAt || Date.now()
      };
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([dbJob])
        .select();
      
      if (error) throw error;
      return data?.[0]?.id || '';
    } catch (error) {
      console.error('Error adding job:', error);
      return '';
    }
  },

  async uploadResume(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading resume:', error);
      return '';
    }
  },

  async applyForJob(application: Omit<JobApplication, 'id'>): Promise<string> {
    try {
      const dbApp = {
        job_id: application.jobId,
        candidate_name: application.candidateName,
        candidate_email: application.candidateEmail,
        candidate_phone: application.candidatePhone,
        experience: application.experience,
        resume_url: application.resumeUrl,
        status: application.status,
        created_at: application.createdAt || Date.now()
      };
      const { data, error } = await supabase
        .from(APPLICATIONS_TABLE)
        .insert([dbApp])
        .select();
      
      if (error) throw error;
      return data?.[0]?.id || '';
    } catch (error) {
      console.error('Error applying for job:', error);
      return '';
    }
  },

  async getApplicationsByJob(jobId: string): Promise<JobApplication[]> {
    try {
      const { data, error } = await supabase
        .from(APPLICATIONS_TABLE)
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(item => ({
        id: item.id,
        jobId: item.job_id,
        candidateName: item.candidate_name,
        candidateEmail: item.candidate_email,
        candidatePhone: item.candidate_phone,
        experience: item.experience,
        resumeUrl: item.resume_url,
        status: item.status,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
  }
};
