import { NestedValues } from "@/shared/types/types";

export const CONFIGURATION_REGISTRY_ACTIONS = {
    read: "configuration_registry.read",
    update: "configuration_registry.update",
} as const;

export type ConfigurationRegistryAction = NestedValues<typeof CONFIGURATION_REGISTRY_ACTIONS>;