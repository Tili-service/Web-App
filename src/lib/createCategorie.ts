"use server";
import { cookies } from "next/headers";
import { Categorie } from "./getCategories";

export default async function createCategorie(
    storeId: number,
    catalogId: number,
    data: { type: string }
): Promise<Categorie> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/categorie/catalog/${catalogId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileToken}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create category");
    }

    return res.json();
}
