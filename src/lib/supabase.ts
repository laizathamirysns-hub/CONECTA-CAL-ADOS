/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ensure we have a valid URL format for the client initialization
const supabaseUrl = (rawUrl && rawUrl.trim().startsWith('http')) 
  ? rawUrl.trim() 
  : 'https://placeholder-project.supabase.co';

const supabaseAnonKey = (rawKey && rawKey.trim()) 
  ? rawKey.trim() 
  : 'placeholder-key';

if (rawUrl && !rawUrl.trim().startsWith('http')) {
  console.error('⚠️ INVALID SUPABASE URL: The URL must start with http:// or https://. Current value:', rawUrl);
}

if (!rawUrl || !rawKey) {
  console.error('⚠️ SUPABASE CREDENTIALS MISSING: Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the Secrets panel (gear icon).');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
