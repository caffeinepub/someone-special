import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useActor } from "./useActor";

export function useGetAllHeartNotes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["heartNotes"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getAllHeartNotes();
        return result;
      } catch (err) {
        console.error("Failed to fetch heart notes:", err);
        throw err;
      }
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function useAddHeartNote() {
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const actorRef = useRef(actor);
  actorRef.current = actor;

  return useMutation({
    mutationFn: async (note: {
      id: string;
      creator: string;
      message: string;
      timestamp: bigint;
      position: [number, number];
    }) => {
      const currentActor = actorRef.current;
      if (!currentActor) throw new Error("Actor not initialized");
      const result = await currentActor.addHeartNote(
        note.id,
        note.creator,
        note.message,
        note.timestamp,
        note.position
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heartNotes"] });
    },
    onError: (err) => {
      console.error("Failed to add heart note:", err);
    },
  });
}

export function useEditHeartNote() {
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const actorRef = useRef(actor);
  actorRef.current = actor;

  return useMutation({
    mutationFn: async (note: { id: string; newMessage: string }) => {
      const currentActor = actorRef.current;
      if (!currentActor) throw new Error("Actor not initialized");
      await currentActor.editHeartNote(note.id, note.newMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heartNotes"] });
    },
    onError: (err) => {
      console.error("Failed to edit heart note:", err);
    },
  });
}

export function useDeleteHeartNote() {
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const actorRef = useRef(actor);
  actorRef.current = actor;

  return useMutation({
    mutationFn: async (id: string) => {
      const currentActor = actorRef.current;
      if (!currentActor) throw new Error("Actor not initialized");
      await currentActor.deleteHeartNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heartNotes"] });
    },
    onError: (err) => {
      console.error("Failed to delete heart note:", err);
    },
  });
}

export function useUpdateHeartPosition() {
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const actorRef = useRef(actor);
  actorRef.current = actor;

  return useMutation({
    mutationFn: async (params: { id: string; newPosition: [number, number] }) => {
      const currentActor = actorRef.current;
      if (!currentActor) throw new Error("Actor not initialized");
      await currentActor.updatePosition(params.id, params.newPosition);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heartNotes"] });
    },
    onError: (err) => {
      console.error("Failed to update heart position:", err);
    },
  });
}

export function usePersonalGreeting() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["personalGreeting"],
    queryFn: async () => {
      if (!actor) return "";
      return actor.getPersonalGreetingMessage();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useUpdatePersonalGreeting() {
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const actorRef = useRef(actor);
  actorRef.current = actor;

  return useMutation({
    mutationFn: async (newMessage: string) => {
      const currentActor = actorRef.current;
      if (!currentActor) throw new Error("Actor not initialized");
      await currentActor.updatePersonalGreetingMessage(newMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalGreeting"] });
    },
    onError: (err) => {
      console.error("Failed to update personal greeting:", err);
    },
  });
}
