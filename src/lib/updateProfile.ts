"use server";
import { cookies } from "next/headers";
import { Profile } from "./getProfiles";

export default async function updateProfile(
    profileId: number,
    storeId: number,
    data: { name?: string; pin?: string; level_access?: number; is_active?: boolean }
): Promise<Profile> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(
        `${process.env.BACKEND_GO}/profile/updateProfile/${profileId}/${storeId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${profileToken}`,
            },
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update profile");
    }

    return res.json();
}
