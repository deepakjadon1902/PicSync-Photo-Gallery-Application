import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleMode } = useThemeStore();
  
  return (
    <motion.button
      onClick={toggleMode}
      className="relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
      whileTap={{ scale: 0.95 }}
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300">
        <motion.div 
          className="absolute top-1 left-1 w-4 h-4 rounded-full flex items-center justify-center"
          animate={{ 
            x: mode === 'dark' ? 24 : 0,
            backgroundColor: mode === 'dark' ? '#1e1e1e' : '#ffbf00'
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <motion.div
            initial={false}
            animate={{ 
              opacity: mode === 'dark' ? 1 : 0, 
              scale: mode === 'dark' ? 1 : 0.5 
            }}
          >
            <Moon size={12} className="text-gray-100" />
          </motion.div>
          <motion.div
            initial={false}
            animate={{ 
              opacity: mode === 'light' ? 1 : 0,
              scale: mode === 'light' ? 1 : 0.5
            }}
          >
            <Sun size={12} className="text-amber-500" />
          </motion.div>
        </motion.div>
      </div>
    </motion.button>
  );
};