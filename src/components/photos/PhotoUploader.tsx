import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, Check, Image } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { usePhotoStore } from '../../store/usePhotoStore';
import { useAlbumStore } from '../../store/useAlbumStore';

interface PhotoUploaderProps {
  albumId?: string;
  onClose: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  albumId, 
  onClose 
}) => {
  const { uploadPhoto, uploadProgress } = usePhotoStore();
  const { albums } = useAlbumStore();
  
  const [files, setFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [photoInfo, setPhotoInfo] = useState({
    title: '',
    description: '',
    albumId: albumId || '',
    isPublic: false,
  });
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
      setCurrentFileIndex(0);
      
      // Set a default title based on the file name
      const fileName = acceptedFiles[0].name.split('.')[0];
      setPhotoInfo(prev => ({
        ...prev,
        title: fileName,
      }));
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentFileIndex === null || !files[currentFileIndex]) return;
    
    try {
      await uploadPhoto(files[currentFileIndex], photoInfo);
      
      // Move to the next file or close if done
      if (currentFileIndex < files.length - 1) {
        setCurrentFileIndex(currentFileIndex + 1);
        
        // Reset form for next image, keeping the album selection
        const fileName = files[currentFileIndex + 1].name.split('.')[0];
        setPhotoInfo(prev => ({
          ...prev,
          title: fileName,
          description: '',
        }));
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPhotoInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: 'spring',
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="glass-card max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Upload Photos</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </Button>
      </div>
      
      {files.length === 0 ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <Upload 
              size={48} 
              className={`mb-4 ${isDragActive ? 'text-primary-500' : 'text-gray-400'}`} 
            />
            
            {isDragActive ? (
              <p className="font-medium text-primary-500">Drop the files here...</p>
            ) : (
              <>
                <p className="font-medium mb-2">Drag & drop photos here</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or click to select files</p>
                <Button size="sm">
                  Select Photos
                </Button>
              </>
            )}
            
            <p className="mt-4 text-xs text-gray-500">
              Maximum file size: 5MB
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {currentFileIndex !== null && files[currentFileIndex] && (
            <>
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <p>
                    Photo {currentFileIndex + 1} of {files.length}
                  </p>
                  {uploadProgress[files[currentFileIndex].name] !== undefined && (
                    <div className="flex items-center gap-1 text-success-500">
                      <Check size={14} />
                      <span>Uploaded</span>
                    </div>
                  )}
                </div>
                
                <div className="relative h-48 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={URL.createObjectURL(files[currentFileIndex])} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <Input
                  label="Title"
                  name="title"
                  value={photoInfo.title}
                  onChange={handleChange}
                  placeholder="Enter photo title"
                  required
                  icon={<Image size={18} />}
                />
                
                <Input
                  label="Description (optional)"
                  name="description"
                  value={photoInfo.description}
                  onChange={handleChange}
                  placeholder="Add a description"
                />
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Album
                  </label>
                  <select
                    name="albumId"
                    value={photoInfo.albumId}
                    onChange={(e) => setPhotoInfo(prev => ({ ...prev, albumId: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select an album</option>
                    {albums.map(album => (
                      <option key={album.id} value={album.id}>
                        {album.emoji} {album.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={photoInfo.isPublic}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Make this photo public
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!photoInfo.title || !photoInfo.albumId}
                >
                  {currentFileIndex < files.length - 1 ? 'Upload & Continue' : 'Upload Photo'}
                </Button>
              </div>
            </>
          )}
        </form>
      )}
    </motion.div>
  );
};