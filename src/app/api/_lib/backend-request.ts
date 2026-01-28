
import "server-only";
import { randomUUID } from "crypto";
import { BackendRequest, RequestBody, RequestHeader } from "./backend-types";
import { BACKEND_CONFIG } from "./backend-config";

export function generateRequestId(): string {
  return randomUUID();
}

export function generateTimestamp(): string {
  return new Date().toISOString();
}

export function createBackendRequest(payload: RequestBody): BackendRequest {

  const requestHeader: RequestHeader = {
    sender_app_mnemonic: BACKEND_CONFIG.appMnemonic,
    sender_app_url: BACKEND_CONFIG.appUrl,
    request_id: generateRequestId(),
    request_timestamp: generateTimestamp(),
  };

  const requestBody: RequestBody = payload;

  return {
    request_header: requestHeader,
    request_body: requestBody,
  };
}
