import { NestedValues } from "@/shared/types/types";

export const INTAKE_FORM_ACTIONS = {
    read: "intake_form.read",
    // list: "intake_form.list",
    create: "intake_form.create",
    update: "intake_form.update",
    submit: "intake_form.submit",
} as const;

export type IntakeFormAction = NestedValues<typeof INTAKE_FORM_ACTIONS>;