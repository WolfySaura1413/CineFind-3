/**
 * Authentication store (Zustand)
 *
 * Global state for auth, user, and login status
 */

import { create } from 'zustand';
import * as authService from '@/services/auth';

export interface AuthUser {
  id: string;
  email: string;
  createdAt: Date;
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Auth methods
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signUp({ email, password });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Sign up failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signIn({ email, password });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Sign in failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.signOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Sign out failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({
        user: user || null,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch user';
      set({ error: message, isLoading: false });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Password reset failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
