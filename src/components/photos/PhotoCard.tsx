import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Info, Eye, Download, Move } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDate, formatFileSize } from '../../utils/helpers';
import { usePhotoStore } from '../../store/usePhotoStore';

interface PhotoCardProps {
  id: string;
  url: string;
  title: string;
  description: string | null;
  createdAt: string;
  isPublic: boolean;
  metadata: any;
  onView: () => void;
  onEdit: () => void;
  onMove: () => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  id,
  url,
  title,
  description,
  createdAt,
  isPublic,
  metadata,
  onView,
  onEdit,
  onMove,
}) => {
  const { deletePhoto, updatePhoto, downloadPhoto, isLoading } = usePhotoStore();
  const [showControls, setShowControls] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title,
    description: description || '',
    isPublic,
  });
  
  const handleEdit = async () => {
    try {
      await updatePhoto(id, {
        title: editForm.title,
        description: editForm.description,
        is_public: editForm.isPublic,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating photo:', error);
    }
  };
  
  const handleDownload = async () => {
    await downloadPhoto(url, title);
  };
  
  const handleDelete = async () => {
    try {
      await deletePhoto(id, url);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };
  
  return (
    <motion.div
      className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className="relative h-48 overflow-hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <img 
          src={url} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        
        {showControls && !isConfirmingDelete && !showDetails && !isEditing && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              icon={<Eye size={16} />}
              aria-label="View photo"
            />
            
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(true);
              }}
              icon={<Info size={16} />}
              aria-label="Photo details"
            />
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirmingDelete(true);
              }}
              icon={<Trash2 size={16} />}
              aria-label="Delete photo"
            />
          </motion.div>
        )}
        
        {showDetails && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-70 p-4 overflow-y-auto text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-4">
              <h4 className="font-semibold mb-1">Details</h4>
              <p className="text-sm">Uploaded: {formatDate(createdAt)}</p>
              {metadata?.size && (
                <p className="text-sm">Size: {formatFileSize(metadata.size)}</p>
              )}
              {metadata?.type && (
                <p className="text-sm">Type: {metadata.type}</p>
              )}
              <p className="text-sm">Visibility: {isPublic ? 'Public' : 'Private'}</p>
            </div>
            
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setShowDetails(false)}
            >
              Close
            </Button>
          </motion.div>
        )}
        
        {isConfirmingDelete && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-70 p-4 flex flex-col items-center justify-center text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="mb-4 text-center">
              Are you sure you want to delete this photo?
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsConfirmingDelete(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleDelete}
                isLoading={isLoading}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        )}

        {isEditing && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              label="Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Enter photo title"
            />
            <Input
              label="Description"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Add a description"
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id={`public-${id}`}
                checked={editForm.isPublic}
                onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor={`public-${id}`} className="text-white">Make public</label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleEdit}
                isLoading={isLoading}
              >
                Save
              </Button>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-gray-800 dark:text-white truncate">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {description}
          </p>
        )}
        
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {formatDate(createdAt)}
        </p>
      </div>
    </motion.div>
  );
};