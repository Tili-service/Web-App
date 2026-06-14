"use server";
import { cookies } from "next/headers";

export default async function deleteItem(
    itemId: number,
    storeId: number
): Promise<void> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/item/${itemId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${profileToken}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete item");
    }
}
