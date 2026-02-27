import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { HeartNote } from '../backend';

export function useGetAllHeartNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<HeartNote[]>({
    queryKey: ['heartNotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHeartNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddHeartNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: {
      id: string;
      creator: string;
      message: string;
      timestamp: bigint;
      position: [number, number];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addHeartNote(
        note.id,
        note.creator,
        note.message,
        note.timestamp,
        note.position
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heartNotes'] });
    },
  });
}

export function useEditHeartNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newMessage }: { id: string; newMessage: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.editHeartNote(id, newMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heartNotes'] });
    },
  });
}

export function useDeleteHeartNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteHeartNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heartNotes'] });
    },
  });
}

export function usePersonalGreeting() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['personalGreeting'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getPersonalGreetingMessage();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdatePersonalGreeting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMessage: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.updatePersonalGreetingMessage(newMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalGreeting'] });
    },
  });
}
