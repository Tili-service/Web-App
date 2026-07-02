"use server";

import { apiFetch, getProfileToken } from "@/lib/api";
import type { Categorie } from "@/lib/types";

export async function getCategories(storeId: number, catalogId: number): Promise<Categorie[]> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    const data = await apiFetch<Categorie[]>(`/categorie/catalog/${catalogId}`, {
        token,
        cache: "no-store",
        errorMessage: "Failed to fetch categories",
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
        throw new Error("Unauthorized: missing profile token");
    }

    return apiFetch<Categorie>(`/categorie/catalog/${catalogId}`, {
        method: "POST",
        token,
        body: data,
        errorMessage: "Failed to create category",
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
        throw new Error("Unauthorized: missing profile token");
    }

    return apiFetch<Categorie>(`/categorie/catalog/${catalogId}/${categorieId}`, {
        method: "PUT",
        token,
        body: data,
        errorMessage: "Failed to update category",
    });
}

export async function deleteCategorie(
    categorieId: number,
    storeId: number,
    catalogId: number
): Promise<void> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    await apiFetch<void>(`/categorie/catalog/${catalogId}/${categorieId}`, {
        method: "DELETE",
        token,
        errorMessage: "Failed to delete category",
    });
}
