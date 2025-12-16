import { randomUUID } from 'crypto';

export const BACKEND_CONFIG = {
  apiUrl: process.env.BACKEND_API_URL || 'http://localhost:8000',
  appMnemonic: process.env.APP_MNEMONIC || 'registry-ui',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
};

export interface RequestHeader {
  sender_app_mnemonic: string;
  sender_app_url: string;
  request_id: string;
  request_timestamp: string;
}

export interface PaginationRequest {
  current_page?: number;
  page_size?: number;
}
export interface RequestPayload {
  request_payload: any
}
export interface RequestBody {
  pagination_request: PaginationRequest
  request_payload: RequestPayload;

}

export interface BackendRequest {
  request_header: RequestHeader;
  request_body: RequestBody;
}

export interface ResponseHeader {
  request_id: string;
  response_status: string;
  response_error_code: string;
  response_error_message: string;
  response_timestamp: string;
}

export interface PaginationResponse {
  current_page?: number;
  page_size?: number;
}
export interface ResponsePayload {
  response_payload: any
}
export interface ResponseBody {
  pagination_response: PaginationResponse;
  response_payload: ResponsePayload;
}

export interface BackendResponse {
  response_header: ResponseHeader;
  response_body: ResponseBody;
}

export function generateRequestId(): string {
  return randomUUID();
}

export function generateTimestamp(): string {
  return new Date().toISOString();
}

export function createBackendRequest(pagination_request: PaginationRequest, request_payload: RequestPayload): BackendRequest {

  const requestHeader: RequestHeader = {
    sender_app_mnemonic: BACKEND_CONFIG.appMnemonic,
    sender_app_url: BACKEND_CONFIG.appUrl,
    request_id: generateRequestId(),
    request_timestamp: generateTimestamp(),
  };

  const requestBody: RequestBody = {
    pagination_request: pagination_request,
    request_payload: request_payload,
  };

  return {
    request_header: requestHeader,
    request_body: requestBody,
  };
}


