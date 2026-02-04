import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(req: NextRequest) {

	return proxyToBackend({
		req,
		targetEndpoint: '/register-metadata/get_register_section_ui_schema',
		buildPayload: (body) => ({
			pagination_request: {
				current_page: 1,
				page_size: 1,
				sort_by: "string",
				search_text: "string",
			},
			request_payload: {
				section_id: body.section_id,
			},
		}),
	});
}
