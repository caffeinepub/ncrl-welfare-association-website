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
  
  // Basic URL validation - must start with http://, https://, or /
  const url = item.imageUrl.trim();
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
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
