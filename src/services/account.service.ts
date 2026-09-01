"use server";

import { apiFetch, getAuthToken } from "@/lib/api";
import { clearAuthCookie } from "@/lib/cookies";
import type { Account } from "@/lib/types";

export async function getAccount(): Promise<Account> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Session expirée. Reconnectez-vous.");
    }

    return apiFetch<Account>("/account", { token, errorMessage: "Impossible de récupérer le compte" });
}

export async function updateAccount(data: { name?: string; email?: string; password?: string }): Promise<Account> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Session expirée. Reconnectez-vous.");
    }

    return apiFetch<Account>("/account", {
        method: "PUT",
        token,
        body: data,
        errorMessage: "Impossible de modifier le compte",
    });
}

export async function deleteAccount(): Promise<void> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Session expirée. Reconnectez-vous.");
    }

    await apiFetch<void>("/account", {
        method: "DELETE",
        token,
        errorMessage: "Impossible de supprimer le compte",
    });

    await clearAuthCookie();
}
