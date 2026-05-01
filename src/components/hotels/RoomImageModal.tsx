'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import SafeImage from '@/components/common/SafeImage';

interface RoomImage {
  image: string;
  alt?: string;
}

interface RoomImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: RoomImage[];
  initialIndex?: number;
  roomName: string;
}

export default function RoomImageModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  roomName
}: RoomImageModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);

  // Reset to initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] p-0 border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-2xl rounded-2xl overflow-hidden">
        <DialogTitle className="sr-only">{roomName} photos</DialogTitle>
        <div className="flex flex-col h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-gray-900/95">
            <div className="text-sm font-semibold truncate text-slate-900 dark:text-white">{roomName}</div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span>{currentImageIndex + 1} / {images.length}</span>
              <DialogClose asChild>
                <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors" aria-label="Close">
                  <X className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </button>
              </DialogClose>
            </div>
          </div>

          {/* Main Image Container */}
          <div className="relative flex-1 bg-white dark:bg-gray-900">
            {images[currentImageIndex]?.image && (
              <SafeImage
                src={images[currentImageIndex].image}
                alt={images[currentImageIndex]?.alt || `${roomName} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            )}

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-full p-3 shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-full p-3 shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Click areas for navigation */}
            {images.length > 1 && (
              <>
                <div 
                  className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
                  onClick={prevImage}
                  aria-label="Click to go to previous image"
                />
                <div 
                  className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
                  onClick={nextImage}
                  aria-label="Click to go to next image"
                />
              </>
            )}
          </div>

          {/* Thumbnail Strip (for multiple images) */}
          {images.length > 1 && (
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="flex gap-2 min-w-full">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-slate-900 dark:border-white shadow-lg'
                        : 'border-slate-300 dark:border-slate-600 hover:border-slate-500 dark:hover:border-slate-400'
                    }`}
                  >
                    <SafeImage
                      src={image.image}
                      alt={`${roomName} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}