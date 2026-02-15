import { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function GalleryLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const handlePrevious = () => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1);
  };

  const handleNext = () => {
    onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="relative flex items-center justify-center bg-black">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <ImageWithFallback
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-h-[80vh] w-auto object-contain"
              loading="eager"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="bg-black/90 p-4 text-center text-white">
            <p className="text-sm">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
