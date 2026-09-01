"use server";

import { apiFetch, getProfileToken } from "@/lib/api";
import { round2 } from "@/lib/utils";
import type { Item } from "@/lib/types";

export async function getItems(storeId: number): Promise<Item[]> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    const data = await apiFetch<Item[]>("/item", {
        token,
        cache: "no-store",
        errorMessage: "Impossible de récupérer les articles",
    });
    return Array.isArray(data) ? data : [];
}

export async function createItem(
    storeId: number,
    data: { name: string; price: number; tax: number; categorie_id: number }
): Promise<Item> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    const tax_amount = round2(data.price * data.tax);

    return apiFetch<Item>("/item", {
        method: "POST",
        token,
        body: { ...data, tax_amount },
        errorMessage: "Impossible de créer l'article",
    });
}

export async function updateItem(
    itemId: number,
    storeId: number,
    data: { name?: string; price?: number; tax?: number; categorie_id?: number }
): Promise<Item> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    const body =
        data.price !== undefined && data.tax !== undefined
            ? { ...data, tax_amount: round2(data.price * data.tax) }
            : data;

    return apiFetch<Item>(`/item/${itemId}`, {
        method: "PUT",
        token,
        body,
        errorMessage: "Impossible de modifier l'article",
    });
}

export async function deleteItem(itemId: number, storeId: number): Promise<void> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    await apiFetch<void>(`/item/${itemId}`, {
        method: "DELETE",
        token,
        errorMessage: "Impossible de supprimer l'article",
    });
}
