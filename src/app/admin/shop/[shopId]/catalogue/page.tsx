import CatalogSelector from "@/components/CategorySelector";
import { getCatalogs } from "@/services/catalog.service"; 
import { getCategories } from "@/services/category.service";
import { getItems } from "@/services/item.service";
import { Catalog, Categorie, Item } from "@/lib/types";

export default async function CatalogsPage({ 
    params 
}: { 
    params: Promise<{ shopId: string }> 
}) {
    const resolvedParams = await params;
    const shopId = resolvedParams.shopId;

    let categories: Categorie[] = [];
    let catalogs: Catalog[] = [];
    let items: Item[] = [];
    let catalogId: string = "";
    let error: string | null = null;

    try {
        catalogs = await getCatalogs(shopId);
        catalogId = catalogs[0]?.catalog_id ?? "";
        [categories, items] = await Promise.all([
            catalogId ? getCategories(shopId, catalogId) : Promise.resolve([]),
            getItems(shopId),
        ]);
    } catch (e: unknown) {
        error = e instanceof Error ? e.message : "Erreur inconnue";
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <CatalogSelector 
                storeId={shopId}
                existingCatalogs={catalogs} 
            />
        </div>
    );
}