import { GalleryItem } from '../backend';

/**
 * Normalize and sanitize a gallery item for safe UI rendering
 */
export function normalizeGalleryItem(item: GalleryItem): GalleryItem {
  return {
    ...item,
    title: item.title.trim(),
    imageUrl: item.imageUrl.trim(),
    description: item.description.trim(),
  };
}

/**
 * Filter out invalid gallery items (missing required fields or invalid URLs)
 */
export function isValidGalleryItem(item: GalleryItem): boolean {
  if (!item.title || !item.imageUrl) return false;
  
  // Basic URL validation - must start with http://, https://, /, or data:image/
  const url = item.imageUrl.trim();
  return (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/') ||
    url.startsWith('data:image/')
  );
}

/**
 * Process gallery items for UI display: normalize, filter, and sort
 */
export function processGalleryItems(items: GalleryItem[]): GalleryItem[] {
  return items
    .filter(isValidGalleryItem)
    .map(normalizeGalleryItem)
    .sort((a, b) => Number(b.id) - Number(a.id)); // Most recent first
}

/**
 * Local default gallery items using static assets
 */
export const defaultGalleryItems: GalleryItem[] = [
  {
    id: BigInt(1),
    title: 'Community Garden',
    imageUrl: '/assets/generated/ncrl-gallery-01.dim_1600x1066.png',
    description: 'A beautiful view of our community garden in full bloom.',
  },
  {
    id: BigInt(2),
    title: 'Annual Picnic',
    imageUrl: '/assets/generated/ncrl-gallery-02.dim_1600x1066.png',
    description: 'Family members enjoying games and food at the annual picnic.',
  },
  {
    id: BigInt(3),
    title: 'Welfare Drive',
    imageUrl: '/assets/generated/ncrl-gallery-03.dim_1600x1066.png',
    description: 'Volunteers organizing donated goods for local families.',
  },
  {
    id: BigInt(4),
    title: 'Cultural Night',
    imageUrl: '/assets/generated/ncrl-gallery-04.dim_1600x1066.png',
    description: 'A snapshot of performances during Cultural Night celebrations.',
  },
  {
    id: BigInt(5),
    title: 'Clean-Up Day',
    imageUrl: '/assets/generated/ncrl-gallery-05.dim_1600x1066.png',
    description: 'Residents participating in neighborhood clean-up efforts.',
  },
  {
    id: BigInt(6),
    title: 'Community Gathering',
    imageUrl: '/assets/generated/ncrl-gallery-06.dim_1600x1066.png',
    description: 'Neighbors coming together for a community event.',
  },
];

/**
 * Get gallery items with fallback to local defaults when empty
 */
export function getGalleryItemsWithFallback(items: GalleryItem[] | undefined): GalleryItem[] {
  if (!items) return defaultGalleryItems;
  
  const processed = processGalleryItems(items);
  
  // If all items were filtered out as invalid, use defaults
  return processed.length > 0 ? processed : defaultGalleryItems;
}

/**
 * Shared fallback image URL for broken/unreachable gallery images
 */
export const FALLBACK_IMAGE_URL = '/assets/generated/ncrl-gallery-01.dim_1600x1066.png';
