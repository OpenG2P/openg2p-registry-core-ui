import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/intake-form-data/save_submission_draft",
        buildPayload: (body) => ({
            pagination_request: undefined,
            request_payload: {
                submission_id: body.submission_id,
                register_id: body.register_id,
                tab_id: body.tab_id,
                foundational_id: body.foundational_id,
                link_foundational_id: body.link_foundational_id,
                no_of_verifications_required: body.no_of_verifications_required,
                section_payloads: body.section_payloads,
            },
        }),
    });
}

