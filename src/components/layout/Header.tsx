import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Settings, Camera, Search } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuthStore } from '../../store/useAuthStore';

export const Header: React.FC = () => {
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
  
  return (
    <header className="glass sticky top-0 z-10 py-4 px-6 mb-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Camera size={32} className="text-primary-500 mr-2" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              PicSync
            </span>
          </motion.div>
        </Link>
        
        {user && (
          <div className="hidden md:flex items-center flex-1 mx-6">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search photos..."
                  className="pl-10 pr-4 py-2 w-full rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
          </div>
        )}
        
        <nav className="flex items-center space-x-1 sm:space-x-4">
          <ThemeToggle />
          
          {user ? (
            <div className="relative">
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 focus:outline-none"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium overflow-hidden">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile?.full_name || 'Profile'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.full_name.charAt(0) || user.email?.charAt(0) || 'U'
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
              </motion.button>
              
              {showProfileMenu && (
                <motion.div
                  className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg overflow-hidden z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </Link>
                    <button 
                      onClick={() => {
                        signOut();
                        setShowProfileMenu(false);
                        navigate('/login');
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <motion.button 
                  className="btn-ghost"
                  whileHover={{ scale: 1.05 }}
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button 
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};