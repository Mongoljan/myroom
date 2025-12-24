'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// LoaderOne - Simple minimal loader
export function LoaderOne() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="w-8 h-8 border-2 border-gray-300 border-t-slate-900 rounded-full"
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

// LoaderTwo - Compact loader
export function LoaderTwo() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="w-6 h-6 border-2 border-gray-200 border-t-slate-800 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

// LoaderThree - SVG based loader
export function LoaderThree() {
  return (
    <div className="flex items-center justify-center">
      <svg
        className="w-8 h-8 text-slate-900"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
          fill="currentColor"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );
}

// LoaderFive - Shimmer loader with custom text
interface LoaderFiveProps {
  text?: string;
  className?: string;
}

export function LoaderFive({ text = "Loading...", className }: LoaderFiveProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.div
        className="w-4 h-4 bg-gradient-to-r from-slate-500 to-purple-500 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.span
        className="text-sm text-gray-600"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {text}
      </motion.span>
    </div>
  );
}

// Search specific loader for hotel searches
export function SearchLoader({ text = "Searching hotels..." }: LoaderFiveProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-16 h-16 border-4 border-slate-100 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Inner spinning element */}
        <motion.div
          className="absolute inset-2 border-4 border-slate-900 border-t-transparent rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Hotel icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v1h16V5a2 2 0 00-2-2H4zM2 8v6a2 2 0 002 2h12a2 2 0 002-2V8H2zm8 3a1 1 0 011 1v1h-2v-1a1 1 0 011-1z"/>
          </svg>
        </div>
      </div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.p
          className="text-lg font-medium text-gray-800"
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
        <motion.div className="flex items-center justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-slate-900 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}