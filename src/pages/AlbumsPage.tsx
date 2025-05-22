import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { AlbumCard } from '../components/albums/AlbumCard';
import { useAlbumStore } from '../store/useAlbumStore';
import { usePhotoStore } from '../store/usePhotoStore';

export const AlbumsPage: React.FC = () => {
  const { albums, fetchAlbums, isLoading } = useAlbumStore();
  const { photos, fetchPhotos } = usePhotoStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchAlbums();
    fetchPhotos();
  }, [fetchAlbums, fetchPhotos]);
  
  const filteredAlbums = albums.filter(album => 
    album.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    album.emoji.includes(searchTerm)
  );
  
  const getPhotoCount = (albumId: string) => {
    return photos.filter(photo => photo.album_id === albumId).length;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My Albums</h1>
      </motion.div>
      
      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search albums by name or emoji..."
            className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      
      {/* Albums grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse glass-card h-40"></div>
          ))}
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="glass-card text-center py-12">
          <h3 className="text-lg font-medium mb-2">No albums found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm ? 'Try a different search term' : 'Your albums will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAlbums.map(album => (
            <AlbumCard
              key={album.id}
              id={album.id}
              name={album.name}
              emoji={album.emoji}
              photoCount={getPhotoCount(album.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}