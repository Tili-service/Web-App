import getCategories, { Categorie } from "@/lib/getCategories";
import getItems, { Item } from "@/lib/getItems";
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
    let error: string | null = null;

    try {
        [categories, items] = await Promise.all([
            getCategories(storeId),
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
                <CatalogueClient categories={categories} items={items} storeId={storeId} />
            )}
        </div>
    );
}
