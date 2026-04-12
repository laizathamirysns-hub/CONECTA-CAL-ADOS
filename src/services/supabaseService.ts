/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from '../lib/supabase';
import { UserEvent, UserNote, UserChecklist, ChecklistItem } from '../types';

export const supabaseService = {
  // Events
  async getEvents(userId: string): Promise<UserEvent[]> {
    const { data, error } = await supabase
      .from('user_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addEvent(event: Omit<UserEvent, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('user_events')
      .insert([event])
      .select();
    
    if (error) throw error;
    return data?.[0]?.id || '';
  },

  // Notes
  async getNotes(userId: string): Promise<UserNote[]> {
    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addNote(note: Omit<UserNote, 'id'>): Promise<string> {
    const { data, error } = await supabase
      .from('user_notes')
      .insert([note])
      .select();
    
    if (error) throw error;
    return data?.[0]?.id || '';
  },

  // Checklists
  async getChecklists(userId: string): Promise<UserChecklist[]> {
    const { data, error } = await supabase
      .from('user_checklists')
      .select(`
        *,
        items:checklist_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addChecklist(userId: string, title: string, items: string[]): Promise<string> {
    const { data: checklist, error: checklistError } = await supabase
      .from('user_checklists')
      .insert([{ user_id: userId, title, created_at: Date.now() }])
      .select()
      .single();
    
    if (checklistError) throw checklistError;

    if (items.length > 0) {
      const checklistItems = items.map(text => ({
        checklist_id: checklist.id,
        text,
        completed: false
      }));
      const { error: itemsError } = await supabase
        .from('checklist_items')
        .insert(checklistItems);
      
      if (itemsError) throw itemsError;
    }

    return checklist.id;
  },

  async toggleChecklistItem(itemId: string, completed: boolean) {
    const { error } = await supabase
      .from('checklist_items')
      .update({ completed })
      .eq('id', itemId);
    
    if (error) throw error;
  }
};
