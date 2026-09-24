"use server";

import { cookies } from "next/headers";
import { apiFetch, getAuthToken } from "@/lib/api";

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

    const cookieStore = await cookies();
    cookieStore.set("auth_token", jsonData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return jsonData;
}

export async function logoutAccount() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
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

export async function loginWithPin(storeId: string, pin: string) {
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

    const cookieStore = await cookies();
    cookieStore.set(`profile_token_${storeId}`, data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 2 * 60 * 60,
    });
    return true;
}

export async function logoutShopProfile(storeId: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(`profile_token_${storeId}`);
}
