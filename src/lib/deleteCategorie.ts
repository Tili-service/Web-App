"use server";
import { cookies } from "next/headers";

export default async function deleteCategorie(
    categorieId: number,
    storeId: number,
    catalogId: number
): Promise<void> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/categorie/catalog/${catalogId}/${categorieId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${profileToken}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete category");
    }
}
