import { getCatalogs } from "@/services/catalog.service";
import { getCategories } from "@/services/category.service";
import { getItems } from "@/services/item.service";
import type { Categorie, Item } from "@/lib/types";
import CatalogueClient from "./[catalogue_id]/CatalogueClient";
import CreateCatalogPrompt from "./CreateCatalogPrompt";

export default async function CataloguePage({
    params,
}: {
    params: Promise<{ shopId: string }>;
}) {
    const resolvedParams = await params;
    const shopId = resolvedParams.shopId;

    let categories: Categorie[] = [];
    let items: Item[] = [];
    let catalogId: string = "";
    let error: string | null = null;

    try {
        const catalogs = await getCatalogs(shopId);
        catalogId = catalogs[0]?.catalog_id ?? "";
        [categories, items] = await Promise.all([
            catalogId ? getCategories(shopId, catalogId) : Promise.resolve([]),
            getItems(shopId),
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
            ) : catalogId === "" ? (
                <CreateCatalogPrompt storeId={shopId} />
            ) : (
                <CatalogueClient categories={categories} items={items} storeId={shopId} catalogId={catalogId} />
            )}
        </div>
    );
}