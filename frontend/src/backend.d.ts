import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HeartNote {
    id: string;
    creator: string;
    message: string;
    timestamp: bigint;
    position: [number, number];
}
export interface backendInterface {
    addHeartNote(id: string, creator: string, message: string, timestamp: bigint, position: [number, number]): Promise<boolean>;
    deleteHeartNote(id: string): Promise<void>;
    editHeartNote(id: string, newMessage: string): Promise<void>;
    getAllHeartNotes(): Promise<Array<HeartNote>>;
    getHeartNote(id: string): Promise<HeartNote>;
    getHeartNotesForUser(creator: string): Promise<Array<HeartNote>>;
    getPersonalGreetingMessage(): Promise<string>;
    updatePersonalGreetingMessage(newMessage: string): Promise<void>;
    updatePosition(id: string, newPosition: [number, number]): Promise<void>;
}
