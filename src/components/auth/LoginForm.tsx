import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginForm: React.FC = () => {
  const { signIn, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await signIn(email, password, rememberMe);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
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
      className="w-full max-w-md mx-auto glass-card"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center mb-6" variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome Back! 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Sign in to access your photo memories
        </p>
      </motion.div>
      
      <form onSubmit={handleSubmit}>
        <motion.div variants={itemVariants}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            icon={<Mail size={18} />}
            emoji="📧"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            icon={<Lock size={18} />}
            emoji="🔐"
          />
        </motion.div>
        
        <motion.div 
          className="flex items-center justify-between mt-4 mb-6"
          variants={itemVariants}
        >
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
          
          <Link to="/reset-password" className="text-sm text-primary-500 hover:text-primary-600 transition-colors">
            Forgot password?
          </Link>
        </motion.div>
        
        {error && (
          <motion.div 
            className="bg-error-100 text-error-700 p-3 rounded-lg mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <Button type="submit" fullWidth isLoading={isLoading}>
            Sign In
          </Button>
        </motion.div>
        
        <motion.div 
          className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
          variants={itemVariants}
        >
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:text-primary-600 transition-colors">
            Sign up
          </Link>
        </motion.div>
      </form>
    </motion.div>
  );
};