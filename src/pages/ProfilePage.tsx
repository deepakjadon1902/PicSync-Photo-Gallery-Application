import React from 'react';
import { motion } from 'framer-motion';
import { ProfileCard } from '../components/profile/ProfileCard';
import { useAuthStore } from '../store/useAuthStore';

export const ProfilePage: React.FC = () => {
  const { profile } = useAuthStore();

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-6">My Profile</h1>
      </motion.div>
      
      <ProfileCard />
    </div>
  );
};