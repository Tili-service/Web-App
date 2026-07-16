import { getCatalogs } from "@/services/catalog.service";
import { getCategories } from "@/services/category.service";
import { getItems } from "@/services/item.service";
import type { Categorie, Item } from "@/lib/types";
import CatalogueClient from "./CatalogueClient";

export default async function CataloguePage({
    params,
}: {
    params: { shopId: string; catalogue_id: string } | Promise<{ shopId: string; catalogue_id: string }>;
}) {
    const { shopId, catalogue_id } = await Promise.resolve(params);
    const storeId = String(shopId);
    const catalogId = String(catalogue_id);

    let categories: Categorie[] = [];
    let items: Item[] = [];
    let error: string | null = null;

    try {
        const catalogs = await getCatalogs(storeId);
        [categories, items] = await Promise.all([
            catalogId ? getCategories(storeId, catalogId) : Promise.resolve([]),
            getItems(storeId),
        ]);
    } catch (e: unknown) {
        error = e instanceof Error ? e.message : "Erreur inconnue";
    }

    return (
        <div className="space-y-6">
            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    Erreur : {error}
                </div>
            ) : (
                <CatalogueClient categories={categories} items={items} storeId={storeId} catalogId={catalogId} />
            )}
        </div>
    );
}
