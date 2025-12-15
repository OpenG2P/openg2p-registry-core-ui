export const fetchFilterConfig = async () => {
    try {
        const response = await fetch('/api/filters');
        if (!response.ok) throw new Error('Failed to fetch filters');
        return await response.json();
    } catch (error) {
        console.error('Error fetching filter config:', error);
        return [
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
            }
        ];
    }
};
