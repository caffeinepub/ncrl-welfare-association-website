import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Image, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import GalleryLightbox from '../components/gallery/GalleryLightbox';
import ImageWithFallback from '../components/gallery/ImageWithFallback';
import { useGalleryItems, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { getGalleryItemsWithFallback } from '../lib/gallery';

export default function GalleryPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { data: galleryItems, isLoading, isError, error } = useGalleryItems();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const displayItems = getGalleryItemsWithFallback(galleryItems);
  const images = displayItems.map((item) => ({
    src: item.imageUrl,
    alt: item.description || item.title,
  }));

  const showAdminCTA = !!identity && isAdmin === true;

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-4 text-4xl font-bold text-ncrl-blue">Gallery</h1>
            <p className="text-lg text-muted-foreground">
              Photos of community gatherings, development works, and cultural celebrations.
            </p>
          </div>
          {showAdminCTA && (
            <Link to="/admin" search={{ tab: 'gallery' }}>
              <Button variant="outline" size="sm" className="shrink-0">
                <Settings className="mr-2 h-4 w-4" />
                Manage Gallery
              </Button>
            </Link>
          )}
        </div>

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
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className="group relative aspect-[3/2] overflow-hidden rounded-lg border border-border/50 transition-all hover:border-ncrl-emerald hover:shadow-lg"
              >
                <ImageWithFallback
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
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
