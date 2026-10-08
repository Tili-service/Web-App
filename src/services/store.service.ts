"use server";

import { apiFetch, getAuthToken } from "@/lib/api";
import type { Shop } from "@/lib/types";
import { createShopSchema, shopSchema, type CreateShopInput, type ShopFormInput } from "@/lib/validation";

export async function getShops(): Promise<Shop[]> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Session expirée. Reconnectez-vous.");
    }

    const data = await apiFetch<Shop[]>("/store/me", { token, errorMessage: "Impossible de récupérer les boutiques" });
    return Array.isArray(data) ? data : [];
}

export async function getShop(storeId: string): Promise<Shop> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Session expirée. Reconnectez-vous.");
    }

    return apiFetch<Shop>(`/store/${storeId}`, { token, errorMessage: "Impossible de récupérer la boutique" });
}

export async function createShop(data: CreateShopInput): Promise<Shop> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Session expirée. Reconnectez-vous.");
    }

    const parsed = createShopSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Données invalides");
    }

    const res = await apiFetch<{ store: Shop }>("/store", {
        method: "POST",
        token,
        body: parsed.data,
        errorMessage: "Impossible de créer la boutique",
    });
    return res.store;
}

export async function updateShop(storeId: string, data: ShopFormInput): Promise<Shop> {
    const token = await getAuthToken();
    if (!token) {
        throw new Error("Session expirée. Reconnectez-vous.");
    }

    const parsed = shopSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Données invalides");
    }

    return apiFetch<Shop>(`/store/${storeId}`, {
        method: "PUT",
        token,
        body: parsed.data,
        errorMessage: "Impossible de modifier la boutique",
    });
}
