'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// Magic UI inspired spinner
interface MagicSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MagicSpinner({ className, size = 'md' }: MagicSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className={cn("border-2 border-muted border-t-primary rounded-full", sizeClasses[size])}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

// Magic UI loading text component
interface LoadingTextProps {
  text?: string;
  className?: string;
}

export function LoadingText({ text = "Loading...", className }: LoadingTextProps) {
  return (
    <div className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <svg className="lucide lucide-loader-circle mr-2 size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
      </svg>
      {text}
    </div>
  );
}

// Spinning progress wheel
export function SpinningProgress() {
  return (
    <div className="flex items-center justify-center">
      <motion.div className="relative w-12 h-12">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

        {/* Progress circle */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
}

// Hotel search specific loading animation
export function HotelSearchSpinner() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-6">
        {/* Outer rotating ring */}
        <motion.div
          className="w-20 h-20 border-4 border-blue-100 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner counter-rotating ring */}
        <motion.div
          className="absolute inset-2 border-4 border-blue-500 border-t-transparent border-r-transparent rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Hotel building icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
              <path d="M9 12h2v2H9zM13 12h2v2h-2zM9 15h2v2H9zM13 15h2v2h-2z"/>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Loading text with dots animation */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('common.findingHotels')}</h3>
        <div className="flex items-center justify-center gap-1">
          <span className="text-gray-600">{t('common.searching')}</span>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="text-gray-600"
              animate={{
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            >
              .
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Button loading state
interface ButtonLoadingProps {
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ButtonLoading({ isLoading = false, children, className }: ButtonLoadingProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <MagicSpinner size="sm" />
      {children}
    </div>
  );
}