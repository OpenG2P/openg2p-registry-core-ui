import { NextRequest } from "next/server";
import { proxyToBackend } from "@/shared/utils";

export async function GET(req: NextRequest) {
  return proxyToBackend({
    req,
    targetEndpoint: '/register-metadata/get_all_registers',
  });
}
