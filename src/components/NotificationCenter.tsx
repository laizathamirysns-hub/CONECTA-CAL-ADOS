/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { notificationService } from '@/src/services/notificationService';
import { useAuth } from '@/src/contexts/AuthContext';
import { Notification } from '../types';
import { Bell, Check, Trash2, Info, ShoppingBag, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = notificationService.subscribeToUserNotifications(user.uid, setNotifications);
    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return <ShoppingBag className="h-4 w-4 text-brand-gold" />;
      case 'job': return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'promo': return <Info className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-white/40" />;
    }
  };

  return (
    <div className="w-80 bg-brand-graphite border border-white/10 shadow-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white">Notificações</h3>
        {unreadCount > 0 && (
          <span className="bg-brand-gold text-brand-dark text-[9px] font-bold px-2 py-0.5 rounded-full">
            {unreadCount} Novas
          </span>
        )}
      </div>

      <ScrollArea className="h-80">
        {notifications.length > 0 ? (
          <div className="divide-y divide-white/5">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={cn(
                  "p-4 space-y-2 transition-colors hover:bg-white/5 relative group",
                  !n.read && "bg-brand-gold/5"
                )}
              >
                <div className="flex gap-3">
                  <div className="mt-1">{getIcon(n.type)}</div>
                  <div className="flex-grow space-y-1">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">{n.title}</p>
                    <p className="text-[10px] text-white/40 font-light leading-relaxed">{n.message}</p>
                    <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {!n.read && (
                  <button 
                    onClick={() => notificationService.markAsRead(n.id)}
                    className="absolute top-4 right-4 text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Marcar como lida"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-white/20">
            <Bell className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Nenhuma notificação</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
