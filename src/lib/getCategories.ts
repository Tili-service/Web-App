"use server";
import { cookies } from "next/headers";

export type Categorie = {
    categorie_id: number;
    type: string;
};

export default async function getCategories(storeId: number, catalogId: number): Promise<Categorie[]> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/categorie/catalog/${catalogId}`, {
        headers: {
            Authorization: `Bearer ${profileToken}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch categories");
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
}
