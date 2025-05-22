import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Info } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Button } from '../ui/Button';

interface Photo {
  id: string;
  url: string;
  title: string;
  description: string | null;
  created_at: string;
}

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  
  const currentPhoto = photos[currentIndex];
  
  if (!currentPhoto) {
    onClose();
    return null;
  }
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentPhoto.url;
    link.download = currentPhoto.title || 'photo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleRotate = () => {
    setRotationDegree((prev) => (prev + 90) % 360);
  };
  
  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      onPrev();
    } else if (e.key === 'ArrowRight') {
      onNext();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div 
        className="absolute top-4 right-4 z-10 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={() => setShowInfo(!showInfo)}
          aria-label={showInfo ? "Hide info" : "Show info"}
        >
          <Info size={18} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={handleDownload}
          aria-label="Download photo"
        >
          <Download size={18} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <X size={18} />
        </Button>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhoto.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <motion.img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className={`max-w-[90vw] max-h-[85vh] object-contain cursor-zoom-in ${isZoomed ? 'scale-150' : ''}`}
              onClick={handleImageClick}
              style={{ 
                transform: `rotate(${rotationDegree}deg) ${isZoomed ? 'scale(1.5)' : 'scale(1)'}`,
                transition: 'transform 0.3s ease',
              }}
            />
          </div>
          
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="glass absolute bottom-0 left-0 right-0 p-4 text-white"
            >
              <h3 className="text-lg font-medium">{currentPhoto.title}</h3>
              {currentPhoto.description && (
                <p className="text-gray-300 mt-1">{currentPhoto.description}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                Uploaded on {formatDate(currentPhoto.created_at)}
              </p>
            </motion.div>
          )}
          
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </Button>
          </div>
          
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};