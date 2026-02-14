import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUpcomingEvents, usePastEvents } from '../hooks/useQueries';
import { getEventTypeLabel } from '../lib/events';
import { Calendar } from 'lucide-react';

export default function EventsPage() {
  const { data: upcomingEvents, isLoading: upcomingLoading } = useUpcomingEvents();
  const { data: pastEvents, isLoading: pastLoading } = usePastEvents();

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold text-ncrl-blue">Events</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Upcoming and past events
        </p>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-ncrl-blue">Upcoming Events</h2>
          {upcomingLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id.toString()} className="border-ncrl-emerald/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-ncrl-blue">{event.title}</CardTitle>
                      <Badge className="bg-ncrl-emerald text-white">
                        {getEventTypeLabel(event.eventType)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No upcoming events</h3>
                <p className="text-sm text-muted-foreground">
                  Check back later for upcoming community events.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Past Events */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-ncrl-blue">Past Events</h2>
          {pastLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : pastEvents && pastEvents.length > 0 ? (
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <Card key={event.id.toString()} className="opacity-75">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-ncrl-blue">{event.title}</CardTitle>
                      <Badge variant="outline" className="border-ncrl-blue text-ncrl-blue">
                        {getEventTypeLabel(event.eventType)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No past events</h3>
                <p className="text-sm text-muted-foreground">
                  Past events will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
