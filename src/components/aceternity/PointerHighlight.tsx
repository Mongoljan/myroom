'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PointerHighlightProps {
  children: React.ReactNode;
  className?: string;
  highlightColor?: string;
}

export const PointerHighlight: React.FC<PointerHighlightProps> = ({
  children,
  className = "",
  highlightColor = "rgba(59, 130, 246, 0.1)"
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Highlight circle */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          background: `radial-gradient(circle 50px at center, ${highlightColor}, transparent)`,
          width: 100,
          height: 100,
          left: mousePosition.x - 50,
          top: mousePosition.y - 50,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PointerHighlight;