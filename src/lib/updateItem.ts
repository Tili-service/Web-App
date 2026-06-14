"use server";
import { cookies } from "next/headers";
import { Item } from "./getItems";

export default async function updateItem(
    itemId: number,
    storeId: number,
    data: { name?: string; price?: number; tax?: number; categorie_id?: number }
): Promise<Item> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/item/${itemId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileToken}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update item");
    }

    return res.json();
}
