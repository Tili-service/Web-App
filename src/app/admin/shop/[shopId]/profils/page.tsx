import { getProfiles } from "@/services/profile.service";
import type { Profile } from "@/lib/types";
import ProfilesClient from "./ProfilesClient";

export default async function ProfilsPage({
    params,
}: {
    params: { shopId: string } | Promise<{ shopId: string }>;
}) {
    const { shopId } = await Promise.resolve(params);
    const storeId = String(shopId);

    let profiles: Profile[] = [];
    let error: string | null = null;

    try {
        profiles = await getProfiles(storeId);
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
                <ProfilesClient profiles={profiles} storeId={storeId} />
            )}
        </div>
    );
}


