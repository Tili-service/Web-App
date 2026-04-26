"use server";
import { cookies } from "next/headers";

export type Item = {
    item_id: number;
    name: string;
    price: number;
    tax: number;
    tax_amount: number;
    categorie_id: number;
    categorie?: {
        categorie_id: number;
        type: string;
    };
};

export default async function getItems(storeId: number): Promise<Item[]> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/item`, {
        headers: {
            Authorization: `Bearer ${profileToken}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch items");
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
}
