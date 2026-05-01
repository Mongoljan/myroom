'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

const MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://dev.kacc.mn';

function getFullImageUrl(imageSrc: string): string {
  if (!imageSrc) return '/images/hotel-placeholder.jpg';
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) return imageSrc;
  if (imageSrc.startsWith('/media/') || imageSrc.startsWith('/img/')) return `${MEDIA_BASE_URL}${imageSrc}`;
  if (imageSrc.startsWith('/images/')) return imageSrc;
  return imageSrc;
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

  const finalImageSrc = useMemo(
    () => (hasError ? '/images/hotel-placeholder.jpg' : getFullImageUrl(src)),
    [hasError, src]
  );

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