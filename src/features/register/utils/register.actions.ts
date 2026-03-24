import { NestedValues } from "@/shared/types/types";

export const REGISTER_ACTIONS = {
    read: "register.read",
    // list: "register.list",
    update: "register.update",
    importVc: "register.import_vc",
} as const;

export type RegisterAction = NestedValues<typeof REGISTER_ACTIONS>;