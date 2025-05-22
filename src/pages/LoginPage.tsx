import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center">
            <Camera size={48} className="text-primary-500" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            PicSync
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your personal cloud-based photo gallery
          </p>
        </motion.div>
        
        <LoginForm />
      </div>
    </div>
  );
};