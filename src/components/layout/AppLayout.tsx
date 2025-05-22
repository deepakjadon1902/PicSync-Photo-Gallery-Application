import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { useAuthStore } from '../../store/useAuthStore';
import { initializeTheme } from '../../store/useThemeStore';

export const AppLayout: React.FC = () => {
  const { user, isLoading, initialized, initialize } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    initializeTheme();
    initialize();
  }, [initialize]);
  
  if (!initialized) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="p-8 glass-card max-w-md mx-auto">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-primary-500 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/reset-password'];
  
  // If not logged in and not on a public route, redirect to login
  if (!isLoading && !user && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }
  
  // If logged in and on a public route, redirect to dashboard
  if (!isLoading && user && publicRoutes.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <Header />
      <main className="container mx-auto flex-1 px-4 md:px-6 pb-10">
        <Outlet />
      </main>
      <footer className="glass py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} PicSync. All rights reserved.</p>
      </footer>
    </div>
  );
};