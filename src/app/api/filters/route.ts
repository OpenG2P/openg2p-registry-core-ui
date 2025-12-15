import { FilterConfig } from '@/features/filter/types/types';
import { NextResponse } from 'next/server';

export async function GET() {
    const filters: FilterConfig[] = [
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
        },
        {
            id: "age",
            label: "Age",
            field: "age",
            type: "number",
            operators: [
                { value: "equals", label: "Equals" },
                { value: "greater_than", label: "Greater than" },
                { value: "less_than", label: "Less than" },
                { value: "between", label: "Between" }
            ]
        },
        {
            id: "status",
            label: "Status",
            field: "status",
            type: "select",
            operators: [
                { value: "equals", label: "Is" },
                { value: "not_equals", label: "Is not" }
            ],
            options: [
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "pending", label: "Pending" },
                { value: "archived", label: "Archived" }
            ]
        },
        {
            id: "created_date",
            label: "Created Date",
            field: "created_at",
            type: "date",
            operators: [
                { value: "equals", label: "On" },
                { value: "greater_than", label: "After" },
                { value: "less_than", label: "Before" },
                { value: "between", label: "Between" }
            ]
        },
    ];

    return NextResponse.json(filters);
}