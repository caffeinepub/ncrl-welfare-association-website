import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Eye, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-ncrl-blue">About Us</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              The NCRL Welfare Association represents residents of New City Regency Layout (Madhu Reddy Layout).
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-ncrl-emerald/20">
            <CardHeader>
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-full bg-ncrl-emerald/10 p-3">
                  <Target className="h-6 w-6 text-ncrl-emerald" />
                </div>
                <CardTitle className="text-ncrl-blue">Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                To ensure fair representation, transparent communication, and community-driven development.
              </p>
            </CardContent>
          </Card>

          <Card className="border-ncrl-emerald/20">
            <CardHeader>
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-full bg-ncrl-emerald/10 p-3">
                  <Eye className="h-6 w-6 text-ncrl-emerald" />
                </div>
                <CardTitle className="text-ncrl-blue">Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-muted-foreground">
                A self-reliant, well-connected, and progressive neighborhood.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-full bg-ncrl-blue/10 p-3">
                <Users className="h-6 w-6 text-ncrl-blue" />
              </div>
              <CardTitle className="text-ncrl-blue">Committee</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-4">
                <div className="font-semibold text-ncrl-blue">President –</div>
                <div className="text-muted-foreground">[Name]</div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-4">
                <div className="font-semibold text-ncrl-blue">Secretary –</div>
                <div className="text-muted-foreground">[Name]</div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-4">
                <div className="font-semibold text-ncrl-blue">Treasurer –</div>
                <div className="text-muted-foreground">[Name]</div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 p-4">
                <div className="font-semibold text-ncrl-blue">Members –</div>
                <div className="text-muted-foreground">[List of names]</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
