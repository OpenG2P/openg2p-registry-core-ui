export function prefixBasePath(path: string) {
    return (process.env.NEXT_PUBLIC_BASE_PATH || "") + path;
}

export function prefixBaseApiPath(path: string) {
    return (process.env.NEXT_PUBLIC_BASE_API_PATH || "/api/registry") + path;
}
