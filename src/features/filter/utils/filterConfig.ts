import { FilterConfig } from "../types/types";

export async function fetchFilterConfig(): Promise<FilterConfig[]> {
    try {
        const response = await fetch('/api/filters');
        if (!response.ok) throw new Error('Failed to fetch filters');
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error fetching filter config:', error);
        return [
            {
                id: "name",
                label: "Name",
                field: "name",
                type: "text",
                operators: [
                    { value: "contains", label: "Contains" },
                    { value: "equals", label: "Equals" },
                    { value: "starts_with", label: "Starts with" },
                    { value: "ends_with", label: "Ends with" }
                ]
            }
        ];
    }
};