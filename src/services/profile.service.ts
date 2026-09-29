"use server";

import { apiFetch, getProfileToken } from "@/lib/api";
import type { Profile, ProfileWithPin } from "@/lib/types";

export async function getProfiles(storeId: string): Promise<Profile[]> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    return apiFetch<Profile[]>(`/profile/allProfilesByStoreId/${storeId}`, {
        token,
        errorMessage: "Impossible de récupérer les profils",
    });
}

export async function createProfile(
    storeId: string,
    data: { name: string; level_access: number }
): Promise<ProfileWithPin> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    return apiFetch<ProfileWithPin>("/profile", {
        method: "POST",
        token,
        body: data,
        errorMessage: "Impossible de créer le profil",
    });
}

export async function updateProfile(
    profileId: string,
    storeId: string,
    data: { name?: string; pin?: string; level_access?: number; is_active?: boolean }
): Promise<Profile> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    return apiFetch<Profile>(`/profile/updateProfile/${profileId}/${storeId}`, {
        method: "PUT",
        token,
        body: data,
        errorMessage: "Impossible de modifier le profil",
    });
}

export async function deleteProfile(profileId: string, storeId: string): Promise<void> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    await apiFetch<void>(`/profile/${profileId}`, {
        method: "DELETE",
        token,
        errorMessage: "Impossible de supprimer le profil",
    });
}
