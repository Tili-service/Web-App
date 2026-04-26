"use server";
import { cookies } from "next/headers";
import { Item } from "./getItems";

export default async function createItem(
    storeId: number,
    data: { name: string; price: number; tax: number; categorie_id: number }
): Promise<Item> {
    const cookieStore = await cookies();
    const profileToken = cookieStore.get(`profile_token_${storeId}`)?.value;

    if (!profileToken) {
        throw new Error("Unauthorized: missing profile token");
    }

    // Calculer le montant de la taxe
    const tax_amount = data.price * data.tax;

    const res = await fetch(`${process.env.BACKEND_GO}/item`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${profileToken}`,
        },
        body: JSON.stringify({ ...data, tax_amount }),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create item");
    }

    return res.json();
}
