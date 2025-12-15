export type FilterType = "text" | "number" | "select" | "date";

export interface Operator {
    value: string;
    label: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    id: string;
    label: string;
    field: string;
    type: FilterType;
    operators: Operator[];
    options?: SelectOption[];
}

export interface FilterRule {
    field: string;
    operator: string;
    value: string | number | string[] | number[];
}

export type AppliedFilters = FilterRule[];

export interface ValueInputProps {
    value: any;
    operator: string;
    onChange: (value: any) => void;
}
