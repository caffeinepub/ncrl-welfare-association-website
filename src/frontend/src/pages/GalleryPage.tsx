import { useState } from 'react';
import { Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import GalleryLightbox from '../components/gallery/GalleryLightbox';
import { useGalleryItems } from '../hooks/useQueries';
import { processGalleryItems } from '../lib/gallery';

export default function GalleryPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { data: galleryItems, isLoading, isError, error } = useGalleryItems();

  const processedItems = galleryItems ? processGalleryItems(galleryItems) : [];
  const images = processedItems.map((item) => ({
    src: item.imageUrl,
    alt: item.description || item.title,
  }));

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-4xl font-bold text-ncrl-blue">Gallery</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Photos of community gatherings, development works, and cultural celebrations.
        </p>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-[3/2] w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <Card className="border-destructive/50">
            <CardContent className="py-16 text-center">
              <Image className="mx-auto mb-4 h-16 w-16 text-destructive/50" />
              <p className="text-lg text-destructive">Failed to load gallery images</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Please try again later'}
              </p>
            </CardContent>
          </Card>
        ) : images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className="group relative aspect-[3/2] overflow-hidden rounded-lg border border-border/50 transition-all hover:border-ncrl-emerald hover:shadow-lg"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Image className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="text-lg text-muted-foreground">No gallery images available at the moment.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Check back later for photos of community events and activities.
              </p>
            </CardContent>
          </Card>
        )}

        {selectedImageIndex !== null && images.length > 0 && (
          <GalleryLightbox
            images={images}
            currentIndex={selectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
            onNavigate={setSelectedImageIndex}
          />
        )}
      </div>
    </div>
  );
}
