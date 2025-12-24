import { NextRequest, NextResponse } from "next/server";
import {
  createBackendRequest,
  BACKEND_CONFIG,
  BackendResponse,
} from "@/shared/types";

/** Mock tabs response */
const MOCK_TABS_DATA = {
  tabs: [
    {
      tab_id: "tab:farmer.profile",
      register_id: "farmer-register-001",
      tab_label: "Farmer Profile",
      tab_order: 1,
    },
    {
      tab_id: "tab:farm.details",
      register_id: "farmer-farm-register-001",
      tab_label: "Farm Details",
      tab_order: 2,
    },
  ],
};


export async function GET(req: NextRequest) {
  try {
    /*
    const backendRequest = createBackendRequest({
      pagination_request: undefined,
      request_payload: {},
    });

    const backendUrl = `${BACKEND_CONFIG.apiUrl}/register/get_tabs`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendRequest),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend HTTP error ${response.status}` },
        { status: response.status }
      );
    }

    const backendResponse: BackendResponse = await response.json();

    if (backendResponse.response_header.response_status === "ERROR") {
      return NextResponse.json(
        { error: backendResponse.response_header.response_error_message },
        { status: 400 }
      );
    }

    const tabs = backendResponse.response_body.response_payload;
    return NextResponse.json(tabs,
    headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
    },
    );
    */

    /** Mock response */
    // HTTP cache for browser/CDN: 10 min + background revalidation
    return NextResponse.json(MOCK_TABS_DATA, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
