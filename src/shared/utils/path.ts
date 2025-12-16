export function prefixBasePath(path: string) {
    return (process.env.NEXT_PUBLIC_BASE_PATH || "") + path;
}

export function prefixBaseApiPath(path: string) {
    return (process.env.NEXT_PUBLIC_BASE_API_PATH || "http://localhost:8000") + path;
}
