import { NestedValues } from "@/shared/types/types";

export const CHANGE_REQUEST_ACTIONS = {
    read: "change_request.read",
    // list: "change_request.list",
    approve: "change_request.approve",
    reject: "change_request.reject",
} as const;

export const CHANGE_REQUEST_GROUPS = {
    canAccess: [
        CHANGE_REQUEST_ACTIONS.read,
        CHANGE_REQUEST_ACTIONS.approve,
        CHANGE_REQUEST_ACTIONS.reject,
    ],
} as const;

export type ChangeRequestAction = NestedValues<typeof CHANGE_REQUEST_ACTIONS>;