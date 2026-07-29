"use server";

import { apiFetch, getAuthToken } from "@/lib/api";
import { setAuthCookie, clearAuthCookie, setProfileCookie, clearProfileCookie } from "@/lib/cookies";

export async function createAccount(data: { email: string; name: string; password: string }) {
    await apiFetch<void>("/account", {
        method: "POST",
        body: data,
        errorMessage: "Failed to create account",
    });
    return { success: true };
}

export async function loginAccount(data: { email: string; password: string }) {
    const jsonData = await apiFetch<{ token: string; account?: unknown }>("/account/login", {
        method: "POST",
        body: data,
        errorMessage: "Failed to login",
    });

    await setAuthCookie(jsonData.token);

    return jsonData;
}

export async function logoutAccount() {
    await clearAuthCookie();
}

export async function isAuthenticated() {
    const token = await getAuthToken();
    if (!token) return false;

    try {
        await apiFetch<void>("/account", { token });
        return true;
    } catch (error) {
        console.error("Auth check failed", error);
        return false;
    }
}

export async function loginWithPin(storeId: number, pin: string) {
    const data = await apiFetch<{ token: string; profile: { level_access: number } }>(
        "/profile/login/pin",
        {
            method: "POST",
            body: { store_id: storeId, pin },
            errorMessage: "Pin invalide",
        }
    );

    if (data.profile.level_access > 2) {
        throw new Error("Droits administrateur requis pour accéder à cet espace.");
    }

    await setProfileCookie(storeId, data.token);
    return true;
}

export async function logoutShopProfile(storeId: number): Promise<void> {
    await clearProfileCookie(storeId);
}
