import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  className = '',
  fullWidth = false,
  icon,
  iconPosition = 'left',
}) => {
  const baseClasses = 'rounded-lg font-medium focus:outline-none transition-all relative';
  
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-gray-900 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    danger: 'bg-error-500 hover:bg-error-700 text-white focus:ring-2 focus:ring-error-500 focus:ring-offset-2',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  const loadingClasses = isLoading ? 'opacity-80 cursor-not-allowed' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${loadingClasses} 
    ${disabledClasses} 
    ${widthClasses} 
    ${className}
  `;

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </div>
      )}
    </motion.button>
  );
};