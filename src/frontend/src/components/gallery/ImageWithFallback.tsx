import { useState, useEffect } from 'react';
import { FALLBACK_IMAGE_URL } from '@/lib/gallery';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export default function ImageWithFallback({
  src,
  alt,
  className,
  loading = 'lazy',
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  // Reset state when src prop changes
  useEffect(() => {
    setImgSrc(src);
    setHasErrored(false);
  }, [src]);

  const handleError = () => {
    // Prevent infinite error loop if fallback also fails
    if (!hasErrored && imgSrc !== FALLBACK_IMAGE_URL) {
      setHasErrored(true);
      setImgSrc(FALLBACK_IMAGE_URL);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
    />
  );
}
