'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { HotelImages } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';

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
  const { t } = useHydratedTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const normalizedImages = useMemo(() => {
    const coverImage = images?.cover
      ? (typeof images.cover === 'string'
        ? { url: images.cover, description: hotelName }
        : images.cover)
      : null;

    const galleryImages = (images?.gallery || [])
      .filter(img => img && typeof img.url === 'string' && img.url.trim().length > 0);

    if (galleryImages.length > 0) {
      return galleryImages;
    }

    return coverImage ? [coverImage] : [];
  }, [images, hotelName]);

  const openModalAt = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    if (normalizedImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % normalizedImages.length);
    }
  };

  const prevImage = () => {
    if (normalizedImages.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? normalizedImages.length - 1 : prev - 1
      );
    }
  };

  const getCurrentImageSrc = () => {
    if (normalizedImages[currentImageIndex]?.url) {
      return normalizedImages[currentImageIndex].url;
    }
    return '';
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const baseHeight = viewMode === 'list' ? 'h-64 md:h-56' : 'h-56';
  const hasMultipleImages = normalizedImages.length > 1;
  const hasImages = normalizedImages.length > 0;
  const previewImages = normalizedImages.slice(0, 4);

  return (
    <>
      <div
        className={`relative ${baseHeight} overflow-hidden bg-slate-100 ${className}`}
        style={{ aspectRatio: '4/3' }}
        onClick={(e) => e.stopPropagation()}
      >
        {!imageError && previewImages.length > 1 ? (
          <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
            {previewImages.map((img, index) => (
              <button
                key={img.url}
                className="relative w-full h-full overflow-hidden"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImageIndex(index); openModalAt(index); }}
              >
                <Image
                  src={img.url}
                  alt={img.description || hotelName}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  unoptimized
                  onError={() => setImageError(true)}
                />
              </button>
            ))}
          </div>
        ) : (!imageError && hasImages) ? (
          <button
            className="relative w-full h-full"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModalAt(currentImageIndex); }}
          >
            <Image
              src={getCurrentImageSrc()}
              alt={hotelName}
              fill
              className="object-cover"
              unoptimized
              onError={() => setImageError(true)}
            />
          </button>
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

        {/* Dark overlay CTA */}
        {!imageError && normalizedImages.length > 0 && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-colors group/heart"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isWishlisted
                ? 'text-red-500 fill-red-500'
                : 'text-slate-600 group-hover/heart:text-red-500'
            }`}
          />
        </button>

        {/* View photos CTA */}
        {normalizedImages.length > 0 && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); openModalAt(currentImageIndex); }}
            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-slate-900 dark:text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2"
          >
            <span>{t('hotel.viewPhotos', 'View photos')}</span>
            <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full">
              {normalizedImages.length}
            </span>
          </button>
        )}

        {/* Image Count Badge */}
        {hasMultipleImages && (
          <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {normalizedImages.length}
          </div>
        )}

        {/* Image Navigation */}
        {hasMultipleImages && !imageError && (
          <div className="absolute inset-0 flex items-center justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
              className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
              className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        )}

        {/* Grid View Effects */}
        {viewMode === 'grid' && (
          <>
            <motion.div
              className="absolute -inset-0.5 bg-gradient-to-r from-slate-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
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

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-slate-400/30 rounded-full"
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

      {/* Lightbox / modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl w-[95vw] p-0 border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-2xl rounded-2xl overflow-hidden">
          <DialogTitle className="sr-only">{hotelName} photos</DialogTitle>
          <div className="flex flex-col h-[85vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-gray-900/95">
              <div className="text-sm font-semibold truncate text-slate-900 dark:text-white">{hotelName}</div>
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span>{modalImageIndex + 1} / {normalizedImages.length}</span>
                <DialogClose asChild>
                  <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors" aria-label="Close">
                    <X className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  </button>
                </DialogClose>
              </div>
            </div>

            <div className="relative flex-1 bg-white dark:bg-gray-900">
              {normalizedImages[modalImageIndex]?.url && (
                <Image
                  src={normalizedImages[modalImageIndex].url}
                  alt={normalizedImages[modalImageIndex].description || hotelName}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  unoptimized
                />
              )}

              {hasMultipleImages && (
                <>
                  <button
                    onClick={() => setModalImageIndex(modalImageIndex === 0 ? normalizedImages.length - 1 : modalImageIndex - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-full p-3 shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setModalImageIndex((modalImageIndex + 1) % normalizedImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-full p-3 shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-700 overflow-x-auto">
                <div className="flex gap-2 min-w-full">
                  {normalizedImages.map((img, index) => (
                    <button
                      key={img.url + index}
                      onClick={() => setModalImageIndex(index)}
                      className={`relative w-20 h-14 rounded-md overflow-hidden border ${
                        index === modalImageIndex ? 'border-slate-900' : 'border-slate-200'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.description || hotelName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}