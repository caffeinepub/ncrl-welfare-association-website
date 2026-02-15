import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AuthControl from './AuthControl';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, AlertCircle } from 'lucide-react';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminCheckLoading, isError: isAdminError } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const showAdminLink = isAuthenticated && !adminCheckLoading && isAdmin === true;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/notices', label: 'Notices' },
    { to: '/events', label: 'Events' },
    { to: '/membership', label: 'Membership' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];

  if (showAdminLink) {
    navLinks.push({ to: '/admin', label: 'Admin' });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/assets/generated/ncrl-logo.dim_512x512.png" 
            alt="NCRL Logo" 
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-ncrl-blue">NCRL Association</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-foreground/80 hover:text-ncrl-blue transition-colors"
              activeProps={{ className: 'text-ncrl-blue' }}
            >
              {link.label}
            </Link>
          ))}
          <AuthControl />
          {isAuthenticated && isAdminError && (
            <div className="ml-2 text-amber-600" title="Admin check failed">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <AuthControl />
          {isAuthenticated && isAdminError && (
            <div className="text-amber-600" title="Admin check failed">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-base font-medium text-foreground/80 hover:text-ncrl-blue transition-colors"
                    activeProps={{ className: 'text-ncrl-blue' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
