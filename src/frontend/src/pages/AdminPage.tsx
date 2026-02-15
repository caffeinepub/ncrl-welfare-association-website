import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useIsCallerAdmin,
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
  useNotices,
  useUpcomingEvents,
  usePastEvents,
  useGalleryItems,
  useCreateNotice,
  useDeleteNotice,
  useCreateEvent,
  useDeleteEvent,
  useAddGalleryItem,
  useDeleteGalleryItem,
} from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Trash2, Shield, LogIn, Copy, Check, Upload, X } from 'lucide-react';
import { NoticeCategory, EventType } from '../backend';
import { getNoticeCategoryLabel } from '../lib/notices';
import { getEventTypeLabel } from '../lib/events';
import { toast } from 'sonner';

export default function AdminPage() {
  const { login, identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsCallerAdmin();

  const [profileName, setProfileName] = useState('');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Check if we need to show profile setup
  if (isAuthenticated && !profileLoading && isFetched && userProfile === null && !showProfileSetup) {
    setShowProfileSetup(true);
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: profileName.trim() });
      toast.success('Profile created successfully!');
      setShowProfileSetup(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create profile');
    }
  };

  const handleCopyPrincipal = async () => {
    if (!identity) return;
    
    const principalId = identity.getPrincipal().toString();
    
    try {
      await navigator.clipboard.writeText(principalId);
      setCopied(true);
      toast.success('Principal ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy Principal ID');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ncrl-blue/10">
              <Shield className="h-8 w-8 text-ncrl-blue" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>Please log in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full bg-ncrl-blue hover:bg-ncrl-blue/90"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login with Internet Identity
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminCheckLoading || profileLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-ncrl-blue" />
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    const principalId = identity?.getPrincipal().toString() || '';
    
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-md border-destructive">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access the admin dashboard. Please contact an administrator if you believe this is an error.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal-id" className="text-sm font-medium">
                Your Principal ID
              </Label>
              <div className="flex gap-2">
                <Input
                  id="principal-id"
                  value={principalId}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPrincipal}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this ID with an administrator to request access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-ncrl-blue">Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage notices, events, and gallery items
          </p>
        </div>

        <Tabs defaultValue="notices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="notices">Notices</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="notices">
            <NoticesAdmin />
          </TabsContent>

          <TabsContent value="events">
            <EventsAdmin />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryAdmin />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome! Set up your profile</DialogTitle>
            <DialogDescription>Please enter your name to continue</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <Button type="submit" disabled={saveProfile.isPending} className="w-full">
              {saveProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function NoticesAdmin() {
  const [category, setCategory] = useState<NoticeCategory>(NoticeCategory.general);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  const { data: notices = [] } = useNotices(NoticeCategory.general);
  const { data: waterNotices = [] } = useNotices(NoticeCategory.waterSupply);
  const { data: civicNotices = [] } = useNotices(NoticeCategory.civicIssues);
  const { data: meetingNotices = [] } = useNotices(NoticeCategory.meetings);

  const allNotices = [...notices, ...waterNotices, ...civicNotices, ...meetingNotices];

  const createNotice = useCreateNotice();
  const deleteNotice = useDeleteNotice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createNotice.mutateAsync({ category, title, content, date });
      toast.success('Notice created successfully!');
      setTitle('');
      setContent('');
      setDate('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create notice');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      await deleteNotice.mutateAsync(id);
      toast.success('Notice deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete notice');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create Notice</CardTitle>
          <CardDescription>Add a new notice to the website</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as NoticeCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NoticeCategory.general}>General</SelectItem>
                  <SelectItem value={NoticeCategory.waterSupply}>Water Supply</SelectItem>
                  <SelectItem value={NoticeCategory.civicIssues}>Civic Issues</SelectItem>
                  <SelectItem value={NoticeCategory.meetings}>Meetings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notice title"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Notice content"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={createNotice.isPending} className="w-full">
              {createNotice.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Notice'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Notices</CardTitle>
          <CardDescription>View and delete existing notices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allNotices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No notices found
                    </TableCell>
                  </TableRow>
                ) : (
                  allNotices.map((notice) => (
                    <TableRow key={Number(notice.id)}>
                      <TableCell className="font-medium">{notice.title}</TableCell>
                      <TableCell>{getNoticeCategoryLabel(notice.category)}</TableCell>
                      <TableCell>{notice.date}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(notice.id)}
                          disabled={deleteNotice.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EventsAdmin() {
  const [eventType, setEventType] = useState<EventType>(EventType.associationMeeting);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isPast, setIsPast] = useState(false);

  const { data: upcomingEvents = [] } = useUpcomingEvents();
  const { data: pastEvents = [] } = usePastEvents();
  const allEvents = [...upcomingEvents, ...pastEvents];

  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent.mutateAsync({ eventType, title, description, date, isPast });
      toast.success('Event created successfully!');
      setTitle('');
      setDescription('');
      setDate('');
      setIsPast(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent.mutateAsync(id);
      toast.success('Event deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>Add a new event to the website</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EventType.associationMeeting}>Association Meeting</SelectItem>
                  <SelectItem value={EventType.culturalProgram}>Cultural Program</SelectItem>
                  <SelectItem value={EventType.welfareDrive}>Welfare Drive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="eventTitle">Title</Label>
              <Input
                id="eventTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                required
              />
            </div>

            <div>
              <Label htmlFor="eventDescription">Description</Label>
              <Textarea
                id="eventDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event description"
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPast"
                checked={isPast}
                onChange={(e) => setIsPast(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="isPast" className="cursor-pointer">
                Mark as past event
              </Label>
            </div>

            <Button type="submit" disabled={createEvent.isPending} className="w-full">
              {createEvent.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Events</CardTitle>
          <CardDescription>View and delete existing events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No events found
                    </TableCell>
                  </TableRow>
                ) : (
                  allEvents.map((event) => (
                    <TableRow key={Number(event.id)}>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{getEventTypeLabel(event.eventType)}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            event.isPast
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-ncrl-green/10 text-ncrl-green'
                          }`}
                        >
                          {event.isPast ? 'Past' : 'Upcoming'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(event.id)}
                          disabled={deleteEvent.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GalleryAdmin() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { data: galleryItems = [] } = useGalleryItems();
  const addGalleryItem = useAddGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (!file) {
      setSelectedFile(null);
      setImagePreview(null);
      setImageDataUrl(null);
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError('Please select a valid image file (PNG, JPG, WebP, or GIF)');
      setSelectedFile(null);
      setImagePreview(null);
      setImageDataUrl(null);
      e.target.value = '';
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError('Image file size must be less than 5MB');
      setSelectedFile(null);
      setImagePreview(null);
      setImageDataUrl(null);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);

    // Create preview and data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageDataUrl(result);
    };
    reader.onerror = () => {
      setFileError('Failed to read the image file');
      setSelectedFile(null);
      setImagePreview(null);
      setImageDataUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setImageDataUrl(null);
    setFileError(null);
    const fileInput = document.getElementById('gallery-image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageDataUrl) {
      toast.error('Please select an image file');
      return;
    }

    if (fileError) {
      toast.error(fileError);
      return;
    }

    try {
      await addGalleryItem.mutateAsync({
        title,
        imageUrl: imageDataUrl,
        description,
      });
      toast.success('Gallery item added successfully!');
      setTitle('');
      setDescription('');
      handleClearFile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add gallery item');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      await deleteGalleryItem.mutateAsync(id);
      toast.success('Gallery item deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete gallery item');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add Gallery Item</CardTitle>
          <CardDescription>Upload a new image to the gallery</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="gallery-title">Title</Label>
              <Input
                id="gallery-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Image title"
                required
              />
            </div>

            <div>
              <Label htmlFor="gallery-description">Description</Label>
              <Textarea
                id="gallery-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Image description"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="gallery-image">Image File</Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    id="gallery-image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleClearFile}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {fileError && (
                  <p className="text-sm text-destructive">{fileError}</p>
                )}
                
                {selectedFile && !fileError && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                    {imagePreview && (
                      <div className="relative overflow-hidden rounded-lg border">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-48 w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {!selectedFile && (
                  <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-center">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, WebP, or GIF (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={addGalleryItem.isPending || !selectedFile || !!fileError}
              className="w-full"
            >
              {addGalleryItem.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Gallery'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Gallery</CardTitle>
          <CardDescription>View and delete gallery items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {galleryItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No gallery items found
                    </TableCell>
                  </TableRow>
                ) : (
                  galleryItems.map((item) => (
                    <TableRow key={Number(item.id)}>
                      <TableCell>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteGalleryItem.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
