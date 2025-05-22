import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, LayoutGrid, LayoutList } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PhotoCard } from '../components/photos/PhotoCard';
import { PhotoUploader } from '../components/photos/PhotoUploader';
import { PhotoLightbox } from '../components/photos/PhotoLightbox';
import { useAlbumStore } from '../store/useAlbumStore';
import { usePhotoStore } from '../store/usePhotoStore';

export const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { albums, fetchAlbums } = useAlbumStore();
  const { 
    photos, 
    fetchPhotos, 
    isLoading: isLoadingPhotos 
  } = usePhotoStore();
  
  const [showUploader, setShowUploader] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  useEffect(() => {
    fetchAlbums();
    if (id) {
      fetchPhotos(id);
    }
  }, [id, fetchAlbums, fetchPhotos]);
  
  const album = albums.find(a => a.id === id);
  const albumPhotos = photos;
  
  const handleViewPhoto = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };
  
  const handlePrevPhoto = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === 0 ? albumPhotos.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextPhoto = () => {
    setLightboxIndex((prevIndex) => 
      prevIndex === albumPhotos.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  if (!album) {
    return (
      <div className="glass-card text-center py-12">
        <h3 className="text-lg font-medium mb-2">Album not found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The album you're looking for doesn't exist
        </p>
        <Button
          size="sm"
          onClick={() => navigate('/albums')}
          icon={<ArrowLeft size={18} />}
        >
          Back to Albums
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/albums')}
          icon={<ArrowLeft size={18} />}
          aria-label="Back to albums"
        />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <span className="text-3xl mr-2 animate-float">{album.emoji}</span>
          <h1 className="text-2xl md:text-3xl font-bold">{album.name}</h1>
        </motion.div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-gray-600 dark:text-gray-400">
          {albumPhotos.length} {albumPhotos.length === 1 ? 'photo' : 'photos'}
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
          <Button
            size="sm"
            onClick={() => setShowUploader(true)}
            icon={<Plus size={18} />}
          >
            Add Photos
          </Button>
        </div>
      </div>
      
      {/* Photos grid */}
      {isLoadingPhotos ? (
        <div className={`grid ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1'
        } gap-4`}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md h-48"></div>
          ))}
        </div>
      ) : albumPhotos.length === 0 ? (
        <div className="glass-card text-center py-12">
          <h3 className="text-lg font-medium mb-2">No photos in this album</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add your first photo to this album
          </p>
          <Button
            size="sm"
            onClick={() => setShowUploader(true)}
            icon={<Plus size={18} />}
          >
            Add Photos
          </Button>
        </div>
      ) : (
        <div className={`grid ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1'
        } gap-4`}>
          {albumPhotos.map((photo, index) => (
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
      
      {/* Upload dialog */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <PhotoUploader
            albumId={id}
            onClose={() => setShowUploader(false)}
          />
        </div>
      )}
      
      {/* Lightbox */}
      {showLightbox && (
        <PhotoLightbox
          photos={albumPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setShowLightbox(false)}
          onPrev={handlePrevPhoto}
          onNext={handleNextPhoto}
        />
      )}
    </div>
  );
};