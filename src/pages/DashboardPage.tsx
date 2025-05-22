import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, LayoutList } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProfileCard } from '../components/profile/ProfileCard';
import { AlbumCard } from '../components/albums/AlbumCard';
import { PhotoCard } from '../components/photos/PhotoCard';
import { PhotoUploader } from '../components/photos/PhotoUploader';
import { PhotoLightbox } from '../components/photos/PhotoLightbox';
import { useAuthStore } from '../store/useAuthStore';
import { useAlbumStore } from '../store/useAlbumStore';
import { usePhotoStore } from '../store/usePhotoStore';
import { getWelcomeMessage } from '../utils/helpers';

export const DashboardPage: React.FC = () => {
  const { profile } = useAuthStore();
  const { albums, fetchAlbums, isLoading: isLoadingAlbums } = useAlbumStore();
  const { 
    photos, 
    fetchPhotos, 
    isLoading: isLoadingPhotos,
    selectedPhotoId,
    setSelectedPhotoId
  } = usePhotoStore();
  
  const [showUploader, setShowUploader] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  useEffect(() => {
    fetchAlbums();
    fetchPhotos();
  }, [fetchAlbums, fetchPhotos]);
  
  const handleViewPhoto = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };
  
  const handlePrevPhoto = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextPhoto = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  return (
    <div className="space-y-8">
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            {getWelcomeMessage(profile.full_name.split(' ')[0])}
          </h1>
        </motion.div>
      )}
      
      {/* Recent photos section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Photos</h2>
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
            <Button
              size="sm"
              onClick={() => setShowUploader(true)}
              icon={<Plus size={18} />}
            >
              Upload
            </Button>
          </div>
        </div>
        
        {isLoadingPhotos ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md h-48"></div>
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="glass-card text-center py-12">
            <h3 className="text-lg font-medium mb-2">No photos yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload your first photos to get started
            </p>
            <Button
              size="sm"
              onClick={() => setShowUploader(true)}
              icon={<Plus size={18} />}
            >
              Upload Photos
            </Button>
          </div>
        ) : (
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1'
          } gap-4`}>
            {photos.slice(0, 8).map((photo, index) => (
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
      </section>
      
      {/* Albums section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Albums</h2>
        </div>
        
        {isLoadingAlbums ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse glass-card h-40"></div>
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="glass-card text-center py-12">
            <h3 className="text-lg font-medium mb-2">No albums yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your albums will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map(album => (
              <AlbumCard
                key={album.id}
                id={album.id}
                name={album.name}
                emoji={album.emoji}
                photoCount={photos.filter(p => p.album_id === album.id).length}
              />
            ))}
          </div>
        )}
      </section>
      
      {/* Upload dialog */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <PhotoUploader
            onClose={() => setShowUploader(false)}
          />
        </div>
      )}
      
      {/* Lightbox */}
      {showLightbox && (
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setShowLightbox(false)}
          onPrev={handlePrevPhoto}
          onNext={handleNextPhoto}
        />
      )}
    </div>
  );
};