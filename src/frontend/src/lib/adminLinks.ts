export type AdminTab = 'notices' | 'events' | 'gallery';

const VALID_TABS: AdminTab[] = ['notices', 'events', 'gallery'];

export function normalizeAdminTab(tab: string | null | undefined): AdminTab {
  if (!tab) return 'notices';
  const normalized = tab.toLowerCase();
  return VALID_TABS.includes(normalized as AdminTab) ? (normalized as AdminTab) : 'notices';
}

export function getAdminLink(tab?: AdminTab): string {
  if (!tab) return '/admin';
  return `/admin?tab=${tab}`;
}

export function getAdminNoticesLink(): string {
  return getAdminLink('notices');
}

export function getAdminEventsLink(): string {
  return getAdminLink('events');
}

export function getAdminGalleryLink(): string {
  return getAdminLink('gallery');
}
