import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  email: string;
  hobbies: string[] | null;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  initialized: boolean;
  signUp: (email: string, password: string, userData: Omit<Profile, 'id'>) => Promise<void>;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (profile: Partial<Omit<Profile, 'id'>>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  initialized: false,

  initialize: async () => {
    set({ isLoading: true });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        set({ user, session });
        await get().getProfile();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      toast.error('Failed to initialize session');
    } finally {
      set({ isLoading: false, initialized: true });
    }
  },

  signUp: async (email, password, userData) => {
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        // Create profile with user data
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: userData.full_name,
            date_of_birth: userData.date_of_birth,
            phone_number: userData.phone_number,
            email: userData.email,
            hobbies: userData.hobbies,
          });

        if (profileError) throw profileError;
        
        toast.success('Account created successfully!');
        
        // Create default albums
        const defaultAlbums = [
          { name: 'Me', emoji: '🤳', user_id: data.user.id },
          { name: 'Fun Time', emoji: '🎉', user_id: data.user.id },
          { name: 'Travel', emoji: '✈️', user_id: data.user.id },
          { name: 'Family', emoji: '👨‍👩‍👧‍👦', user_id: data.user.id },
          { name: 'Events', emoji: '🎭', user_id: data.user.id },
          { name: 'Nature', emoji: '🌲', user_id: data.user.id },
          { name: 'Food', emoji: '🍕', user_id: data.user.id },
          { name: 'Pets', emoji: '🐾', user_id: data.user.id },
          { name: 'Art', emoji: '🎨', user_id: data.user.id },
          { name: 'Sports', emoji: '⚽', user_id: data.user.id },
          { name: 'Memories', emoji: '💭', user_id: data.user.id },
          { name: 'Celebrations', emoji: '🎊', user_id: data.user.id },
          { name: 'Work', emoji: '💼', user_id: data.user.id },
          { name: 'Hobbies', emoji: '🎯', user_id: data.user.id },
          { name: 'Adventures', emoji: '🗺️', user_id: data.user.id },
          { name: 'Music', emoji: '🎵', user_id: data.user.id },
          { name: 'Movies', emoji: '🎬', user_id: data.user.id },
          { name: 'Books', emoji: '📚', user_id: data.user.id },
          { name: 'Fashion', emoji: '👗', user_id: data.user.id },
          { name: 'Technology', emoji: '💻', user_id: data.user.id },
          { name: 'Fitness', emoji: '💪', user_id: data.user.id },
          { name: 'Education', emoji: '📚', user_id: data.user.id },
          { name: 'Gaming', emoji: '🎮', user_id: data.user.id },
          { name: 'Cooking', emoji: '👩‍🍳', user_id: data.user.id },
          { name: 'Shopping', emoji: '🛍️', user_id: data.user.id }
        ];
        
        const { error: albumsError } = await supabase
          .from('albums')
          .insert(defaultAlbums);

        if (albumsError) {
          console.error('Failed to create default albums', albumsError);
        }
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Failed to sign up');
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email, password, rememberMe) => {
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      set({ 
        user: data.user,
        session: data.session
      });
      
      await get().getProfile();
      
      toast.success('Signed in successfully!');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ 
        user: null,
        session: null,
        profile: null,
      });
      
      toast.success('Signed out successfully!');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Failed to sign out');
    } finally {
      set({ isLoading: false });
    }
  },

  getProfile: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      set({ profile: data });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },

  updateProfile: async (profileUpdates) => {
    const { user } = get();
    if (!user) return;
    
    set({ isLoading: true });
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (error) throw error;
      
      await get().getProfile();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true });
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to send password reset email');
    } finally {
      set({ isLoading: false });
    }
  },
}));