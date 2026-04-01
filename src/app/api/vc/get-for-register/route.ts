import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
    return proxyToBackend({
        req: request,
        targetEndpoint: "/vc-config/get_vc_configuration_for_register",

        buildPayload: (body) => ({
            pagination_request: {
                current_page: body.current_page ?? 1,
                page_size: body.page_size ?? 20,
                sort_by: body.sort_by ?? "",
                filter_by: body.filter_by ?? "",
                search_text: body.search_text ?? "",
            },
            request_payload: {
                register_id: body.register_id,
                vc_config_id: body.vc_config_id,
                vc_mnemonic: body.vc_mnemonic,
                descriptor_schema: body.descriptor_schema,
            },
        }),

    });
}
