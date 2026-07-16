import { getCatalogs } from "@/services/catalog.service";
import { getCategories } from "@/services/category.service";
import { getItems } from "@/services/item.service";
import type { Categorie, Item } from "@/lib/types";
import CatalogueClient from "./CatalogueClient";

export default async function CataloguePage({
    params,
}: {
    params: { shopId: string } | Promise<{ shopId: string }>;
}) {
    const { shopId } = await Promise.resolve(params);
    const storeId = parseInt(shopId, 10);

    let categories: Categorie[] = [];
    let items: Item[] = [];
    let catalogId: number = 0;
    let error: string | null = null;

    try {
        const catalogs = await getCatalogs(storeId);
        catalogId = catalogs[0]?.catalog_id ?? 0;
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
