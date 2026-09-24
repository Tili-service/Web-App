"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, BookOpen, X } from "lucide-react";
import { createCatalog } from "@/services/catalog.service";

export default function CatalogSelector({ storeId, existingCatalogs }: { storeId: string, existingCatalogs: any[] }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            const newCatalog = await createCatalog(storeId, { name: name.trim(), description: description.trim() });
            toast.success("Catalogue créé avec succès");
            setIsOpen(false);
            router.refresh();
            
            router.push(`/admin/shop/${storeId}/catalogue/${newCatalog.catalog_id}`);
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mes Catalogues</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Gérez les différents menus de votre point de vente</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center gap-2 bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                    <Plus size={16} /> Nouveau catalogue
                </button>
            </div>

            {/* Liste des catalogues existants */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {existingCatalogs.map(cat => (
                    <button
                        key={cat.catalog_id}
                        onClick={() => router.push(`/admin/shop/${storeId}/catalogue/${cat.catalog_id}`)}
                        className="bg-white border border-gray-100 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                    >
                        <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center flex-shrink-0">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{cat.name}</h3>
                            <p className="text-sm text-gray-400 mt-1">{cat.description}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Modal de création (similaire à ta SidePanel/Overlay) */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-5 p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-gray-900">Nouveau catalogue</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Nom du catalogue</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex : Menu Principal, Carte d'Été..."
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ex : Menu Principal, Carte d'Été..."
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                            <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                            <button
                                onClick={handleCreate}
                                disabled={loading || !name.trim()}
                                className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] text-white hover:bg-[hsl(355,16%,16%)] transition-colors disabled:opacity-50"
                            >
                                {loading ? "Création..." : "Créer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}