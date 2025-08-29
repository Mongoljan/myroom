'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function SafeImage({ 
  src, 
  alt, 
  fill = false, 
  className = '', 
  placeholder,
  blurDataURL
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  // Convert relative URLs to full URLs
  const getFullImageUrl = (imageSrc: string) => {
    if (!imageSrc) return '/images/room-placeholder.svg';
    
    // If it's already a full URL, return as-is
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }
    
    // If it's a relative path starting with /media/, convert to full URL
    if (imageSrc.startsWith('/media/') || imageSrc.startsWith('/img/')) {
      return `https://dev.kacc.mn${imageSrc}`;
    }
    
    // If it's a local path (for placeholders), return as-is
    if (imageSrc.startsWith('/images/')) {
      return imageSrc;
    }
    
    // Default fallback
    return imageSrc;
  };

  const finalImageSrc = hasError ? '/images/room-placeholder.svg' : getFullImageUrl(src);

  return (
    <Image
      src={finalImageSrc}
      alt={alt}
      fill={fill}
      className={className}
      onError={handleError}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      unoptimized={hasError} // Skip optimization for placeholder only
    />
  );
}