import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { NoticeCategory, MembershipType, EventType, GalleryItem } from '../backend';

export function useNotices(category: NoticeCategory) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['notices', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNoticesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLatestNotices(limit: number = 5) {
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

export function useUpcomingEventsPreview(limit: number = 3) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['events', 'upcoming', 'preview', limit],
    queryFn: async () => {
      if (!actor) return [];
      const events = await actor.getUpcomingEvents();
      return events.slice(0, limit);
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

export function useGalleryItems() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['gallery', 'items'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const items = await actor.getGalleryItems();
      return items;
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function useContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['contact', 'info'],
    queryFn: async () => {
      if (!actor) return { address: '', phone: '', email: '' };
      const [address, phone, email] = await actor.getContactInfo();
      return { address, phone, email };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['admin', 'check'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
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
    mutationFn: async (profile: { name: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSubmitMembership() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      address: string;
      email: string;
      phone: string;
      membershipType: MembershipType;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitMembershipRegistration(
        data.name,
        data.address,
        data.email,
        data.phone,
        data.membershipType
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
    },
  });
}

export function useSubmitContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      const date = new Date().toISOString();
      return actor.submitContactForm(data.name, data.email, data.message, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// Admin mutation hooks
export function useCreateNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      category: NoticeCategory;
      title: string;
      content: string;
      date: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createNotice(data.category, data.title, data.content, data.date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
}

export function useDeleteNotice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteNotice(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      eventType: EventType;
      title: string;
      description: string;
      date: string;
      isPast: boolean;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createEvent(
        data.eventType,
        data.title,
        data.description,
        data.date,
        data.isPast
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useAddGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; imageUrl: string; description: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addGalleryItem(data.title, data.imageUrl, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery', 'items'] });
    },
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteGalleryItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery', 'items'] });
    },
  });
}
