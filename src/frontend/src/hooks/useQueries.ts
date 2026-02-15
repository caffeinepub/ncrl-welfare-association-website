import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { NoticeCategory, EventType, MembershipType, PaymentType, UserProfile } from '../backend';
import { normalizeBackendError } from '../utils/backendErrors';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      // Invalidate both profile and admin queries after profile save
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'isCallerAdmin'] });
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

// Admin Check Query
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['admin', 'isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 30000, // 30 seconds
  });
}

// Notice Queries
export function useNotices() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      if (!actor) return [];
      const allNotices = await Promise.all([
        actor.getNoticesByCategory(NoticeCategory.waterSupply),
        actor.getNoticesByCategory(NoticeCategory.civicIssues),
        actor.getNoticesByCategory(NoticeCategory.meetings),
        actor.getNoticesByCategory(NoticeCategory.general),
      ]);
      return allNotices.flat();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestNotices(limit: number = 3) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['notices', 'latest', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLatestNotices(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, title, content, date }: { category: NoticeCategory; title: string; content: string; date: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createNotice(category, title, content, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

export function useUpdateNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, category, title, content, date }: { id: bigint; category: NoticeCategory; title: string; content: string; date: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNotice(id, category, title, content, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

export function useDeleteNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNotice(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

// Event Queries
export function useUpcomingEvents() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUpcomingEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePastEvents() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['events', 'past'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPastEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventType, title, description, date, isPast }: { eventType: EventType; title: string; description: string; date: string; isPast: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEvent(eventType, title, description, date, isPast);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'past'] });
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

export function useUpdateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, eventType, title, description, date, isPast }: { id: bigint; eventType: EventType; title: string; description: string; date: string; isPast: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEvent(id, eventType, title, description, date, isPast);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'past'] });
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', 'upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['events', 'past'] });
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

// Gallery Queries
export function useGalleryItems() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, imageUrl, description }: { title: string; imageUrl: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addGalleryItem(title, imageUrl, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGalleryItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

// Membership Queries
export function useSubmitMembershipRegistration() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, address, email, phone, membershipType }: { name: string; address: string; email: string; phone: string; membershipType: MembershipType }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitMembershipRegistration(name, address, email, phone, membershipType);
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

// Payment Queries
export function useSubmitPayment() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ memberId, amount, paymentType, date }: { memberId: bigint; amount: bigint; paymentType: PaymentType; date: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPayment(memberId, amount, paymentType, date);
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

// Contact Queries
export function useSubmitContactForm() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, email, message, date }: { name: string; email: string; message: string; date: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitContactForm(name, email, message, date);
    },
    onError: (error: any) => {
      throw new Error(normalizeBackendError(error));
    },
  });
}

export function useContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) return null;
      const [address, phone, email] = await actor.getContactInfo();
      return { address, phone, email };
    },
    enabled: !!actor && !isFetching,
  });
}
