"use server";

import { apiFetch } from "@/lib/api";
import { setAuthCookie, clearAuthCookie, setProfileCookie } from "@/lib/cookies";

export async function createAccount(data: { email: string; name: string; password: string }) {
    await apiFetch<void>("/account", {
        method: "POST",
        body: data,
        errorMessage: "Impossible de créer le compte",
    });
    return { success: true };
}

export async function loginAccount(data: { email: string; password: string }) {
    const jsonData = await apiFetch<{ token: string; account?: { name: string; email: string } }>(
        "/account/login",
        {
            method: "POST",
            body: data,
            errorMessage: "Échec de la connexion. Vérifiez vos identifiants.",
        }
    );

    await setAuthCookie(jsonData.token);

    return jsonData;
}

export async function logoutAccount() {
    await clearAuthCookie();
}

export async function loginWithPin(storeId: number, pin: string) {
    const data = await apiFetch<{ token: string; profile: { level_access: number } }>(
        "/profile/login/pin",
        {
            method: "POST",
            body: { store_id: storeId, pin },
            errorMessage: "PIN invalide",
        }
    );

    if (data.profile.level_access > 2) {
        throw new Error("Droits administrateur requis pour accéder à cet espace.");
    }

    await setProfileCookie(storeId, data.token);
    return true;
}
