import { NestedValues } from "@/shared/types/types";

export const VERIFICATION_ACTIONS = {
    // list: "verification.list",
    read: "verification.read",
    create: "verification.create",
} as const;

export type VerificationAction = NestedValues<typeof VERIFICATION_ACTIONS>;