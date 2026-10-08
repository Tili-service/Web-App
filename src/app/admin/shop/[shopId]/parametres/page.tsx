import { getShop } from "@/services/store.service";
import type { Shop } from "@/lib/types";
import ShopSettingsClient from "./ShopSettingsClient";

export default async function ShopSettingsPage({
    params,
}: {
    params: Promise<{ shopId: string }>;
}) {
    const { shopId } = await params;

    let shop: Shop | null = null;
    let error: string | null = null;

    try {
        shop = await getShop(shopId);
    } catch (e: unknown) {
        error = e instanceof Error ? e.message : "Erreur inconnue";
    }

    return (
        <div className="space-y-6">
            {error || !shop ? (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                    Erreur : {error ?? "Boutique introuvable"}
                </div>
            ) : (
                <ShopSettingsClient shop={shop} />
            )}
        </div>
    );
}
