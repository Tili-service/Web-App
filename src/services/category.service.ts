"use server";

import { apiFetch, getProfileToken } from "@/lib/api";
import type { Categorie } from "@/lib/types";

export async function getCategories(storeId: number, catalogId: number): Promise<Categorie[]> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    const data = await apiFetch<Categorie[]>(`/categorie/catalog/${catalogId}`, {
        token,
        cache: "no-store",
        errorMessage: "Impossible de récupérer les catégories",
    });
    return Array.isArray(data) ? data : [];
}

export async function createCategorie(
    storeId: number,
    catalogId: number,
    data: { type: string }
): Promise<Categorie> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    return apiFetch<Categorie>(`/categorie/catalog/${catalogId}`, {
        method: "POST",
        token,
        body: data,
        errorMessage: "Impossible de créer la catégorie",
    });
}

export async function updateCategorie(
    categorieId: number,
    storeId: number,
    catalogId: number,
    data: { type: string }
): Promise<Categorie> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    return apiFetch<Categorie>(`/categorie/catalog/${catalogId}/${categorieId}`, {
        method: "PUT",
        token,
        body: data,
        errorMessage: "Impossible de modifier la catégorie",
    });
}

export async function deleteCategorie(
    categorieId: number,
    storeId: number,
    catalogId: number
): Promise<void> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Session boutique expirée. Reconnectez-vous avec votre PIN.");
    }

    await apiFetch<void>(`/categorie/catalog/${catalogId}/${categorieId}`, {
        method: "DELETE",
        token,
        errorMessage: "Impossible de supprimer la catégorie",
    });
}
