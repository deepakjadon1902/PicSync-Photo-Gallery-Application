import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAlbumStore } from '../../store/useAlbumStore';
import { emojiCategories, getRandomEmoji } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

interface AlbumCardProps {
  id: string;
  name: string;
  emoji: string;
  photoCount?: number;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  id,
  name,
  emoji,
  photoCount = 0,
}) => {
  const { updateAlbum, deleteAlbum, isLoading } = useAlbumStore();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [albumName, setAlbumName] = useState(name);
  const [albumEmoji, setAlbumEmoji] = useState(emoji);
  
  const handleSave = async () => {
    if (albumName.trim() === '') return;
    
    try {
      await updateAlbum(id, { 
        name: albumName,
        emoji: albumEmoji || getRandomEmoji(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteAlbum(id);
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setAlbumEmoji(emoji);
    setShowEmojiPicker(false);
  };
  
  const handleCardClick = () => {
    if (!isEditing && !isConfirmingDelete) {
      navigate(`/albums/${id}`);
    }
  };
  
  return (
    <motion.div
      className="glass-card cursor-pointer h-full"
      whileHover={{ scale: isEditing || isConfirmingDelete ? 1 : 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
    >
      {isEditing ? (
        <div onClick={(e) => e.stopPropagation()}>
          <div className="mb-4">
            <div className="relative">
              <button
                type="button"
                className="text-4xl mb-2 block hover:animate-pulse"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {albumEmoji}
              </button>
              
              {showEmojiPicker && (
                <div className="absolute top-12 left-0 right-0 z-10 glass-card max-h-48 overflow-y-auto">
                  <div className="p-2">
                    {emojiCategories.map((category) => (
                      <div key={category.name} className="mb-2">
                        <p className="text-xs text-gray-500 mb-1">{category.name}</p>
                        <div className="flex flex-wrap gap-1">
                          {category.emojis.map((emoji) => (
                            <button
                              key={emoji}
                              className="text-xl p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                              onClick={() => handleEmojiSelect(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Input
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Album name"
            />
          </div>
          
          <div className="flex justify-between gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsEditing(false)}
              icon={<X size={16} />}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave} 
              isLoading={isLoading}
              icon={<Save size={16} />}
            >
              Save
            </Button>
          </div>
        </div>
      ) : isConfirmingDelete ? (
        <div onClick={(e) => e.stopPropagation()}>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete this album?
          </p>
          
          <div className="flex justify-between gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
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
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <span className="text-4xl mb-2 animate-float">{emoji}</span>
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setIsEditing(true); 
                }}
                aria-label="Edit album"
              >
                <Pencil size={16} />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setIsConfirmingDelete(true); 
                }}
                aria-label="Delete album"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
            {name}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
          </p>
        </>
      )}
    </motion.div>
  );
};