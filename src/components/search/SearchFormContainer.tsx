'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SearchFormContainerProps {
  children: ReactNode;
}

export default function SearchFormContainer({ children }: SearchFormContainerProps) {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 overflow-hidden"
      style={{ 
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
      }}
    >
      {children}
    </div>
  );
}