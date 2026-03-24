import { NestedValues } from "@/shared/types/types";

export const CONFIGURATION_SECTIONS_ACTIONS = {
    read: "configuration_sections.read",
    create: "configuration_sections.create",
    update: "configuration_sections.update",
    delete: "configuration_sections.delete",
} as const;

export type ConfigurationSectionsAction = NestedValues<typeof CONFIGURATION_SECTIONS_ACTIONS>;