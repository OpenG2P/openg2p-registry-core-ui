import { NestedValues } from "@/shared/types/types";

export const CONFIGURATION_REGISTERS_SCHEMA_ACTIONS = {
    filterSchemaRead: "configuration_registers_filter_schema.read",
    filterSchemaUpdate: "configuration_registers_filter_schema.update",
    searchSchemaRead: "configuration_registers_search_schema.read",
    searchSchemaUpdate: "configuration_registers_search_schema.update",
    deduplicationSchemaRead: "configuration_registers_deduplication_schema.read",
    deduplicationSchemaUpdate: "configuration_registers_deduplication_schema.update",
} as const;

export type ConfigurationRegistersSchemaAction = NestedValues<typeof CONFIGURATION_REGISTERS_SCHEMA_ACTIONS>;