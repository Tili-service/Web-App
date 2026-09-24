"use server";

import { apiFetch, getProfileToken } from "@/lib/api";
import type { Item } from "@/lib/types";

export async function getItems(storeId: number): Promise<Item[]> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    const data = await apiFetch<Item[]>("/item", {
        token,
        cache: "no-store",
        errorMessage: "Failed to fetch items",
    });
    return Array.isArray(data) ? data : [];
}

export async function createItem(
    storeId: number,
    data: { name: string; price: number; tax: number; categorie_id: number }
): Promise<Item> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    const tax_amount = data.price * data.tax;

    return apiFetch<Item>("/item", {
        method: "POST",
        token,
        body: { ...data, tax_amount },
        errorMessage: "Failed to create item",
    });
}

export async function updateItem(
    itemId: number,
    storeId: number,
    data: { name?: string; price?: number; tax?: number; categorie_id?: number }
): Promise<Item> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    return apiFetch<Item>(`/item/${itemId}`, {
        method: "PUT",
        token,
        body: data,
        errorMessage: "Failed to update item",
    });
}

export async function deleteItem(itemId: number, storeId: number): Promise<void> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    await apiFetch<void>(`/item/${itemId}`, {
        method: "DELETE",
        token,
        errorMessage: "Failed to delete item",
    });
}
