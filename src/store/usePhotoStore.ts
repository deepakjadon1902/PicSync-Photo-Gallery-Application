import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { nanoid } from '../utils/helpers';

interface Photo {
  id: string;
  title: string;
  description: string | null;
  url: string;
  created_at: string;
  album_id: string;
  user_id: string;
  is_public: boolean;
  metadata: any;
}

interface UploadProgress {
  [key: string]: number;
}

interface PhotoState {
  photos: Photo[];
  isLoading: boolean;
  uploadProgress: UploadProgress;
  selectedPhotoId: string | null;
  searchTerm: string;
  sortBy: 'newest' | 'oldest' | 'title';
  fetchPhotos: (albumId?: string) => Promise<void>;
  uploadPhoto: (file: File, photoInfo: { title: string; albumId: string; description?: string; isPublic?: boolean }) => Promise<void>;
  updatePhoto: (id: string, updates: Partial<Omit<Photo, 'id' | 'created_at' | 'user_id' | 'url'>>) => Promise<void>;
  deletePhoto: (id: string, url: string) => Promise<void>;
  movePhoto: (photoId: string, newAlbumId: string) => Promise<void>;
  setSelectedPhotoId: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: 'newest' | 'oldest' | 'title') => void;
  getFilteredPhotos: () => Photo[];
  downloadPhoto: (url: string, title: string) => Promise<void>;
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  isLoading: false,
  uploadProgress: {},
  selectedPhotoId: null,
  searchTerm: '',
  sortBy: 'newest',

  fetchPhotos: async (albumId) => {
    set({ isLoading: true });
    
    try {
      let query = supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (albumId) {
        query = query.eq('album_id', albumId);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      set({ photos: data || [] });
    } catch (error: any) {
      console.error('Error fetching photos:', error);
      toast.error('Failed to load photos');
    } finally {
      set({ isLoading: false });
    }
  },

  uploadPhoto: async (file, photoInfo) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');
      
      // Update progress state
      set(state => ({
        uploadProgress: { ...state.uploadProgress, [file.name]: 0 }
      }));
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${nanoid()}.${fileExt}`;
      const filePath = `${userData.user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);
        
      if (!publicUrlData.publicUrl) throw new Error('Failed to get public URL');
      
      // Add record to database
      const { error: dbError, data: photo } = await supabase
        .from('photos')
        .insert({
          title: photoInfo.title,
          description: photoInfo.description || null,
          url: publicUrlData.publicUrl,
          album_id: photoInfo.albumId,
          user_id: userData.user.id,
          is_public: photoInfo.isPublic || false,
          metadata: {
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            originalName: file.name,
          },
        })
        .select()
        .single();

      if (dbError) throw dbError;
      
      // Update local state
      set(state => ({ 
        photos: [photo, ...state.photos],
        uploadProgress: { ...state.uploadProgress, [file.name]: 100 }
      }));
      
      toast.success('Photo uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast.error(error.message || 'Failed to upload photo');
      
      // Clean up failed upload
      set(state => {
        const newProgress = { ...state.uploadProgress };
        delete newProgress[file.name];
        return { uploadProgress: newProgress };
      });
    }
  },

  updatePhoto: async (id, updates) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('photos')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        photos: state.photos.map(photo => 
          photo.id === id ? { ...photo, ...updates } : photo
        )
      }));
      
      toast.success('Photo updated successfully!');
    } catch (error: any) {
      console.error('Error updating photo:', error);
      toast.error(error.message || 'Failed to update photo');
    } finally {
      set({ isLoading: false });
    }
  },

  deletePhoto: async (id, url) => {
    set({ isLoading: true });
    
    try {
      // Extract path from URL
      const storagePathMatch = url.match(/\/photos\/([^?]+)/);
      if (!storagePathMatch) throw new Error('Invalid storage path');
      
      const storagePath = storagePathMatch[1];
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([storagePath]);
        
      if (storageError) throw storageError;
      
      // Delete from database
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        photos: state.photos.filter(photo => photo.id !== id),
        selectedPhotoId: state.selectedPhotoId === id ? null : state.selectedPhotoId
      }));
      
      toast.success('Photo deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      toast.error(error.message || 'Failed to delete photo');
    } finally {
      set({ isLoading: false });
    }
  },

  movePhoto: async (photoId, newAlbumId) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('photos')
        .update({ album_id: newAlbumId })
        .eq('id', photoId);

      if (error) throw error;
      
      set(state => ({
        photos: state.photos.map(photo => 
          photo.id === photoId ? { ...photo, album_id: newAlbumId } : photo
        )
      }));
      
      toast.success('Photo moved successfully!');
    } catch (error: any) {
      console.error('Error moving photo:', error);
      toast.error(error.message || 'Failed to move photo');
    } finally {
      set({ isLoading: false });
    }
  },

  downloadPhoto: async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${title}.${blob.type.split('/')[1]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      console.error('Error downloading photo:', error);
      toast.error('Failed to download photo');
    }
  },

  setSelectedPhotoId: (id) => {
    set({ selectedPhotoId: id });
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  setSortBy: (sort) => {
    set({ sortBy: sort });
  },

  getFilteredPhotos: () => {
    const { photos, searchTerm, sortBy } = get();
    
    let filtered = [...photos];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(photo => 
        photo.title.toLowerCase().includes(term) || 
        (photo.description && photo.description.toLowerCase().includes(term))
      );
    }
    
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    return filtered;
  },
}));