/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { UserEvent, UserNote, UserChecklist } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, FileText, CheckSquare, Trash2, Check } from 'lucide-react';
import { motion } from 'motion/react';

export function UserDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [checklists, setChecklists] = useState<UserChecklist[]>([]);
  const [loading, setLoading] = useState(true);

  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' });
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [newChecklist, setNewChecklist] = useState({ title: '', items: '' });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [evs, nts, cls] = await Promise.all([
        supabaseService.getEvents(user.id),
        supabaseService.getNotes(user.id),
        supabaseService.getChecklists(user.id)
      ]);
      setEvents(evs);
      setNotes(nts);
      setChecklists(cls);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabaseService.addEvent({
      userId: user.id,
      title: newEvent.title,
      description: '',
      date: newEvent.date,
      time: newEvent.time,
      createdAt: Date.now()
    });
    setNewEvent({ title: '', date: '', time: '' });
    loadData();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabaseService.addNote({
      userId: user.id,
      title: newNote.title,
      content: newNote.content,
      createdAt: Date.now()
    });
    setNewNote({ title: '', content: '' });
    loadData();
  };

  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const items = newChecklist.items.split(',').map(i => i.trim()).filter(i => i);
    await supabaseService.addChecklist(user.id, newChecklist.title, items);
    setNewChecklist({ title: '', items: '' });
    loadData();
  };

  const toggleCheckItem = async (itemId: string, completed: boolean) => {
    await supabaseService.toggleChecklistItem(itemId, !completed);
    loadData();
  };

  if (loading) return <div className="p-8 text-center text-white/40 uppercase tracking-widest text-xs font-bold">Carregando sua área...</div>;

  return (
    <div className="space-y-12 p-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <span className="text-[10px] font-bold tracking-[0.4em] text-brand-gold uppercase">Área Pessoal</span>
        <h1 className="text-5xl font-bold tracking-tighter uppercase">Minha Central</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events */}
        <div className="space-y-6">
          <Card className="bg-brand-graphite border-white/5 rounded-none">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-gold" /> Eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleAddEvent} className="space-y-4">
                <Input 
                  placeholder="Título do evento" 
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  className="bg-white/5 border-white/10 rounded-none text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="date" 
                    value={newEvent.date}
                    onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-none text-xs"
                  />
                  <Input 
                    type="time" 
                    value={newEvent.time}
                    onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    className="bg-white/5 border-white/10 rounded-none text-xs"
                  />
                </div>
                <Button type="submit" className="w-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none text-[10px] font-bold uppercase tracking-widest">
                  Adicionar Evento
                </Button>
              </form>
              <div className="space-y-2 pt-4">
                {events.map(event => (
                  <div key={event.id} className="p-4 bg-white/5 border border-white/5 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider">{event.title}</p>
                    <p className="text-[10px] text-white/40">{event.date} às {event.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <div className="space-y-6">
          <Card className="bg-brand-graphite border-white/5 rounded-none">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-gold" /> Notas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleAddNote} className="space-y-4">
                <Input 
                  placeholder="Título da nota" 
                  value={newNote.title}
                  onChange={e => setNewNote({...newNote, title: e.target.value})}
                  className="bg-white/5 border-white/10 rounded-none text-xs"
                />
                <textarea 
                  placeholder="Conteúdo..." 
                  value={newNote.content}
                  onChange={e => setNewNote({...newNote, content: e.target.value})}
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-none text-xs p-3 focus:outline-none focus:border-brand-gold/50"
                />
                <Button type="submit" className="w-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none text-[10px] font-bold uppercase tracking-widest">
                  Salvar Nota
                </Button>
              </form>
              <div className="space-y-2 pt-4">
                {notes.map(note => (
                  <div key={note.id} className="p-4 bg-white/5 border border-white/5 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider">{note.title}</p>
                    <p className="text-[10px] text-white/40 line-clamp-3">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checklists */}
        <div className="space-y-6">
          <Card className="bg-brand-graphite border-white/5 rounded-none">
            <CardHeader className="p-6 border-b border-white/5">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-brand-gold" /> Checklists
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleAddChecklist} className="space-y-4">
                <Input 
                  placeholder="Título da lista" 
                  value={newChecklist.title}
                  onChange={e => setNewChecklist({...newChecklist, title: e.target.value})}
                  className="bg-white/5 border-white/10 rounded-none text-xs"
                />
                <Input 
                  placeholder="Itens (separados por vírgula)" 
                  value={newChecklist.items}
                  onChange={e => setNewChecklist({...newChecklist, items: e.target.value})}
                  className="bg-white/5 border-white/10 rounded-none text-xs"
                />
                <Button type="submit" className="w-full bg-brand-gold text-brand-dark hover:bg-brand-gold/90 rounded-none text-[10px] font-bold uppercase tracking-widest">
                  Criar Lista
                </Button>
              </form>
              <div className="space-y-4 pt-4">
                {checklists.map(list => (
                  <div key={list.id} className="p-4 bg-white/5 border border-white/5 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider border-b border-white/5 pb-2">{list.title}</p>
                    <div className="space-y-2">
                      {list.items?.map(item => (
                        <div 
                          key={item.id} 
                          onClick={() => toggleCheckItem(item.id, item.completed)}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <div className={`h-4 w-4 border border-white/20 flex items-center justify-center transition-colors ${item.completed ? 'bg-brand-gold border-brand-gold' : 'group-hover:border-brand-gold'}`}>
                            {item.completed && <Check className="h-3 w-3 text-brand-dark" />}
                          </div>
                          <span className={`text-[10px] uppercase tracking-widest font-bold ${item.completed ? 'text-white/20 line-through' : 'text-white/60'}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
