"use server";
import { cookies } from "next/headers";
import { Catalog } from "./getCatalogs";

export default async function updateCatalog(
    catalogId: number,
    storeId: number,
    data: { name?: string; description?: string }
): Promise<Catalog> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/catalog/${catalogId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileToken}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update catalog");
    }

    return res.json();
}
