import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useNotices, useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, FileText, AlertCircle, Mail } from 'lucide-react';
import { NoticeCategory } from '../backend';
import { getNoticeCategoryLabel } from '../lib/notices';
import { getAdminNoticesLink } from '../lib/adminLinks';

export default function NoticesPage() {
  const [activeCategory, setActiveCategory] = useState<NoticeCategory | 'all'>('all');
  const { data: notices = [], isLoading, error } = useNotices();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const showAdminButton = isAuthenticated && !adminCheckLoading && isAdmin === true;
  const showAdminGuidance = isAuthenticated && !adminCheckLoading && isAdmin === false;

  const filteredNotices = activeCategory === 'all' 
    ? notices 
    : notices.filter(notice => notice.category === activeCategory);

  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.timestamp > b.timestamp) return -1;
    if (a.timestamp < b.timestamp) return 1;
    return 0;
  });

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-ncrl-blue mb-2">Notices</h1>
            <p className="text-muted-foreground">
              Stay updated with important announcements and community notices
            </p>
          </div>
          {showAdminButton && (
            <Link to={getAdminNoticesLink()}>
              <Button className="bg-ncrl-blue hover:bg-ncrl-blue/90">
                <FileText className="mr-2 h-4 w-4" />
                Manage Notices
              </Button>
            </Link>
          )}
        </div>

        {showAdminGuidance && (
          <Alert className="border-ncrl-emerald bg-ncrl-emerald/5">
            <Mail className="h-4 w-4 text-ncrl-emerald" />
            <AlertTitle>Want to manage notices?</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              To upload and manage notices, you need to set your profile email to the authorized admin email address. 
              <Link to="/admin" className="ml-1 font-medium text-ncrl-blue hover:underline">
                Go to Admin page to update your profile
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as NoticeCategory | 'all')}>
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={NoticeCategory.waterSupply}>
            {getNoticeCategoryLabel(NoticeCategory.waterSupply)}
          </TabsTrigger>
          <TabsTrigger value={NoticeCategory.civicIssues}>
            {getNoticeCategoryLabel(NoticeCategory.civicIssues)}
          </TabsTrigger>
          <TabsTrigger value={NoticeCategory.meetings}>
            {getNoticeCategoryLabel(NoticeCategory.meetings)}
          </TabsTrigger>
          <TabsTrigger value={NoticeCategory.general}>
            {getNoticeCategoryLabel(NoticeCategory.general)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory}>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-ncrl-blue" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load notices. Please try again later.
              </AlertDescription>
            </Alert>
          ) : sortedNotices.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">No notices available</p>
                <p className="text-sm text-muted-foreground">
                  {activeCategory === 'all' 
                    ? 'There are no notices at the moment.' 
                    : `No notices in the ${getNoticeCategoryLabel(activeCategory as NoticeCategory)} category.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {sortedNotices.map((notice) => (
                <Card key={notice.id.toString()} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-ncrl-blue/10 text-ncrl-blue">
                            {getNoticeCategoryLabel(notice.category)}
                          </span>
                          <span className="text-sm text-muted-foreground">{notice.date}</span>
                        </div>
                        <CardTitle className="text-2xl">{notice.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base whitespace-pre-wrap">
                      {notice.content}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
