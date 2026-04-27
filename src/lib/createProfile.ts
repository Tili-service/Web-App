"use server";
import { cookies } from "next/headers";

export type ProfileWithPin = {
    profile_id: number;
    store_id: number;
    name: string;
    pin: string;
    level_access: number;
    is_active: boolean;
};

export default async function createProfile(
    storeId: number,
    data: { name: string; level_access: number }
): Promise<ProfileWithPin> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileToken}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create profile");
    }

    return res.json();
}
