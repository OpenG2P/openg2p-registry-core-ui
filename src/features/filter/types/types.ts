export type MatchType = "all" | "any";

export interface FilterOperator {
    value: string;
    label: string;
}

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    id: string;
    label: string;
    field: string;
    type: "text" | "number" | "select" | "multi_select" | "date" | "tags";
    operators: FilterOperator[];
    options?: FilterOption[];
    allow_custom?: boolean;
}

export interface FilterRule {
    id: string;
    field: string;
    operator: string;
    value?: any;
}

export interface FilterState {
    filters: FilterRule[];
    match: MatchType;
}
