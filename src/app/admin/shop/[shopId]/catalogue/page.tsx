import CatalogSelector from "@/components/CategorySelector";
import { getCatalogs } from "@/services/catalog.service"; 

export default async function CatalogsPage({ 
    params 
}: { 
    params: Promise<{ shopId: string }> 
}) {
    const resolvedParams = await params;
    const shopId = resolvedParams.shopId;

    const existingCatalogs = await getCatalogs(shopId);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <CatalogSelector 
                storeId={shopId}
                existingCatalogs={existingCatalogs} 
            />
        </div>
    );
}