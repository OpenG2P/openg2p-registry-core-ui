import { NestedValues } from "@/shared/types/types";

export const CONFIGURATION_TABS_ACTIONS = {
    read: "configuration_tabs.read",
    create: "configuration_tabs.create",
    update: "configuration_tabs.update",
    delete: "configuration_tabs.delete",
} as const;

export type ConfigurationTabsAction = NestedValues<typeof CONFIGURATION_TABS_ACTIONS>;