import { Heart } from 'lucide-react';

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'ncrl-welfare';

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-ncrl-blue">NCRL Welfare Association</h3>
            <p className="text-sm text-muted-foreground">
              New City Regency Layout (Madhu Reddy Layout)
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Together for a better community
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-ncrl-blue">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/about" className="hover:text-ncrl-emerald transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/notices" className="hover:text-ncrl-emerald transition-colors">
                  Notices
                </a>
              </li>
              <li>
                <a href="/events" className="hover:text-ncrl-emerald transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="/membership" className="hover:text-ncrl-emerald transition-colors">
                  Membership
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-ncrl-blue">Contact</h3>
            <p className="text-sm text-muted-foreground">
              New City Regency Layout
              <br />
              (Madhu Reddy Layout)
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} NCRL Welfare Association. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ncrl-emerald hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
