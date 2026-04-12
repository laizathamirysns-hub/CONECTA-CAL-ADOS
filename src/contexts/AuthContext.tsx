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
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, role?: 'customer' | 'manufacturer') => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isManufacturer: boolean;
  toggleFavorite: (productId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
        setProfile(data as UserProfile);
      } else {
        // Profile doesn't exist, create it (should have been created on signUp, but for Google login)
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const newProfile: UserProfile = {
            uid: userData.user.id,
            email: userData.user.email || '',
            displayName: userData.user.user_metadata.full_name || '',
            role: userData.user.email === 'laizathamirysns@gmail.com' ? 'admin' : 'customer',
            favorites: [],
            createdAt: Date.now()
          };
          await supabase.from('profiles').insert([newProfile]);
          setProfile(newProfile);
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

  const signIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

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
          }
        }
      });
      
      if (error) throw error;

      if (data.user) {
        const newProfile: UserProfile = {
          uid: data.user.id,
          email: email,
          displayName: name,
          role: email === 'laizathamirysns@gmail.com' ? 'admin' : role,
          favorites: [],
          createdAt: Date.now()
        };
        
        const { error: profileError } = await supabase.from('profiles').insert([newProfile]);
        if (profileError) throw profileError;
        setProfile(newProfile);
      }
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
      signIn, 
      signInWithEmail,
      signUp,
      logout, 
      isAdmin, 
      isManufacturer,
      toggleFavorite 
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
