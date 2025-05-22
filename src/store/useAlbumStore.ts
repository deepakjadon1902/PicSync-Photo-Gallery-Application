import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Album {
  id: string;
  name: string;
  emoji: string;
  created_at: string;
  user_id: string;
}

interface AlbumState {
  albums: Album[];
  isLoading: boolean;
  selectedAlbumId: string | null;
  fetchAlbums: () => Promise<void>;
  createAlbum: (name: string, emoji: string) => Promise<void>;
  updateAlbum: (id: string, updates: { name?: string; emoji?: string }) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  setSelectedAlbumId: (id: string | null) => void;
}

export const useAlbumStore = create<AlbumState>((set, get) => ({
  albums: [],
  isLoading: false,
  selectedAlbumId: null,

  fetchAlbums: async () => {
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      set({ albums: data });
    } catch (error: any) {
      console.error('Error fetching albums:', error);
      toast.error('Failed to load albums');
    } finally {
      set({ isLoading: false });
    }
  },

  createAlbum: async (name, emoji) => {
    set({ isLoading: true });
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('albums')
        .insert({
          name,
          emoji,
          user_id: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({ 
        albums: [data, ...state.albums] 
      }));
      
      toast.success('Album created successfully!');
    } catch (error: any) {
      console.error('Error creating album:', error);
      toast.error(error.message || 'Failed to create album');
    } finally {
      set({ isLoading: false });
    }
  },

  updateAlbum: async (id, updates) => {
    set({ isLoading: true });
    
    try {
      const { error } = await supabase
        .from('albums')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        albums: state.albums.map(album => 
          album.id === id ? { ...album, ...updates } : album
        )
      }));
      
      toast.success('Album updated successfully!');
    } catch (error: any) {
      console.error('Error updating album:', error);
      toast.error(error.message || 'Failed to update album');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAlbum: async (id) => {
    set({ isLoading: true });
    
    try {
      // First check if album has photos
      const { data: photos, error: checkError } = await supabase
        .from('photos')
        .select('id')
        .eq('album_id', id);
        
      if (checkError) throw checkError;
      
      if (photos && photos.length > 0) {
        throw new Error('Cannot delete album with photos. Move or delete photos first.');
      }
        
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        albums: state.albums.filter(album => album.id !== id),
        selectedAlbumId: state.selectedAlbumId === id ? null : state.selectedAlbumId
      }));
      
      toast.success('Album deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting album:', error);
      toast.error(error.message || 'Failed to delete album');
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedAlbumId: (id) => {
    set({ selectedAlbumId: id });
  },
}));