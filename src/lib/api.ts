export { getAuthToken, getProfileToken } from "@/lib/cookies";

type ApiFetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    token?: string;
    body?: unknown;
    errorMessage?: string;
    cache?: RequestCache;
};

export async function apiFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
    const { method = "GET", token, body, errorMessage = "Request failed", cache } = opts;

    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${process.env.BACKEND_GO}${path}`, {
        method,
        headers,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        ...(cache ? { cache } : {}),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorMessage);
    }

    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
}
