'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
}

export default function HotelGallery({ images, hotelName }: HotelGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-96">
        {/* Main Image */}
        <div 
          className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          <Image
            src={images[0]}
            alt={`${hotelName} - Main view`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Thumbnail Images */}
        {images.slice(1, 5).map((image, index) => (
          <div 
            key={index}
            className="relative cursor-pointer overflow-hidden rounded-lg"
            onClick={() => {
              setSelectedImage(index + 1);
              setIsModalOpen(true);
            }}
          >
            <Image
              src={image}
              alt={`${hotelName} - View ${index + 2}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">+{images.length - 5} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl max-h-4xl p-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <X className="w-6 h-6" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <div className="relative w-full h-full">
              <Image
                src={images[selectedImage]}
                alt={`${hotelName} - View ${selectedImage + 1}`}
                fill
                className="object-contain"
              />
            </div>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}