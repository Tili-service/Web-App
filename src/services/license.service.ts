"use server";

import { apiFetch, getAuthToken } from "@/lib/api";
import type { License } from "@/lib/types";

export async function getLicenses(): Promise<License[]> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Unauthorized: missing auth token");
    }

    return apiFetch<License[]>("/licences", { token, errorMessage: "Failed to fetch licenses" });
}

export async function handleRefundLicense(licenceId: string) {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Unauthorized: missing auth token");
    }

    try {
        await apiFetch<void>(`/licences/refund?licenceId=${encodeURIComponent(licenceId)}`, {
            method: "POST",
            token,
            errorMessage: "Failed to refund license",
        });
    } catch (err) {
        console.error("Error refunding license:", err);
        throw err;
    }
}
