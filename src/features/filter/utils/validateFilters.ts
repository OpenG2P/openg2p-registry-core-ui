import { FilterRule, FilterConfig } from "@/features/filter/types";

export interface FilterError {
    filterId: string;
    message: string;
}

export function validateFilters(
    filters: FilterRule[],
    configMap: Record<string, FilterConfig>
): FilterError[] {
    const errors: FilterError[] = [];

    for (const filter of filters) {
        const config = configMap[filter.field];
        if (!config) continue;

        const { operator, value } = filter;
        const { type, id } = config;

        if (operator === "between" && Array.isArray(value)) {
            const [a, b] = value;

            if (!a || !b) continue;

            if (type === "date" && a > b) {
                errors.push({
                    filterId: id,
                    message: "Start date must be before or equal to end date",
                });
            }

            if (type === "number" && Number(a) > Number(b)) {
                errors.push({
                    filterId: id,
                    message: "Min value must be less than or equal to max value",
                });
            }
        }
    }

    return errors;
}
