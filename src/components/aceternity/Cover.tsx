'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CoverProps {
  children: React.ReactNode;
  className?: string;
  coverImage?: string;
  coverContent?: React.ReactNode;
}

export const Cover: React.FC<CoverProps> = ({
  children,
  className = "",
  coverImage,
  coverContent
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Original content */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isHovered ? 0.3 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>

      {/* Cover overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: coverImage 
            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${coverImage})`
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(30, 64, 175, 0.9))',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {coverContent && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1 : 0.8, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-white text-center p-4"
          >
            {coverContent}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Cover;