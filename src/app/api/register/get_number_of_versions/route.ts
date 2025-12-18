import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({
            pagination_response: null,
            response_payload: {
                register_id: "25d460ac-50cf-4386-b486-23a4e9b7e254",
                internal_record_id: "18b442ea-2d5d-4186-bd6a-7111822ac2e9",
                number_of_versions: 1,
                last_updated_by: "seeder",
                last_updated_at: "2025-12-17T21:17:20.215562",
                last_approved_by: "system",
                last_approved_at: "2025-12-17T21:17:20.215562",
            },
        },
    );
}
