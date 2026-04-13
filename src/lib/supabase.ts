/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const DEFAULT_URL = 'https://zrvwegppvttwqnvlbmbf.supabase.co';
const DEFAULT_KEY = 'sb_publishable_2bzZwyAKRo2lqsG7WpA41A_ZEIVgArc';

// Ensure we have a valid URL format for the client initialization
// If rawUrl is missing or doesn't start with http, use the default
const supabaseUrl = (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().startsWith('http')) 
  ? rawUrl.trim() 
  : DEFAULT_URL;

const supabaseAnonKey = (rawKey && typeof rawKey === 'string' && rawKey.trim().length > 20) 
  ? rawKey.trim() 
  : DEFAULT_KEY;

if (rawUrl && typeof rawUrl === 'string' && !rawUrl.trim().startsWith('http')) {
  console.warn('⚠️ VITE_SUPABASE_URL is set but invalid (must start with http). Using default URL.');
}

if (!rawUrl || !rawKey) {
  console.error('⚠️ SUPABASE CREDENTIALS MISSING: Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the Secrets panel (gear icon).');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
