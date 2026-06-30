"use server";

import { apiFetch, getProfileToken } from "@/lib/api";
import type { Catalog } from "@/lib/types";

export async function getCatalogs(storeId: number): Promise<Catalog[]> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    const data = await apiFetch<Catalog[]>(`/catalog/store/${storeId}`, {
        token,
        cache: "no-store",
        errorMessage: "Failed to fetch catalogs",
    });
    return Array.isArray(data) ? data : [];
}

export async function createCatalog(
    storeId: number,
    data: { name: string; description?: string }
): Promise<Catalog> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    return apiFetch<Catalog>("/catalog", {
        method: "POST",
        token,
        body: data,
        errorMessage: "Failed to create catalog",
    });
}

export async function updateCatalog(
    catalogId: number,
    storeId: number,
    data: { name?: string; description?: string }
): Promise<Catalog> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    return apiFetch<Catalog>(`/catalog/${catalogId}`, {
        method: "PUT",
        token,
        body: data,
        errorMessage: "Failed to update catalog",
    });
}

export async function deleteCatalog(catalogId: number, storeId: number): Promise<void> {
    const token = await getProfileToken(storeId);
    if (!token) {
        throw new Error("Unauthorized: missing profile token");
    }

    await apiFetch<void>(`/catalog/${catalogId}`, {
        method: "DELETE",
        token,
        errorMessage: "Failed to delete catalog",
    });
}
