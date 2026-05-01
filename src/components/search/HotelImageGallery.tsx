'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { HotelImages } from '@/types/api';
import { useHydratedTranslation } from '@/hooks/useHydratedTranslation';
import { WishlistHeartOverlay } from '@/components/wishlist/WishlistHeart';
import { useAuthenticatedUser } from '@/hooks/useCustomer';

interface HotelImageGalleryProps {
  images: HotelImages;
  hotelName: string;
  hotelId?: number;
  viewMode: 'list' | 'grid';
  className?: string;
  profileImageUrl?: string;
}

export default function HotelImageGallery({
  images,
  hotelName,
  hotelId,
  viewMode,
  className = "",
  profileImageUrl,
}: HotelImageGalleryProps) {
  const { t } = useHydratedTranslation();
  const { isAuthenticated } = useAuthenticatedUser();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Per-image error tracking — one broken URL won't kill the whole gallery
  const [errorSet, setErrorSet] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const markError = (i: number) =>
    setErrorSet((prev) => new Set(prev).add(i));

  const normalizedImages = useMemo(() => {
    const coverImage = images?.cover
      ? (typeof images.cover === 'string'
        ? { url: images.cover, description: hotelName }
        : images.cover)
      : null;

    const galleryImages = (images?.gallery || [])
      .filter(img => img && typeof img.url === 'string' && img.url.trim().length > 0);

    // If we have a profile image from the property-images API, put it first
    // and deduplicate against existing images
    if (profileImageUrl) {
      const profileImg = { url: profileImageUrl, description: hotelName };
      const rest = [
        ...(galleryImages.length > 0 ? galleryImages : (coverImage ? [coverImage] : [])),
      ].filter(img => img.url !== profileImageUrl);
      return [profileImg, ...rest];
    }

    if (galleryImages.length > 0) {
      return galleryImages;
    }

    return coverImage ? [coverImage] : [];
  }, [images, hotelName, profileImageUrl]);

  // Valid images after filtering per-image errors
  const validImages = normalizedImages.filter((_, i) => !errorSet.has(i));

  const openModalAt = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };


  const safeIndex = Math.min(currentImageIndex, Math.max(0, validImages.length - 1));
  const hasMultipleImages = validImages.length > 1;
  const hasImages = validImages.length > 0;

  // ── Shared sub-components ────────────────────────────────────────────────

  const WishlistBtn = isAuthenticated && hotelId ? (
    <WishlistHeartOverlay hotelId={hotelId} />
  ) : null;

  const ViewPhotosBtn = (
    <button
      onClick={(e) => openModalAt(safeIndex, e)}
      className="absolute bottom-2.5 right-2.5 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 text-slate-900 dark:text-white text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5"
    >
      <span>{t('hotel.viewPhotos', 'Зургуудыг харах')}</span>
      <span className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
        {normalizedImages.length}
      </span>
    </button>
  );

  const Placeholder = (
    <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 bg-slate-300 dark:bg-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <span className="text-slate-600 dark:text-slate-300 font-semibold text-2xl">
            {hotelName.charAt(0)}
          </span>
        </div>
        <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{hotelName}</span>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════
  // LIST VIEW — single image + carousel arrows
  // The parent (BookingStyleHotelCard) constrains the box size (w-60 h-[240px]),
  // so we must NOT add our own height or aspectRatio here.
  // ════════════════════════════════════════════════════════════════════════
  if (viewMode === 'list') {
    return (
      <>
        <div
          className={`relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-800 group ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {hasImages ? (
            <button
              className="relative w-full h-full block"
              onClick={(e) => openModalAt(safeIndex, e)}
            >
              <Image
                src={validImages[safeIndex].url}
                alt={validImages[safeIndex].description || hotelName}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="240px"
                unoptimized
                onError={() => markError(safeIndex)}
              />
            </button>
          ) : Placeholder}

          {hasImages && (
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
          )}

          {/* Counter badge — right side to avoid clashing with discount badge on left */}
          {hasMultipleImages && (
            <div className="absolute top-2.5 right-2.5 z-10 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {safeIndex + 1} / {validImages.length}
            </div>
          )}

          {WishlistBtn}
          {hasImages && ViewPhotosBtn}

          {/* Prev / Next — reveal on hover */}
          {hasMultipleImages && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <button
                onClick={prevImage}
                className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-1.5 shadow-md transition-colors pointer-events-auto"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                onClick={nextImage}
                className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-1.5 shadow-md transition-colors pointer-events-auto"
              >
                <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
          )}
        </div>

        <GalleryModal
          images={normalizedImages}
          hotelName={hotelName}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialIndex={modalImageIndex}
        />
      </>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // GRID VIEW — 2×2 thumbnail grid when ≥4 images, else single image
  // ════════════════════════════════════════════════════════════════════════
  const showGrid = validImages.length >= 4;

  return (
    <>
      <div
        className={`relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-800 group ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!hasImages ? Placeholder : showGrid ? (
          <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full">
            {validImages.slice(0, 4).map((img, i) => (
              <button
                key={img.url + i}
                className="relative w-full h-full overflow-hidden"
                onClick={(e) => openModalAt(i, e)}
              >
                <Image
                  src={img.url}
                  alt={img.description || hotelName}
                  fill
                  sizes="140px"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  unoptimized
                  onError={() => markError(i)}
                />
              </button>
            ))}
          </div>
        ) : (
          <button
            className="relative w-full h-full block"
            onClick={(e) => openModalAt(safeIndex, e)}
          >
            <Image
              src={validImages[safeIndex].url}
              alt={validImages[safeIndex].description || hotelName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 300px"
              unoptimized
              onError={() => markError(safeIndex)}
            />
          </button>
        )}

        {hasImages && (
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
        )}

        {WishlistBtn}
        {hasImages && ViewPhotosBtn}

        {/* Prev/Next only relevant for single carousel in grid mode */}
        {!showGrid && hasMultipleImages && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <button
              onClick={prevImage}
              className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-1.5 shadow-md transition-colors pointer-events-auto"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
            <button
              onClick={nextImage}
              className="bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 rounded-full p-1.5 shadow-md transition-colors pointer-events-auto"
            >
              <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        )}
      </div>

      <GalleryModal
        images={normalizedImages}
        hotelName={hotelName}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialIndex={modalImageIndex}
      />
    </>
  );
}

// ── Full-screen lightbox ───────────────────────────────────────────────────
interface GalleryModalProps {
  images: { url: string; description?: string }[];
  hotelName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex: number;
}

function GalleryModal({ images, hotelName, open, onOpenChange, initialIndex }: GalleryModalProps) {
  const [idx, setIdx] = useState(initialIndex);
  const hasMultiple = images.length > 1;

  const prev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIdx((p) => (p === 0 ? images.length - 1 : p - 1));
  };
  const next = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIdx((p) => (p + 1) % images.length);
  };

  const handleOpenChange = (v: boolean) => {
    if (v) setIdx(initialIndex);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-6xl w-[95vw] p-0 border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DialogTitle className="sr-only">{hotelName} photos</DialogTitle>
        <div className="flex flex-col h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-gray-900/95">
            <div className="text-sm font-semibold truncate text-slate-900 dark:text-white">{hotelName}</div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>{idx + 1} / {images.length}</span>
              <DialogClose asChild>
                <button className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors" aria-label="Close">
                  <X className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </button>
              </DialogClose>
            </div>
          </div>

          {/* Main image */}
          <div className="relative flex-1 bg-white dark:bg-gray-900">
            {images[idx]?.url && (
              <Image
                src={images[idx].url}
                alt={images[idx].description || hotelName}
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized
              />
            )}
            {hasMultiple && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-full p-3 shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-full p-3 shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {hasMultiple && (
            <div className="p-3 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {images.map((img, i) => (
                  <button
                    key={img.url + i}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIdx(i);
                    }}
                    className={`relative w-16 h-12 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                      i === idx
                        ? 'border-slate-900 dark:border-slate-100 opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.description || hotelName}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
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
