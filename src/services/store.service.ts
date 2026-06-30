"use server";

import { apiFetch, getAuthToken } from "@/lib/api";
import type { Shop } from "@/lib/types";

export async function getShops(): Promise<Shop[]> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Unauthorized: missing auth token");
    }

    const data = await apiFetch<Shop[]>("/store/me", { token, errorMessage: "Failed to fetch shops" });
    return Array.isArray(data) ? data : [];
}
