/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
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
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        favorites: newFavorites
      });
      setProfile({ ...profile, favorites: newFavorites });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // Create profile if it doesn't exist
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: firebaseUser.email === 'laizathamirysns@gmail.com' ? 'admin' : 'customer',
              favorites: [],
              createdAt: Date.now()
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, pass: string, name: string, role: 'customer' | 'manufacturer' = 'customer') => {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(newUser, { displayName: name });
      
      const newProfile: UserProfile = {
        uid: newUser.uid,
        email: email,
        displayName: name,
        role: email === 'laizathamirysns@gmail.com' ? 'admin' : role,
        favorites: [],
        createdAt: Date.now()
      };
      
      await setDoc(doc(db, 'users', newUser.uid), newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
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
