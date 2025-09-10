'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SparklesProps {
  children?: React.ReactNode;
  className?: string;
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  sparkleIntensity?: 'low' | 'medium' | 'high';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  duration: number;
  delay: number;
}

export const Sparkles: React.FC<SparklesProps> = ({
  children,
  className = "",
  particleCount = 15,
  particleColor = "#3b82f6",
  particleSize = 4,
  sparkleIntensity = 'medium'
}) => {
  // Generate deterministic particles based on props
  const particles: Particle[] = React.useMemo(() => {
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: seededRandom(i * 123.456) * 100,
      y: seededRandom(i * 789.012) * 100,
      scale: 0.5 + seededRandom(i * 345.678) * 0.5,
      duration: sparkleIntensity === 'high' ? 1 + seededRandom(i * 567.890) * 1.5 
               : sparkleIntensity === 'medium' ? 1.5 + seededRandom(i * 567.890) * 2
               : 2 + seededRandom(i * 567.890) * 3,
      delay: seededRandom(i * 901.234) * 3,
    }));
  }, [particleCount, sparkleIntensity]);

  const sparkleVariants = {
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
    }
  };

  const StarIcon = ({ size }: { size: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="absolute"
    >
      <path d="M12 2l2.09 6.26L22 10.27l-5.45 4.73L18.18 22 12 18.77 5.82 22l1.63-7-5.45-4.73L9.91 8.26 12 2z" />
    </svg>
  );

  const DiamondIcon = ({ size }: { size: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="absolute"
    >
      <path d="M12 2l4 8-4 12-4-12z" />
    </svg>
  );

  const CircleIcon = ({ size }: { size: number }) => (
    <div 
      className="absolute rounded-full"
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: 'currentColor' 
      }}
    />
  );

  const getRandomIcon = (index: number, size: number) => {
    const iconTypes = [StarIcon, DiamondIcon, CircleIcon];
    const IconComponent = iconTypes[index % iconTypes.length];
    return <IconComponent size={size} />;
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Sparkle particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              color: particleColor,
            }}
            variants={sparkleVariants}
            animate="animate"
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
            initial={{ opacity: 0, scale: 0 }}
          >
            {getRandomIcon(particle.id, particleSize * particle.scale)}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Sparkles;