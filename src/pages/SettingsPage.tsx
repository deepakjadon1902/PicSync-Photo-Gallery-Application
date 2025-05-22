import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useThemeStore } from '../store/useThemeStore';

export const SettingsPage: React.FC = () => {
  const { mode, setMode } = useThemeStore();
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
      </motion.div>
      
      <div className="space-y-6">
        {/* Appearance settings */}
        <div className="glass-card">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Theme Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose between light and dark mode
                </p>
              </div>
              
              <ThemeToggle />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                onClick={() => setMode('light')}
                className={`p-4 rounded-lg text-center transition-all ${
                  mode === 'light' 
                    ? 'ring-2 ring-primary-500 bg-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                }`}
              >
                <Sun size={24} className="mx-auto mb-2 text-amber-500" />
                <span className="font-medium">Light</span>
              </button>
              
              <button
                onClick={() => setMode('dark')}
                className={`p-4 rounded-lg text-center transition-all ${
                  mode === 'dark' 
                    ? 'ring-2 ring-primary-500 bg-gray-900 shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                }`}
              >
                <Moon size={24} className="mx-auto mb-2 text-indigo-400" />
                <span className="font-medium">Dark</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Privacy settings */}
        <div className="glass-card">
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Default Photo Privacy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set the default privacy for newly uploaded photos
                </p>
              </div>
              
              <select
                className="px-3 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Account settings */}
        <div className="glass-card">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          
          <div className="space-y-4">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="font-medium text-error-700 dark:text-error-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                These actions are permanent and cannot be undone
              </p>
              
              <div className="space-y-2">
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={() => {
                    if (confirm('Are you sure you want to delete all your photos? This action cannot be undone.')) {
                      alert('Feature not implemented yet');
                    }
                  }}
                >
                  Delete All Photos
                </Button>
                
                <div className="h-2"></div>
                
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 size={16} />}
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      alert('Feature not implemented yet');
                    }
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};