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
      return data || [];
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
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([{ ...job, created_at: Date.now() }])
        .select();
      
      if (error) throw error;
      return data?.[0]?.id || '';
    } catch (error) {
      console.error('Error adding job:', error);
      return '';
    }
  },

  async applyForJob(application: Omit<JobApplication, 'id'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from(APPLICATIONS_TABLE)
        .insert([{ ...application, created_at: Date.now() }])
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
      return data || [];
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
  }
};
