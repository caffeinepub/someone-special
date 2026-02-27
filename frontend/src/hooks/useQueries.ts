import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useActor } from "./useActor";

export function useGetAllHeartNotes() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["heartNotes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHeartNotes();
    },
    enabled: !!actor && !isFetching,
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
  });
}
