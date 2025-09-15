'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundGradientAnimationProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  size?: string;
  _blendingValue?: string;
}

export const BackgroundGradientAnimation: React.FC<BackgroundGradientAnimationProps> = ({
  children,
  className = "",
  containerClassName = "",
  colors = [
    "#3b82f620", // Blue 500 with transparency
    "#1e40af15", // Blue 800 with transparency
    "#2563eb20", // Blue 600 with transparency
    "#1d4ed815", // Blue 700 with transparency
    "#60a5fa10", // Blue 400 with transparency
  ],
  size = "60%",
  _blendingValue = "soft-light"
}) => {
  const interactiveRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={`absolute inset-0 overflow-hidden ${containerClassName}`}>
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Primary gradient orb */}
        <motion.div
          className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
            width: size,
            height: size,
          }}
          animate={{
            x: ["0%", "100%", "0%"],
            y: ["0%", "100%", "0%"],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Secondary gradient orb */}
        <motion.div
          className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30"
          style={{
            background: `linear-gradient(135deg, ${colors[2]}, ${colors[3]})`,
            width: size,
            height: size,
            top: "20%",
            left: "20%",
          }}
          animate={{
            x: ["0%", "-100%", "0%"],
            y: ["0%", "100%", "0%"],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Tertiary gradient orb */}
        <motion.div
          className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30"
          style={{
            background: `linear-gradient(135deg, ${colors[4]}, ${colors[0]})`,
            width: "60%",
            height: "60%",
            bottom: "20%",
            right: "20%",
          }}
          animate={{
            x: ["0%", "50%", "0%"],
            y: ["0%", "-50%", "0%"],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />

        {/* Interactive gradient that follows mouse */}
        <motion.div
          ref={interactiveRef}
          className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-40"
          style={{
            background: `radial-gradient(circle, ${colors[1]}, ${colors[2]})`,
            width: "40%",
            height: "40%",
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Subtle animated mesh overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, ${colors[0]}40 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, ${colors[2]}40 0%, transparent 50%),
              radial-gradient(circle at 75% 25%, ${colors[1]}40 0%, transparent 50%),
              radial-gradient(circle at 25% 75%, ${colors[3]}40 0%, transparent 50%)
            `,
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Content overlay */}
      <div className={`relative z-10 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default BackgroundGradientAnimation;