export const REQUEST_HEADER = {
    sender_app_mnemonic: "postman",
    sender_app_url: "http://localhost",
};

export const createRequestBody = (payload: any) => ({
    request_body: {
        request_payload: payload,
    },
});

export const createFullRequestBody = (payload: any) => ({
    request_header: {
        ...REQUEST_HEADER,
        request_id: crypto.randomUUID(),
        request_timestamp: new Date().toISOString(),
    },
    request_body: {
        request_payload: payload,
    },
});

export const createPostOptions = (body: any): RequestInit => ({
    method: "POST",
    body: JSON.stringify(body),
});