import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Phone, Mail, Heart, Lock, Check } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';

interface RegisterFormData {
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  hobbies: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC = () => {
  const { signUp, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    hobbies: '',
    password: '',
    confirmPassword: '',
  });
  
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      }
    }
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 2 && validateStep2()) {
      try {
        await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth,
          phone_number: formData.phoneNumber,
          email: formData.email,
          hobbies: formData.hobbies.split(',').map(hobby => hobby.trim()),
        });
      } catch (error) {
        console.error('Error in registration:', error);
      }
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
      <div className="text-center mb-6">
        <motion.h2 
          className="text-2xl font-bold text-gray-800 dark:text-white"
          variants={itemVariants}
        >
          Create Your PicSync Account
        </motion.h2>
        <motion.p 
          className="text-gray-600 dark:text-gray-300 mt-2"
          variants={itemVariants}
        >
          Step {step} of 2: {step === 1 ? 'Personal Information' : 'Account Setup'}
        </motion.p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              error={errors.fullName}
              icon={<User size={18} />}
              emoji="🧑"
            />
            
            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              error={errors.dateOfBirth}
              icon={<Calendar size={18} />}
              emoji="🎂"
            />
            
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              required
              error={errors.phoneNumber}
              icon={<Phone size={18} />}
              emoji="📱"
            />
            
            <Input
              label="Hobbies (comma separated)"
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              placeholder="Photography, Travel, Cooking"
              icon={<Heart size={18} />}
              emoji="🎯"
            />
            
            <div className="mt-6">
              <Button 
                type="button" 
                onClick={handleNextStep}
                fullWidth
              >
                Continue
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              error={errors.email}
              icon={<Mail size={18} />}
              emoji="📧"
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a secure password"
              required
              error={errors.password}
              icon={<Lock size={18} />}
              emoji="🔐"
            />
            
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              error={errors.confirmPassword}
              icon={<Check size={18} />}
              emoji="✅"
            />
            
            {/* Preview section */}
            {formData.fullName && (
              <motion.div 
                className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                variants={itemVariants}
              >
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Preview:
                </h3>
                <div className="text-sm">
                  <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                  {formData.dateOfBirth && (
                    <p><span className="font-medium">Birthday:</span> {new Date(formData.dateOfBirth).toLocaleDateString()}</p>
                  )}
                  {formData.hobbies && (
                    <p><span className="font-medium">Hobbies:</span> {formData.hobbies}</p>
                  )}
                </div>
              </motion.div>
            )}
            
            <div className="mt-6 flex space-x-4">
              <Button 
                type="button" 
                onClick={handlePrevStep}
                variant="ghost"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                isLoading={isLoading}
                fullWidth
              >
                Create Account
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};