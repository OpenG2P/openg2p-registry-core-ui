import { NextRequest } from "next/server";
import { proxyToBackend } from "@/app/api/_lib/backend-proxy";

export async function POST(req: NextRequest) {
	return proxyToBackend({
		req,
		backend: "masterdata",
		targetEndpoint: '/master_data/get_g2p_geo_levels',
		buildPayload: (body) => ({
			pagination_request: {
				current_page: 1,
				page_size: 100,
			},
			request_payload: {
				parent_level_id: body.parent_level_id,
			}
		})
	});
}
