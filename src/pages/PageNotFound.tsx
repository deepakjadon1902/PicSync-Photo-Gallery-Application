import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="glass-card max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-8xl mb-6 mx-auto"
        >
          📷
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          404 - Page Not Found
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            icon={<ArrowLeft size={18} />}
          >
            Go Back
          </Button>
          
          <Link to="/">
            <Button
              variant="primary"
              icon={<Home size={18} />}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};