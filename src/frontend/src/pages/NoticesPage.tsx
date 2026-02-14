import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotices } from '../hooks/useQueries';
import { NoticeCategory } from '../backend';
import { getNoticeCategoryLabel } from '../lib/notices';
import { Bell } from 'lucide-react';

export default function NoticesPage() {
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory>(NoticeCategory.general);
  const { data: notices, isLoading } = useNotices(selectedCategory);

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold text-ncrl-blue">Announcements & Notices</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Stay updated with the latest information
        </p>

        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as NoticeCategory)}>
          <TabsList className="mb-8 grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value={NoticeCategory.waterSupply}>Water Supply</TabsTrigger>
            <TabsTrigger value={NoticeCategory.civicIssues}>Civic Issues</TabsTrigger>
            <TabsTrigger value={NoticeCategory.meetings}>Meetings</TabsTrigger>
            <TabsTrigger value={NoticeCategory.general}>General</TabsTrigger>
          </TabsList>

          {[NoticeCategory.waterSupply, NoticeCategory.civicIssues, NoticeCategory.meetings, NoticeCategory.general].map((category) => (
            <TabsContent key={category} value={category}>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading notices...</p>
                </div>
              ) : notices && notices.length > 0 ? (
                <div className="space-y-4">
                  {notices.map((notice) => (
                    <Card key={notice.id.toString()}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-ncrl-blue">{notice.title}</CardTitle>
                          <Badge variant="outline" className="border-ncrl-emerald text-ncrl-emerald">
                            {getNoticeCategoryLabel(notice.category)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{notice.date}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="leading-relaxed text-muted-foreground">{notice.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center py-12 text-center">
                    <div className="mb-4 rounded-full bg-muted p-4">
                      <Bell className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No notices yet</h3>
                    <p className="text-sm text-muted-foreground">
                      There are currently no {getNoticeCategoryLabel(category).toLowerCase()} notices.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
