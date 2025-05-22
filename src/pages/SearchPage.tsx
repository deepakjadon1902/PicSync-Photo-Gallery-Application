import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, LayoutGrid, LayoutList, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PhotoCard } from '../components/photos/PhotoCard';
import { PhotoLightbox } from '../components/photos/PhotoLightbox';
import { usePhotoStore } from '../store/usePhotoStore';
import { useAlbumStore } from '../store/useAlbumStore';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { photos, fetchPhotos, isLoading } = usePhotoStore();
  const { albums, fetchAlbums } = useAlbumStore();
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  
  useEffect(() => {
    fetchPhotos();
    fetchAlbums();
  }, [fetchPhotos, fetchAlbums]);
  
  useEffect(() => {
    setSearchTerm(query);
  }, [query]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };
  
  const handleViewPhoto = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };
  
  const handlePrevPhoto = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === 0 ? filteredPhotos.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextPhoto = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === filteredPhotos.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = 
      query === '' || 
      photo.title.toLowerCase().includes(query.toLowerCase()) ||
      (photo.description && photo.description.toLowerCase().includes(query.toLowerCase()));
      
    const matchesAlbum = 
      selectedAlbumId === '' || 
      photo.album_id === selectedAlbumId;
      
    return matchesSearch && matchesAlbum;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Search Photos</h1>
      </motion.div>
      
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search photos by title or description..."
            className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <Button type="submit">
          Search
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          icon={<Filter size={18} />}
          aria-label="Toggle filters"
        />
      </form>
      
      {/* Filters */}
      {showFilters && (
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Album
              </label>
              <select
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Albums</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>
                    {album.emoji} {album.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title')}
                className="w-full px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* View mode toggle */}
      <div className="flex justify-between items-center">
        <div className="text-gray-600 dark:text-gray-400">
          {filteredPhotos.length} {filteredPhotos.length === 1 ? 'result' : 'results'}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('grid')}
            icon={<LayoutGrid size={18} />}
            aria-label="Grid view"
          />
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            onClick={() => setViewMode('list')}
            icon={<LayoutList size={18} />}
            aria-label="List view"
          />
        </div>
      </div>
      
      {/* Results */}
      {isLoading ? (
        <div className={`grid ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1'
        } gap-4`}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md h-48"></div>
          ))}
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="glass-card text-center py-12">
          <h3 className="text-lg font-medium mb-2">No photos found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {query 
              ? `No photos match your search for "${query}"` 
              : 'Try a different search term or filter'}
          </p>
        </div>
      ) : (
        <div className={`grid ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1'
        } gap-4`}>
          {filteredPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              id={photo.id}
              url={photo.url}
              title={photo.title}
              description={photo.description}
              createdAt={photo.created_at}
              isPublic={photo.is_public}
              metadata={photo.metadata}
              onView={() => handleViewPhoto(index)}
              onEdit={() => console.log('Edit photo', photo.id)}
              onMove={() => console.log('Move photo', photo.id)}
            />
          ))}
        </div>
      )}
      
      {/* Lightbox */}
      {showLightbox && (
        <PhotoLightbox
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setShowLightbox(false)}
          onPrev={handlePrevPhoto}
          onNext={handleNextPhoto}
        />
      )}
    </div>
  );
};