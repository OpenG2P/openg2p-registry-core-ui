import { NextRequest } from "next/server";
import { proxyToBackend } from "@/shared/utils";

export async function POST(req: NextRequest) {
    return proxyToBackend({
        req,
        targetEndpoint: "/register/reject_change_request",
        buildPayload: (body) => ({
            request_payload: {
                change_request_id: body.change_request_id,
                rejection_reason: body.rejection_reason?.trim(),
            }
        })
    });
}
