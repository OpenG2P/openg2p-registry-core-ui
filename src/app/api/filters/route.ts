import { NextResponse } from 'next/server';

export async function GET() {
    const filters = [
        {
            id: "date",
            label: "Date",
            type: "date_range",
            fields: [
                { name: "From", type: "date" },
                { name: "To", type: "date" }
            ]
        },
        {
            id: "name",
            label: "Name",
            type: "text",
            fields: [
                { name: "Name", type: "text", placeholder: "Enter name..." }
            ]
        },
        {
            id: "region",
            label: "Region",
            type: "text",
            fields: [
                { name: "Region", type: "text", placeholder: "Enter region..." }
            ]
        }
    ];

    return NextResponse.json(filters);
}