import { NextResponse } from "next/server";

export async function POST() {
    return NextResponse.json({
            pagination_response: null,
            response_payload: {
                register_id: "25d460ac-50cf-4386-b486-23a4e9b7e254",
                internal_record_id: "1",
                number_of_pending_change_logs: 10,
            },
        },
    );
}
