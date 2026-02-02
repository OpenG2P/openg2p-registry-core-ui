import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(request: NextRequest) {
	return proxyToBackend({
		req: request,
		targetEndpoint: "/registry-config/create_registry_configuration",
		buildPayload: (jsonBody) => ({
			pagination_request: {
				current_page: 1,
				page_size: 1,
				sort_by: "",
				filter_by: undefined,
				search_text: ""
			},
			request_payload: {
				registry_name: jsonBody.registry_name,
				registry_logo: jsonBody.registry_logo,
			},
		}),
	});
}

