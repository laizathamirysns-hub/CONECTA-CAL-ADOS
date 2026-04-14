/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, role?: 'customer' | 'manufacturer') => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isManufacturer: boolean;
  toggleFavorite: (productId: string) => Promise<void>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('uid', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          uid: data.uid,
          email: data.email,
          displayName: data.display_name,
          role: data.role,
          favorites: data.favorites || [],
          createdAt: data.created_at
        });
      } else {
        // Profile doesn't exist, create it (fallback if trigger hasn't finished)
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const newProfileData = {
            uid: userData.user.id,
            email: userData.user.email || '',
            display_name: userData.user.user_metadata.full_name || userData.user.email || '',
            role: userData.user.email === 'laizathamirysns@gmail.com' ? 'admin' : (userData.user.user_metadata.role || 'customer'),
            favorites: [],
            created_at: Date.now()
          };
          
          // Use upsert or ignore error to prevent "duplicate key" if trigger already ran
          const { error: insertError } = await supabase.from('profiles').upsert([newProfileData], { onConflict: 'uid' });
          
          if (!insertError) {
            setProfile({
              uid: newProfileData.uid,
              email: newProfileData.email,
              displayName: newProfileData.display_name,
              role: newProfileData.role as any,
              favorites: newProfileData.favorites,
              createdAt: newProfileData.created_at
            });
          } else {
            // If upsert failed, try fetching again
            const { data: retryData } = await supabase.from('profiles').select('*').eq('uid', userId).single();
            if (retryData) {
              setProfile({
                uid: retryData.uid,
                email: retryData.email,
                displayName: retryData.display_name,
                role: retryData.role,
                favorites: retryData.favorites || [],
                createdAt: retryData.created_at
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user || !profile) {
      alert('Faça login para salvar seus favoritos!');
      return;
    }

    const isFavorite = profile.favorites.includes(productId);
    const newFavorites = isFavorite
      ? profile.favorites.filter(id => id !== productId)
      : [...profile.favorites, productId];

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ favorites: newFavorites })
        .eq('uid', user.id);

      if (error) throw error;
      setProfile({ ...profile, favorites: newFavorites });
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, pass: string, name: string, role: 'customer' | 'manufacturer' = 'customer') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });
      
      if (error) throw error;

      // Profile is created by the database trigger 'handle_new_user'
      // We'll wait for the session to update and fetchProfile will be called by the effect
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isManufacturer = profile?.role === 'manufacturer' || isAdmin;

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      signInWithEmail,
      signUp,
      logout, 
      isAdmin, 
      isManufacturer,
      toggleFavorite,
      isLoginModalOpen,
      setIsLoginModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
