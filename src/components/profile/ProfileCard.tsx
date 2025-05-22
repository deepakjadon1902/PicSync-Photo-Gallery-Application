import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Phone, Mail, Heart, Edit, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDate } from '../../utils/helpers';

export const ProfileCard: React.FC = () => {
  const { profile, updateProfile, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    phoneNumber: profile?.phone_number || '',
    hobbies: profile?.hobbies?.join(', ') || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    try {
      await updateProfile({
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        hobbies: formData.hobbies.split(',').map(hobby => hobby.trim()),
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  if (!profile) {
    return (
      <div className="glass-card animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      className="glass-card"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Edit Profile
            </h2>
          </div>
          
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            icon={<User size={18} />}
            emoji="🧑"
          />
          
          <Input
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            icon={<Phone size={18} />}
            emoji="📱"
          />
          
          <Input
            label="Hobbies (comma separated)"
            name="hobbies"
            value={formData.hobbies}
            onChange={handleChange}
            icon={<Heart size={18} />}
            emoji="🎯"
          />
          
          <div className="mt-6 flex space-x-4">
            <Button 
              type="button" 
              variant="ghost"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isLoading}
              icon={<Save size={18} />}
              fullWidth
            >
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex justify-between items-start mb-6">
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile.full_name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.email}
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button 
                onClick={() => setIsEditing(true)}
                variant="ghost"
                size="sm"
                icon={<Edit size={16} />}
              >
                Edit
              </Button>
            </motion.div>
          </div>
          
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
          >
            <motion.div 
              className="flex items-center"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-500 mr-4">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Birthday</p>
                <p className="font-medium">
                  {formatDate(profile.date_of_birth, 'MMMM d, yyyy')}
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-900 text-secondary-500 mr-4">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium">{profile.phone_number}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center"
              variants={itemVariants}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-100 dark:bg-accent-900 text-accent-500 mr-4">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </motion.div>
            
            {profile.hobbies && profile.hobbies.length > 0 && (
              <motion.div 
                className="flex items-center"
                variants={itemVariants}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-error-100 dark:bg-error-900 text-error-500 mr-4">
                  <Heart size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hobbies</p>
                  <p className="font-medium">{profile.hobbies.join(', ')}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};