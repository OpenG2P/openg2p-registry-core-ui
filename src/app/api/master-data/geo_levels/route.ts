import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(req: NextRequest) {
	return proxyToBackend({
		req,
		backend: "masterdata",
		targetEndpoint: '/geo/get_g2p_geo_levels',
		buildPayload: (body) => {
			// Extract pagination_request and request payload
			const { pagination_request, ...requestPayload } = body;
			
			return {
				// Include pagination_request if provided, otherwise use defaults
				pagination_request: pagination_request || {
					current_page: 1,
					page_size: 100, // Default page size for geo APIs
				},
				request_payload: {
					parent_level_id: requestPayload.parent_level_id,
				}
			};
		}
	});
}
