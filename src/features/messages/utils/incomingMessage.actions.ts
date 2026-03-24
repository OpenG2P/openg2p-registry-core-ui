import { NestedValues } from "@/shared/types/types";

export const INCOMING_MESSAGE_ACTIONS = {
    read: "incoming_message.read",
    // list: "incoming_message.list",
} as const;

export type IncomingMessageAction = NestedValues<typeof INCOMING_MESSAGE_ACTIONS>;