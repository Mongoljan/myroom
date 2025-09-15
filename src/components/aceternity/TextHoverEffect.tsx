'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextHoverEffectProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const TextHoverEffect: React.FC<TextHoverEffectProps> = ({
  children,
  className = "",
  duration = 0.3
}) => {
  return (
    <motion.div
      className={cn("inline-block", className)}
      whileHover={{
        background: "linear-gradient(90deg, #3b82f6, #1e40af, #3b82f6)",
        backgroundSize: "200% 100%",
        backgroundClip: "text",
        color: "transparent",
        // @ts-expect-error - WebkitBackgroundClip is not in TargetAndTransition type
        WebkitBackgroundClip: "text",
      }}
      transition={{
        duration,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default TextHoverEffect;