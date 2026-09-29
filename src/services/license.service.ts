"use server";

import { apiFetch, getAuthToken } from "@/lib/api";
import type { License } from "@/lib/types";

export async function getLicenses(): Promise<License[]> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Session expirée. Reconnectez-vous.");
    }

    return apiFetch<License[]>("/licences", { token, errorMessage: "Impossible de récupérer les licences" });
}

export async function handleRefundLicense(licenceId: string) {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Session expirée. Reconnectez-vous.");
    }

    try {
        await apiFetch<void>(`/licences/refund?licenceId=${encodeURIComponent(licenceId)}`, {
            method: "POST",
            token,
            errorMessage: "Impossible de rembourser la licence",
        });
    } catch (err) {
        console.error("Error refunding license:", err);
        throw err;
    }
}
