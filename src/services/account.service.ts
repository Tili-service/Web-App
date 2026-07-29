"use server";

import { apiFetch, getAuthToken } from "@/lib/api";
import { clearAuthCookie } from "@/lib/cookies";
import type { Account } from "@/lib/types";

export async function getAccount(): Promise<Account> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Not authenticated");
    }

    return apiFetch<Account>("/account", { token, errorMessage: "Failed to fetch account" });
}

export async function updateAccount(data: { name?: string; email?: string; password?: string }): Promise<Account> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Not authenticated");
    }

    return apiFetch<Account>("/account", {
        method: "PUT",
        token,
        body: data,
        errorMessage: "Failed to update account",
    });
}

export async function deleteAccount(): Promise<void> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Not authenticated");
    }

    await apiFetch<void>("/account", {
        method: "DELETE",
        token,
        errorMessage: "Failed to delete account",
    });

    await clearAuthCookie();
}
