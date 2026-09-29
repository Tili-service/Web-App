"use server";

import { apiFetch, getProfileToken } from "@/lib/api";
import type { Catalog } from "@/lib/types";

export async function getCatalogs(storeId: string): Promise<Catalog[]> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    const data = await apiFetch<Catalog[]>(`/catalog/store/${storeId}`, {
        token,
        cache: "no-store",
        errorMessage: "Impossible de récupérer les catalogues",
    });
    return Array.isArray(data) ? data : [];
}

export async function createCatalog(
    storeId: string,
    data: { name: string; description?: string }
): Promise<Catalog> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    return apiFetch<Catalog>(`/catalog/store/${storeId}`, {
        method: "POST",
        token,
        body: data,
        errorMessage: "Impossible de créer le catalogue",
    });
}

export async function updateCatalog(
    catalogId: string,
    storeId: string,
    data: { name?: string; description?: string }
): Promise<Catalog> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    return apiFetch<Catalog>(`/catalog/${catalogId}`, {
        method: "PUT",
        token,
        body: data,
        errorMessage: "Impossible de modifier le catalogue",
    });
}

export async function deleteCatalog(catalogId: string, storeId: string): Promise<void> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    await apiFetch<void>(`/catalog/${catalogId}`, {
        method: "DELETE",
        token,
        errorMessage: "Impossible de supprimer le catalogue",
    });
}
