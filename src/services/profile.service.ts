"use server";

import { apiFetch, getProfileToken } from "@/lib/api";
import type { Profile, ProfileWithPin } from "@/lib/types";

export async function getProfiles(storeId: string): Promise<Profile[]> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    return apiFetch<Profile[]>(`/profile/allProfilesByStoreId/${storeId}`, {
        token,
        errorMessage: "Failed to fetch profiles",
    });
}

export async function createProfile(
    storeId: string,
    data: { name: string; level_access: number }
): Promise<ProfileWithPin> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    return apiFetch<ProfileWithPin>("/profile", {
        method: "POST",
        token,
        body: data,
        errorMessage: "Failed to create profile",
    });
}

export async function updateProfile(
    profileId: string,
    storeId: string,
    data: { name?: string; pin?: string; level_access?: number; is_active?: boolean }
): Promise<Profile> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    return apiFetch<Profile>(`/profile/updateProfile/${profileId}/${storeId}`, {
        method: "PUT",
        token,
        body: data,
        errorMessage: "Failed to update profile",
    });
}

export async function deleteProfile(profileId: string, storeId: string): Promise<void> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    await apiFetch<void>(`/profile/${profileId}`, {
        method: "DELETE",
        token,
        errorMessage: "Failed to delete profile",
    });
}
