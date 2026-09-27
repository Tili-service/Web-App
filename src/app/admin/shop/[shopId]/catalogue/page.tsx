import { getCatalogs } from "@/services/catalog.service";
import { getCategories } from "@/services/category.service";
import { getItems } from "@/services/item.service";
import type { Catalog, Categorie, Item } from "@/lib/types";
import CatalogSwitcher from "./CatalogSwitcher";
import CatalogueClient from "./CatalogueClient";
import CreateCatalogPrompt from "./CreateCatalogPrompt";

export default async function CataloguePage({
    params,
    searchParams,
}: {
    params: Promise<{ shopId: string }>;
    searchParams: Promise<{ catalog?: string }>;
}) {
    const { shopId } = await params;
    const { catalog } = await searchParams;
    const storeId = shopId;

    let categories: Categorie[] = [];
    let items: Item[] = [];
    let catalogs: Catalog[] = [];
    let catalogId = "";
    let error: string | null = null;

    try {
        catalogs = await getCatalogs(storeId);
        catalogId = (catalogs.find((c) => c.catalog_id === catalog) ?? catalogs[0])?.catalog_id ?? "";
        const [cats, allItems] = await Promise.all([
            catalogId ? getCategories(storeId, catalogId) : Promise.resolve([]),
            getItems(storeId),
        ]);
        categories = cats;
        const ids = new Set(cats.map((c) => c.categorie_id));
        items = allItems.filter((i) => ids.has(i.categorie_id));
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
                <CreateCatalogPrompt storeId={storeId} />
            ) : (
                <>
                    <CatalogSwitcher catalogs={catalogs} storeId={storeId} currentId={catalogId} />
                    <CatalogueClient key={catalogId} categories={categories} items={items} storeId={storeId} catalogId={catalogId} />
                </>
            )}
        </div>
    );
}
