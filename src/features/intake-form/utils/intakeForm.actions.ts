import { NestedValues } from "@/shared/types/types";

export const INTAKE_FORM_ACTIONS = {
    view: "intakeForm:view",
    create: "intakeForm:create"
} as const;

export type IntakeFormAction = NestedValues<typeof INTAKE_FORM_ACTIONS>;