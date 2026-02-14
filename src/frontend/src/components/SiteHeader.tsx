import { Link, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/documents', label: 'Documents' },
  { path: '/notices', label: 'Notices' },
  { path: '/events', label: 'Events' },
  { path: '/membership', label: 'Membership' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
  { path: '/admin', label: 'Admin' },
];

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/generated/ncrl-logo.dim_512x512.png" alt="NCRL Logo" className="h-10 w-10" />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight text-ncrl-blue">NCRL</span>
            <span className="text-xs text-muted-foreground">Welfare Association</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-ncrl-emerald ${
                currentPath === link.path
                  ? 'text-ncrl-emerald'
                  : 'text-foreground/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 text-base font-medium transition-colors hover:text-ncrl-emerald ${
                    currentPath === link.path
                      ? 'text-ncrl-emerald bg-ncrl-emerald/10 rounded-md'
                      : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
