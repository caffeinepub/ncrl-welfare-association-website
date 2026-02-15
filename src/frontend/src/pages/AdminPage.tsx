import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
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
  useUpdateNotice,
  useDeleteNotice,
  useCreateEvent,
  useUpdateEvent,
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Loader2, Trash2, Shield, LogIn, Copy, Check, AlertCircle, RefreshCw, HelpCircle, Mail, User, Edit, Plus } from 'lucide-react';
import { NoticeCategory, EventType, Notice, Event, GalleryItem } from '../backend';
import { getNoticeCategoryLabel } from '../lib/notices';
import { getEventTypeLabel } from '../lib/events';
import { normalizeAdminTab, type AdminTab } from '../lib/adminLinks';
import { getUrlParameter } from '../utils/urlParams';
import { toast } from 'sonner';

export default function AdminPage() {
  const navigate = useNavigate();
  const { login, clear, identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const { 
    data: isAdmin, 
    isLoading: adminCheckLoading, 
    isFetched: adminCheckFetched,
    isError: isAdminError,
    error: adminError,
    refetch: refetchAdminStatus
  } = useIsCallerAdmin();

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Read tab from URL and normalize it
  const urlTab = getUrlParameter('tab');
  const [activeTab, setActiveTab] = useState<AdminTab>(normalizeAdminTab(urlTab));

  // Update URL when tab changes
  useEffect(() => {
    const urlTab = getUrlParameter('tab');
    const normalizedUrlTab = normalizeAdminTab(urlTab);
    
    if (normalizedUrlTab !== activeTab) {
      setActiveTab(normalizedUrlTab);
    }
  }, []);

  const handleTabChange = (value: string) => {
    const tab = normalizeAdminTab(value);
    setActiveTab(tab);
    // Update URL with new tab parameter
    navigate({ to: '/admin', search: { tab } });
  };

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  // Check if we need to show profile setup (new user or missing email)
  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched) {
      if (userProfile === null) {
        // New user - no profile at all
        setShowProfileSetup(true);
      } else if (userProfile && (!userProfile.email || userProfile.email.trim() === '')) {
        // Existing user with missing email
        setProfileName(userProfile.name);
        setProfileEmail('');
        setShowProfileSetup(true);
      }
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!profileEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileEmail.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await saveProfile.mutateAsync({ 
        name: profileName.trim(),
        email: profileEmail.trim()
      });
      toast.success('Profile saved successfully!');
      setShowProfileSetup(false);
      // Refetch admin status after profile save
      await refetchAdminStatus();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
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

  const handleRetryAdminCheck = async () => {
    await refetchAdminStatus();
  };

  const handleLogoutAndRetry = async () => {
    await clear();
    toast.info('Please log in again to retry');
  };

  const handleUpdateProfile = () => {
    if (userProfile) {
      setProfileName(userProfile.name);
      setProfileEmail(userProfile.email || '');
    }
    setShowProfileSetup(true);
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

  if (adminCheckLoading || profileLoading || !adminCheckFetched) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-ncrl-blue" />
          <p className="mt-4 text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Handle admin check error
  if (isAdminError) {
    const principalId = identity?.getPrincipal().toString() || '';
    const errorMessage = adminError instanceof Error ? adminError.message : String(adminError);
    
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-2xl border-amber-500">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">Admin Status Verification Failed</CardTitle>
            <CardDescription>
              We couldn't verify your admin access. This might be a temporary issue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>What happened?</AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                The system encountered an error while checking your admin permissions. This could be due to:
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>A temporary network issue</li>
                  <li>Backend service unavailability</li>
                  <li>Identity verification problems</li>
                </ul>
              </AlertDescription>
            </Alert>

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
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this ID with the system administrator if you need help.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Error Details</Label>
              <div className="rounded-md bg-muted p-3">
                <code className="text-xs text-muted-foreground break-all">
                  {errorMessage}
                </code>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={handleRetryAdminCheck}
                className="flex-1 bg-ncrl-blue hover:bg-ncrl-blue/90"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Verification
              </Button>
              <Button
                onClick={handleLogoutAndRetry}
                variant="outline"
                className="flex-1"
              >
                Logout & Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access denied - not an admin
  if (!isAdmin) {
    const principalId = identity?.getPrincipal().toString() || '';
    const hasProfile = userProfile !== null;
    const hasEmail = hasProfile && userProfile?.email && userProfile.email.trim() !== '';
    
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-2xl border-ncrl-blue">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ncrl-blue/10">
              <Shield className="h-8 w-8 text-ncrl-blue" />
            </div>
            <CardTitle className="text-2xl">Admin Access Setup</CardTitle>
            <CardDescription>
              Complete your profile to enable admin features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-ncrl-emerald bg-ncrl-emerald/5">
              <Mail className="h-4 w-4 text-ncrl-emerald" />
              <AlertTitle>Email Required for Admin Access</AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                To access admin features for uploading notices, events, and gallery items, you need to set your profile email to the authorized admin email address: <strong className="font-mono">sadashivn.a@gmail.com</strong>
              </AlertDescription>
            </Alert>

            {hasProfile && userProfile && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Your Current Profile</Label>
                  <div className="rounded-md bg-muted p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm"><span className="font-medium">Name:</span> {userProfile.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">Email:</span> {userProfile.email || <span className="text-destructive">Not set</span>}
                      </span>
                    </div>
                  </div>
                </div>

                {!hasEmail && (
                  <Alert className="border-amber-500 bg-amber-500/5">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle>Action Required</AlertTitle>
                    <AlertDescription className="mt-2 text-sm">
                      Your profile is missing an email address. Click the button below to add your email and enable admin access.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleUpdateProfile}
                  className="w-full bg-ncrl-blue hover:bg-ncrl-blue/90"
                  size="lg"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {hasEmail ? 'Update Profile Email' : 'Add Email to Profile'}
                </Button>
              </div>
            )}

            {!hasProfile && (
              <Alert className="border-amber-500 bg-amber-500/5">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle>Profile Setup Required</AlertTitle>
                <AlertDescription className="mt-2 text-sm">
                  You need to complete your profile setup first. The profile setup dialog should appear automatically.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="principal-id-denied" className="text-sm font-medium">
                Your Principal ID
              </Label>
              <div className="flex gap-2">
                <Input
                  id="principal-id-denied"
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
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this ID with the administrator if you need assistance.
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard - user is authenticated and is an admin
  return (
    <>
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ncrl-blue">Admin Dashboard</h1>
              <p className="mt-2 text-muted-foreground">
                Manage notices, events, and gallery content
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHelpOpen(!helpOpen)}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </Button>
            </div>
          </div>

          {helpOpen && (
            <Card className="mt-4 border-ncrl-emerald/30 bg-ncrl-emerald/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-ncrl-emerald" />
                  Admin Dashboard Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Creating & Editing Notices</h4>
                  <p className="text-muted-foreground">
                    Use the Notices tab to post important announcements. Select a category (Water Supply, Civic Issues, Meetings, or General), add a title and content, then click "Create Notice". You can edit existing notices by clicking the Edit button in the table.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Managing Events</h4>
                  <p className="text-muted-foreground">
                    In the Events tab, you can create upcoming or past events. Choose an event type, provide details, and mark whether it's a past event. Events will automatically appear in the appropriate section on the Events page. Use the Edit button to update event details or change their status.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Adding Gallery Images</h4>
                  <p className="text-muted-foreground">
                    The Gallery tab lets you add photos to the community gallery. You can use image URLs from the web or upload images to a hosting service. Supported formats include JPEG, PNG, and WebP. For best results, use images at least 1200px wide.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    <strong>Image URL Tips:</strong> You can use direct links to images (ending in .jpg, .png, etc.) or data URLs. Make sure the URL is publicly accessible.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notices">Notices</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="notices" className="space-y-6">
            <NoticesTab />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <EventsTab />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <GalleryTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Setup Dialog */}
      <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {userProfile === null ? 'Complete Your Profile' : 'Update Your Profile'}
            </DialogTitle>
            <DialogDescription>
              {userProfile === null 
                ? 'Please provide your name and email address to continue.'
                : 'Update your profile information. Use the authorized admin email to enable admin features.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email Address</Label>
              <Input
                id="profile-email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <p className="text-xs text-muted-foreground">
                Use <strong className="font-mono">sadashivn.a@gmail.com</strong> to enable admin features
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={saveProfile.isPending}
                className="flex-1 bg-ncrl-blue hover:bg-ncrl-blue/90"
              >
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </Button>
              {userProfile !== null && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProfileSetup(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Notices Tab Component
function NoticesTab() {
  const { data: notices, isLoading } = useNotices();
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice();
  const deleteNotice = useDeleteNotice();

  const [category, setCategory] = useState<NoticeCategory>(NoticeCategory.general);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');

  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !date) {
      toast.error('Please fill in all fields');
      return;
    }

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

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setShowEditDialog(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;

    try {
      await updateNotice.mutateAsync({
        id: editingNotice.id,
        category: editingNotice.category,
        title: editingNotice.title,
        content: editingNotice.content,
        date: editingNotice.date,
      });
      toast.success('Notice updated successfully!');
      setShowEditDialog(false);
      setEditingNotice(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update notice');
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Notice
          </CardTitle>
          <CardDescription>Post important announcements for the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notice-category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as NoticeCategory)}>
                <SelectTrigger id="notice-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NoticeCategory.waterSupply}>Water Supply</SelectItem>
                  <SelectItem value={NoticeCategory.civicIssues}>Civic Issues</SelectItem>
                  <SelectItem value={NoticeCategory.meetings}>Meetings</SelectItem>
                  <SelectItem value={NoticeCategory.general}>General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notice-title">Title</Label>
              <Input
                id="notice-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notice title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notice-content">Content</Label>
              <Textarea
                id="notice-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter notice content"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notice-date">Date</Label>
              <Input
                id="notice-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={createNotice.isPending}
              className="w-full bg-ncrl-blue hover:bg-ncrl-blue/90"
            >
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
          <CardTitle>Existing Notices</CardTitle>
          <CardDescription>Manage all posted notices</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-ncrl-blue" />
            </div>
          ) : !notices || notices.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No notices yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notices.map((notice) => (
                    <TableRow key={notice.id.toString()}>
                      <TableCell>{getNoticeCategoryLabel(notice.category)}</TableCell>
                      <TableCell className="font-medium">{notice.title}</TableCell>
                      <TableCell>{notice.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(notice)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(notice.id)}
                            disabled={deleteNotice.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Notice Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Notice</DialogTitle>
            <DialogDescription>Update the notice details below</DialogDescription>
          </DialogHeader>
          {editingNotice && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-notice-category">Category</Label>
                <Select
                  value={editingNotice.category}
                  onValueChange={(value) =>
                    setEditingNotice({ ...editingNotice, category: value as NoticeCategory })
                  }
                >
                  <SelectTrigger id="edit-notice-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NoticeCategory.waterSupply}>Water Supply</SelectItem>
                    <SelectItem value={NoticeCategory.civicIssues}>Civic Issues</SelectItem>
                    <SelectItem value={NoticeCategory.meetings}>Meetings</SelectItem>
                    <SelectItem value={NoticeCategory.general}>General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notice-title">Title</Label>
                <Input
                  id="edit-notice-title"
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notice-content">Content</Label>
                <Textarea
                  id="edit-notice-content"
                  value={editingNotice.content}
                  onChange={(e) => setEditingNotice({ ...editingNotice, content: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notice-date">Date</Label>
                <Input
                  id="edit-notice-date"
                  type="date"
                  value={editingNotice.date}
                  onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={updateNotice.isPending}
                  className="flex-1 bg-ncrl-blue hover:bg-ncrl-blue/90"
                >
                  {updateNotice.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Notice'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingNotice(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Events Tab Component
function EventsTab() {
  const { data: upcomingEvents, isLoading: upcomingLoading } = useUpcomingEvents();
  const { data: pastEvents, isLoading: pastLoading } = usePastEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [eventType, setEventType] = useState<EventType>(EventType.associationMeeting);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isPast, setIsPast] = useState(false);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const allEvents = [...(upcomingEvents || []), ...(pastEvents || [])];
  const isLoading = upcomingLoading || pastLoading;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !date) {
      toast.error('Please fill in all fields');
      return;
    }

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

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowEditDialog(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      await updateEvent.mutateAsync({
        id: editingEvent.id,
        eventType: editingEvent.eventType,
        title: editingEvent.title,
        description: editingEvent.description,
        date: editingEvent.date,
        isPast: editingEvent.isPast,
      });
      toast.success('Event updated successfully!');
      setShowEditDialog(false);
      setEditingEvent(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event');
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Event
          </CardTitle>
          <CardDescription>Add upcoming or past events</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-type">Event Type</Label>
              <Select value={eventType} onValueChange={(value) => setEventType(value as EventType)}>
                <SelectTrigger id="event-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EventType.associationMeeting}>Association Meeting</SelectItem>
                  <SelectItem value={EventType.culturalProgram}>Cultural Program</SelectItem>
                  <SelectItem value={EventType.welfareDrive}>Welfare Drive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="event-is-past"
                checked={isPast}
                onCheckedChange={setIsPast}
              />
              <Label htmlFor="event-is-past" className="cursor-pointer">
                Mark as past event
              </Label>
            </div>

            <Button
              type="submit"
              disabled={createEvent.isPending}
              className="w-full bg-ncrl-blue hover:bg-ncrl-blue/90"
            >
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
          <CardTitle>Existing Events</CardTitle>
          <CardDescription>Manage all events</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-ncrl-blue" />
            </div>
          ) : allEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No events yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allEvents.map((event) => (
                    <TableRow key={event.id.toString()}>
                      <TableCell>{getEventTypeLabel(event.eventType)}</TableCell>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            event.isPast
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-ncrl-emerald/10 text-ncrl-emerald'
                          }`}
                        >
                          {event.isPast ? 'Past' : 'Upcoming'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(event.id)}
                            disabled={deleteEvent.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update the event details below</DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event-type">Event Type</Label>
                <Select
                  value={editingEvent.eventType}
                  onValueChange={(value) =>
                    setEditingEvent({ ...editingEvent, eventType: value as EventType })
                  }
                >
                  <SelectTrigger id="edit-event-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EventType.associationMeeting}>Association Meeting</SelectItem>
                    <SelectItem value={EventType.culturalProgram}>Cultural Program</SelectItem>
                    <SelectItem value={EventType.welfareDrive}>Welfare Drive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-event-title">Title</Label>
                <Input
                  id="edit-event-title"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-event-description">Description</Label>
                <Textarea
                  id="edit-event-description"
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-event-date">Date</Label>
                <Input
                  id="edit-event-date"
                  type="date"
                  value={editingEvent.date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-event-is-past"
                  checked={editingEvent.isPast}
                  onCheckedChange={(checked) =>
                    setEditingEvent({ ...editingEvent, isPast: checked })
                  }
                />
                <Label htmlFor="edit-event-is-past" className="cursor-pointer">
                  Mark as past event
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={updateEvent.isPending}
                  className="flex-1 bg-ncrl-blue hover:bg-ncrl-blue/90"
                >
                  {updateEvent.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Event'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    setEditingEvent(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Gallery Tab Component
function GalleryTab() {
  const { data: galleryItems, isLoading } = useGalleryItems();
  const addGalleryItem = useAddGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addGalleryItem.mutateAsync({ title, imageUrl, description });
      toast.success('Gallery item added successfully!');
      setTitle('');
      setImageUrl('');
      setDescription('');
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Gallery Item
          </CardTitle>
          <CardDescription>Upload photos to the community gallery</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gallery-title">Title</Label>
              <Input
                id="gallery-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter image title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery-url">Image URL</Label>
              <Input
                id="gallery-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter a direct link to an image (e.g., ending in .jpg, .png, .webp)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery-description">Description</Label>
              <Textarea
                id="gallery-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter image description"
                rows={3}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={addGalleryItem.isPending}
              className="w-full bg-ncrl-blue hover:bg-ncrl-blue/90"
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
          <CardTitle>Gallery Items</CardTitle>
          <CardDescription>Manage gallery photos</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-ncrl-blue" />
            </div>
          ) : !galleryItems || galleryItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No gallery items yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {galleryItems.map((item) => (
                    <TableRow key={item.id.toString()}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="max-w-md truncate">{item.description}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteGalleryItem.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
