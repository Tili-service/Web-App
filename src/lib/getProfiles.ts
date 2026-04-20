"use server";
import { cookies } from "next/headers";

export type Profile = {
    profile_id: number;
    store_id: number;
    name: string;
    level_access: number;
    is_active: boolean;
};

export default async function getProfiles(storeId: number): Promise<Profile[]> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/profile/allProfilesByStoreId/${storeId}`, {
        headers: {
            Authorization: `Bearer ${profileToken}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch profiles");
    }

    return res.json();
}
