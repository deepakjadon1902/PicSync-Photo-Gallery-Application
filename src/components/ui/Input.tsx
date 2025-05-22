import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  icon?: React.ReactNode;
  min?: string | number;
  max?: string | number;
  emoji?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  name,
  id,
  placeholder = '',
  required = false,
  disabled = false,
  className = '',
  error,
  icon,
  min,
  max,
  emoji,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || Math.random().toString(36).substring(2, 9);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {emoji && <span className="mr-2">{emoji}</span>}
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={`
            w-full px-4 py-2 
            ${icon ? 'pl-10' : ''} 
            ${type === 'password' ? 'pr-10' : ''}
            bg-white/70 dark:bg-gray-800/70 
            backdrop-blur-md 
            rounded-lg 
            border border-gray-200 dark:border-gray-700 
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
            transition-all duration-200
            ${error ? 'border-error-500 focus:ring-error-500' : ''}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${className}
          `}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
};