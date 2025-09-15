'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatefulButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export const StatefulButton: React.FC<StatefulButtonProps> = ({
  children,
  className = "",
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md'
}) => {
  const [state, setState] = React.useState<ButtonState>('idle');

  const handleClick = async () => {
    if (disabled || state === 'loading') return;
    
    setState('loading');
    
    try {
      if (onClick) {
        await onClick();
        setState('success');
        setTimeout(() => setState('idle'), 2000);
      }
    } catch (_error) {
      setState('error');
      setTimeout(() => setState('idle'), 2000);
    }
  };

  const baseClasses = cn(
    "relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-out overflow-hidden",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
      // Variant styles
      'bg-blue-600 hover:bg-blue-700 text-white shadow-lg focus:ring-blue-500': variant === 'primary',
      'bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 focus:ring-blue-500': variant === 'secondary',
      
      // Size styles
      'px-3 py-1.5 text-sm rounded-md': size === 'sm',
      'px-6 py-2.5 text-base rounded-lg': size === 'md',
      'px-8 py-3 text-lg rounded-xl': size === 'lg',
      
      // State styles
      'opacity-80 cursor-not-allowed': disabled || state === 'loading',
      'bg-green-600 hover:bg-green-600': state === 'success' && variant === 'primary',
      'bg-red-600 hover:bg-red-600': state === 'error' && variant === 'primary',
    },
    className
  );

  const LoadingSpinner = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
    />
  );

  const SuccessIcon = () => (
    <motion.svg
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
    </motion.svg>
  );

  const ErrorIcon = () => (
    <motion.svg
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );

  return (
    <motion.button
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      whileHover={{ scale: state === 'idle' ? 1.02 : 1 }}
      whileTap={{ scale: state === 'idle' ? 0.98 : 1 }}
    >
      <AnimatePresence mode="wait">
        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <LoadingSpinner />
            <span>Loading...</span>
          </motion.div>
        )}
        
        {state === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <SuccessIcon />
            <span>Success!</span>
          </motion.div>
        )}
        
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <ErrorIcon />
            <span>Error</span>
          </motion.div>
        )}
        
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Ripple effect */}
      {state === 'idle' && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          whileHover={{
            background: variant === 'primary' 
              ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(30, 64, 175, 0.1))'
              : 'linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(30, 64, 175, 0.05))'
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default StatefulButton;