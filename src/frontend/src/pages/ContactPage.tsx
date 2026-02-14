import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Phone, Mail } from 'lucide-react';
import ContactForm from '../components/forms/ContactForm';
import { useContactInfo } from '../hooks/useQueries';

export default function ContactPage() {
  const { data: contactInfo, isLoading } = useContactInfo();

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold text-ncrl-blue">Contact Us</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Get in touch with us
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-ncrl-blue">NCRL Welfare Association Office</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <>
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-ncrl-emerald/10 p-2">
                        <MapPin className="h-5 w-5 text-ncrl-emerald" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Address</p>
                        <p className="text-sm text-muted-foreground">
                          {contactInfo?.address || 'New City Regency Layout (Madhu Reddy Layout), [Local Address]'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-ncrl-emerald/10 p-2">
                        <Phone className="h-5 w-5 text-ncrl-emerald" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          {contactInfo?.phone || '[Number]'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-ncrl-emerald/10 p-2">
                        <Mail className="h-5 w-5 text-ncrl-emerald" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {contactInfo?.email || '[Email Address]'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-ncrl-blue">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
