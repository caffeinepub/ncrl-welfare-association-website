import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-ncrl-blue">Documents</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-ncrl-emerald/10 p-3">
                    <FileText className="h-6 w-6 text-ncrl-emerald" />
                  </div>
                  <div>
                    <CardTitle className="text-ncrl-blue">Layout Plan (image/PDF)</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Official layout plan of New City Regency Layout
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-ncrl-emerald hover:bg-ncrl-emerald/90">
                <a href="/assets/documents/layout-plan-placeholder.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  View / Download
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-ncrl-emerald/10 p-3">
                    <FileText className="h-6 w-6 text-ncrl-emerald" />
                  </div>
                  <div>
                    <CardTitle className="text-ncrl-blue">Association Bylaws and Rules</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Official bylaws and rules governing the association
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-ncrl-emerald hover:bg-ncrl-emerald/90">
                <a href="/assets/documents/association-bylaws-placeholder.pdf" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  View / Download
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
