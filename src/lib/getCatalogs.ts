"use server";
import { cookies } from "next/headers";

export type Catalog = {
    catalog_id: number;
    name: string;
    description: string;
};

export default async function getCatalogs(storeId: number): Promise<Catalog[]> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/catalog/store/${storeId}`, {
        headers: {
            Authorization: `Bearer ${profileToken}`,
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch catalogs");
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
}
