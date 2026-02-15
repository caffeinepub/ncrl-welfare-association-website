import { Link } from '@tanstack/react-router';
import { Bell, Calendar, Users, Mail, MapPin, Phone, ArrowRight, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLatestNotices, useUpcomingEventsPreview, useContactInfo, useGalleryItems } from '../hooks/useQueries';
import { getNoticeCategoryLabel } from '../lib/notices';
import { getEventTypeLabel } from '../lib/events';
import { getGalleryItemsWithFallback } from '../lib/gallery';
import ContactForm from '../components/forms/ContactForm';

export default function HomePage() {
  const { data: latestNotices, isLoading: noticesLoading } = useLatestNotices(5);
  const { data: upcomingEvents, isLoading: eventsLoading } = useUpcomingEventsPreview(3);
  const { data: contactInfo, isLoading: contactLoading } = useContactInfo();
  const { data: galleryItems, isLoading: galleryLoading } = useGalleryItems();

  const displayGallery = getGalleryItemsWithFallback(galleryItems);
  const galleryPreview = displayGallery.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ncrl-blue via-ncrl-blue/95 to-ncrl-emerald/20">
        <div className="container relative z-10 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="text-white">
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                New City Regency Layout (NCRL) Welfare Association
              </h1>
              <p className="mb-6 text-xl font-medium text-white/90 md:text-2xl">
                Together for a better community
              </p>
              <p className="mb-8 text-base leading-relaxed text-white/80 md:text-lg">
                Welcome to the official website of NCRL Welfare Association. Representing residents of New City Regency Layout (Madhu Reddy Layout), our goal is to build a safe, transparent, and vibrant neighborhood where residents come together for collective welfare and development.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-ncrl-gold text-ncrl-blue hover:bg-ncrl-gold/90">
                  <Link to="/membership">Join Us</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/assets/generated/ncrl-hero-banner.dim_1600x600.png"
                alt="NCRL community neighborhood in Bangalore showing residential layout and community spaces"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="container py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-ncrl-blue">Quick Links</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/notices" className="group">
            <Card className="transition-all hover:shadow-lg hover:border-ncrl-emerald">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-ncrl-emerald/10 p-4 transition-colors group-hover:bg-ncrl-emerald/20">
                  <Bell className="h-8 w-8 text-ncrl-emerald" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-ncrl-blue">Notices</h3>
                <p className="text-sm text-muted-foreground">
                  Stay updated with important announcements
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/events" className="group">
            <Card className="transition-all hover:shadow-lg hover:border-ncrl-emerald">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-ncrl-emerald/10 p-4 transition-colors group-hover:bg-ncrl-emerald/20">
                  <Calendar className="h-8 w-8 text-ncrl-emerald" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-ncrl-blue">Events</h3>
                <p className="text-sm text-muted-foreground">
                  Upcoming community events and programs
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/membership" className="group">
            <Card className="transition-all hover:shadow-lg hover:border-ncrl-emerald">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-ncrl-emerald/10 p-4 transition-colors group-hover:bg-ncrl-emerald/20">
                  <Users className="h-8 w-8 text-ncrl-emerald" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-ncrl-blue">Membership</h3>
                <p className="text-sm text-muted-foreground">
                  Join our community association
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/contact" className="group">
            <Card className="transition-all hover:shadow-lg hover:border-ncrl-emerald">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-ncrl-emerald/10 p-4 transition-colors group-hover:bg-ncrl-emerald/20">
                  <Mail className="h-8 w-8 text-ncrl-emerald" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-ncrl-blue">Contact</h3>
                <p className="text-sm text-muted-foreground">
                  Get in touch with us
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Latest Notices Section */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-ncrl-blue">Latest Notices</h2>
            <Button asChild variant="outline" className="border-ncrl-emerald text-ncrl-emerald hover:bg-ncrl-emerald/10">
              <Link to="/notices">
                View All Notices <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {noticesLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : latestNotices && latestNotices.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {latestNotices.slice(0, 5).map((notice) => (
                <Card key={Number(notice.id)} className="transition-all hover:shadow-lg hover:border-ncrl-emerald">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="outline" className="border-ncrl-emerald text-ncrl-emerald">
                        {getNoticeCategoryLabel(notice.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{notice.date}</span>
                    </div>
                    <CardTitle className="text-lg">{notice.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{notice.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">No notices available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="container py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-ncrl-blue">Upcoming Events</h2>
          <Button asChild variant="outline" className="border-ncrl-emerald text-ncrl-emerald hover:bg-ncrl-emerald/10">
            <Link to="/events">
              View All Events <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {eventsLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={Number(event.id)} className="transition-all hover:shadow-lg hover:border-ncrl-emerald">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge className="bg-ncrl-emerald text-white">
                      {getEventTypeLabel(event.eventType)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                  </div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No upcoming events at the moment.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Gallery Preview Section */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-ncrl-blue">Gallery</h2>
            <Button asChild variant="outline" className="border-ncrl-emerald text-ncrl-emerald hover:bg-ncrl-emerald/10">
              <Link to="/gallery">
                View All Photos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {galleryLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {galleryPreview.map((item) => (
                <Link
                  key={Number(item.id)}
                  to="/gallery"
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border/50 transition-all hover:border-ncrl-emerald hover:shadow-lg"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.description || item.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-ncrl-blue">Get in Touch</h2>
            <p className="mb-8 text-muted-foreground">
              Have questions or suggestions? We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
            </p>

            {contactLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-ncrl-emerald" />
                  <div>
                    <h3 className="font-semibold text-ncrl-blue">Address</h3>
                    <p className="text-muted-foreground">
                      {contactInfo?.address || '123 Main St, City, Country'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-ncrl-emerald" />
                  <div>
                    <h3 className="font-semibold text-ncrl-blue">Phone</h3>
                    <p className="text-muted-foreground">
                      {contactInfo?.phone || '+1234567890'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-ncrl-emerald" />
                  <div>
                    <h3 className="font-semibold text-ncrl-blue">Email</h3>
                    <p className="text-muted-foreground">
                      {contactInfo?.email || 'info@association.com'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
