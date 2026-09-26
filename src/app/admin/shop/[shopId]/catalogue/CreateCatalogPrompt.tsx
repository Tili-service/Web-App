"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FolderPlus, Loader2 } from "lucide-react";
import { createCatalog } from "@/services/catalog.service";

export default function CreateCatalogPrompt({ storeId }: { storeId: number }) {
    const router = useRouter();
    const [name, setName] = useState("Catalogue principal");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            await createCatalog(storeId, { name: name.trim() });
            toast.success("Catalogue créé");
            router.refresh();
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Impossible de créer le catalogue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-14 flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                <FolderPlus size={26} className="text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Aucun catalogue</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-sm">
                Cette boutique n&apos;a pas encore de catalogue. Créez-en un pour ajouter vos catégories et articles.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-md">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom du catalogue"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                />
                <button
                    onClick={handleCreate}
                    disabled={loading || !name.trim()}
                    className="inline-flex items-center justify-center gap-2 bg-brand-ink hover:bg-brand-ink-strong text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <FolderPlus size={15} />}
                    Créer le catalogue
                </button>
            </div>
        </div>
    );
}
