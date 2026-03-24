import { NestedValues } from "@/shared/types/types";

export const CONFIGURATION_REGISTERS_ACTIONS = {
    read: "configuration_registers.read",
    // list: "configuration_registers.list",
    create: "configuration_registers.create",
    update: "configuration_registers.update",
    delete: "configuration_registers.delete",
} as const;

export type ConfigurationRegistersAction = NestedValues<typeof CONFIGURATION_REGISTERS_ACTIONS>;