'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Image from 'next/image';
import { HotelImages } from '@/types/api';

interface HotelImageGalleryProps {
  images: HotelImages;
  hotelName: string;
  viewMode: 'list' | 'grid';
  className?: string;
}

export default function HotelImageGallery({
  images,
  hotelName,
  viewMode,
  className = ""
}: HotelImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const nextImage = () => {
    if (images.gallery.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.gallery.length);
    }
  };

  const prevImage = () => {
    if (images.gallery.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.gallery.length - 1 : prev - 1
      );
    }
  };

  const getCurrentImageSrc = () => {
    if (images.gallery[currentImageIndex]?.url) {
      return images.gallery[currentImageIndex].url;
    }
    return typeof images.cover === 'string'
      ? images.cover
      : images.cover.url;
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const baseHeight = viewMode === 'list' ? 'h-64 md:h-56' : 'h-56';

  return (
    <div className={`relative ${baseHeight} overflow-hidden bg-slate-100 ${className}`} style={{ aspectRatio: '4/3' }}>
      {!imageError ? (
        <Image
          src={getCurrentImageSrc()}
          alt={hotelName}
          fill
          className="object-cover "
          unoptimized
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-slate-600 font-semibold text-2xl">
                {hotelName.charAt(0)}
              </span>
            </div>
            <span className="text-slate-500 text-sm font-medium">{hotelName}</span>
          </div>
        </div>
      )}

      {/* Image Navigation */}
      {images.gallery.length > 1 && !imageError && (
        <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); prevImage(); }}
            className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); nextImage(); }}
            className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      )}

      {/* Image Indicators */}
      {images.gallery.length > 1 && !imageError && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
          {images.gallery.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.preventDefault(); setCurrentImageIndex(index); }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors group/heart"
      >
        <Heart
          className={`w-4 h-4 transition-all ${
            isWishlisted
              ? 'text-red-500 fill-red-500'
              : 'text-slate-600 group-hover/heart:text-red-500'
          }`}
        />
      </button>

      {/* Image Count Badge */}
      {images.gallery.length > 1 && (
        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentImageIndex + 1} / {images.gallery.length}
        </div>
      )}

      {/* Grid View Effects */}
      {viewMode === 'grid' && (
        <>
          {/* Aceternity-style background glow */}
          <motion.div
            className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))",
                "linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))",
                "linear-gradient(45deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}