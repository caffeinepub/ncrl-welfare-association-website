import { Link } from '@tanstack/react-router';
import { useUpcomingEvents, usePastEvents, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Calendar, AlertCircle, Mail } from 'lucide-react';
import { getEventTypeLabel } from '../lib/events';
import { getAdminEventsLink } from '../lib/adminLinks';

export default function EventsPage() {
  const { data: upcomingEvents = [], isLoading: upcomingLoading, error: upcomingError } = useUpcomingEvents();
  const { data: pastEvents = [], isLoading: pastLoading, error: pastError } = usePastEvents();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const showAdminButton = isAuthenticated && !adminCheckLoading && isAdmin === true;
  const showAdminGuidance = isAuthenticated && !adminCheckLoading && isAdmin === false;

  const isLoading = upcomingLoading || pastLoading;
  const error = upcomingError || pastError;

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-ncrl-blue mb-2">Events</h1>
            <p className="text-muted-foreground">
              Discover upcoming events and view past community activities
            </p>
          </div>
          {showAdminButton && (
            <Link to={getAdminEventsLink()}>
              <Button className="bg-ncrl-blue hover:bg-ncrl-blue/90">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Events
              </Button>
            </Link>
          )}
        </div>

        {showAdminGuidance && (
          <Alert className="border-ncrl-emerald bg-ncrl-emerald/5">
            <Mail className="h-4 w-4 text-ncrl-emerald" />
            <AlertTitle>Want to manage events?</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              To upload and manage events, you need to set your profile email to the authorized admin email address. 
              <Link to="/admin" className="ml-1 font-medium text-ncrl-blue hover:underline">
                Go to Admin page to update your profile
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-ncrl-blue" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load events. Please try again later.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-12">
          {/* Upcoming Events */}
          <section>
            <h2 className="text-2xl font-bold text-ncrl-blue mb-6">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">No upcoming events</p>
                  <p className="text-sm text-muted-foreground">Check back later for new events</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Card key={event.id.toString()} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-ncrl-emerald/10 text-ncrl-emerald">
                          {getEventTypeLabel(event.eventType)}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Past Events */}
          <section>
            <h2 className="text-2xl font-bold text-ncrl-blue mb-6">Past Events</h2>
            {pastEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">No past events</p>
                  <p className="text-sm text-muted-foreground">Past events will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <Card key={event.id.toString()} className="hover:shadow-lg transition-shadow opacity-90">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {getEventTypeLabel(event.eventType)}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {event.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
