"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Tag, Package, Search, X, Euro, Percent, ShoppingBag } from "lucide-react";
import { Categorie } from "@/lib/getCategories";
import { Item } from "@/lib/getItems";
import createCategorie from "@/lib/createCategorie";
import updateCategorie from "@/lib/updateCategorie";
import deleteCategorie from "@/lib/deleteCategorie";
import createItem from "@/lib/createItem";
import updateItem from "@/lib/updateItem";
import deleteItem from "@/lib/deleteItem";

type Tab = "categories" | "articles";

type CategoryModal =
    | { type: "closed" }
    | { type: "add" }
    | { type: "edit"; categorie: Categorie }
    | { type: "delete"; categorie: Categorie };

type ItemModal =
    | { type: "closed" }
    | { type: "add" }
    | { type: "edit"; item: Item }
    | { type: "delete"; item: Item };

export default function CatalogueClient({
    categories,
    items,
    storeId,
}: {
    categories: Categorie[];
    items: Item[];
    storeId: number;
}) {
    const [activeTab, setActiveTab] = useState<Tab>("categories");

    return (
        <>
            {/* ── Header ── */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white flex-shrink-0">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Catalogue</h1>
                        <p className="text-sm text-slate-600">
                            Gérez vos catégories et articles
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="border-b border-slate-200">
                <div className="flex gap-1">
                    <TabButton
                        active={activeTab === "categories"}
                        onClick={() => setActiveTab("categories")}
                        icon={Tag}
                        label="Catégories"
                        count={categories.length}
                    />
                    <TabButton
                        active={activeTab === "articles"}
                        onClick={() => setActiveTab("articles")}
                        icon={Package}
                        label="Articles"
                        count={items.length}
                    />
                </div>
            </div>

            {/* ── Content ── */}
            <div className="pb-8">
                {activeTab === "categories" && (
                    <CategoriesSection categories={categories} storeId={storeId} />
                )}
                {activeTab === "articles" && (
                    <ItemsSection items={items} categories={categories} storeId={storeId} />
                )}
            </div>
        </>
    );
}

/* ══════════════════════════════════════════════════════════════════════════
   CATEGORIES SECTION
   ══════════════════════════════════════════════════════════════════════════ */

function CategoriesSection({ categories, storeId }: { categories: Categorie[]; storeId: number }) {
    const router = useRouter();
    const [modal, setModal] = useState<CategoryModal>({ type: "closed" });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const [addType, setAddType] = useState("");
    const [editType, setEditType] = useState("");

    const filtered = useMemo(() => {
        const rows = categories || [];
        const q = search.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((c) => c.type.toLowerCase().includes(q));
    }, [categories, search]);

    const openAdd = () => {
        setAddType("");
        setModal({ type: "add" });
    };

    const openEdit = (c: Categorie) => {
        setEditType(c.type);
        setModal({ type: "edit", categorie: c });
    };

    const openDelete = (c: Categorie) => {
        setModal({ type: "delete", categorie: c });
    };

    const handleAdd = async () => {
        if (!addType.trim()) return;
        setLoading(true);
        try {
            await createCategorie(storeId, { type: addType.trim() });
            toast.success("Catégorie créée");
            setModal({ type: "closed" });
            router.refresh();
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        if (modal.type !== "edit") return;
        if (!editType.trim()) return;
        setLoading(true);
        try {
            await updateCategorie(modal.categorie.categorie_id, storeId, { type: editType.trim() });
            toast.success("Catégorie mise à jour");
            setModal({ type: "closed" });
            router.refresh();
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur lors de la modification");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (modal.type !== "delete") return;
        setLoading(true);
        try {
            await deleteCategorie(modal.categorie.categorie_id, storeId);
            toast.success("Catégorie supprimée");
            setModal({ type: "closed" });
            router.refresh();
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    const close = () => setModal({ type: "closed" });

    return (
        <>
            <div className="space-y-4">
                {/* ── Toolbar ── */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une catégorie…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />
                    </div>
                    <button
                        onClick={openAdd}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                        <Plus size={16} /> Ajouter une catégorie
                    </button>
                </div>

                {/* ── Grid ── */}
                 {filtered.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-10 text-center text-slate-400">
                        <Tag size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">
                            {categories.length === 0 ? "Aucune catégorie disponible." : "Aucun résultat pour cette recherche."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((c) => (
                            <div
                                key={c.categorie_id}
                                className="bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 group"
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                            <Tag size={18} />
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-900 truncate">{c.type}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        onClick={() => openEdit(c)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-medium px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <Pencil size={12} /> Modifier
                                    </button>
                                    <button
                                        onClick={() => openDelete(c)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={12} /> Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            {modal.type === "add" && (
                <Overlay onClose={close}>
                    <ModalCard title="Nouvelle catégorie" onClose={close}>
                        <div className="space-y-4">
                            <Field label="Nom de la catégorie">
                                <input
                                    autoFocus
                                    type="text"
                                    value={addType}
                                    onChange={(e) => setAddType(e.target.value)}
                                    placeholder="Ex : Électronique, Vêtements, Alimentation..."
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </Field>
                        </div>
                        <ModalFooter>
                            <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                                Annuler
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={loading || !addType.trim()}
                                className="px-4 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Création…" : "Créer"}
                            </button>
                        </ModalFooter>
                    </ModalCard>
                </Overlay>
            )}

            {modal.type === "edit" && (
                <Overlay onClose={close}>
                    <ModalCard title="Modifier la catégorie" onClose={close}>
                        <div className="space-y-4">
                            <Field label="Nom de la catégorie">
                                <input
                                    autoFocus
                                    type="text"
                                    value={editType}
                                    onChange={(e) => setEditType(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </Field>
                        </div>
                        <ModalFooter>
                            <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                                Annuler
                            </button>
                            <button
                                onClick={handleEdit}
                                disabled={loading || !editType.trim()}
                                className="px-4 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Enregistrement…" : "Enregistrer"}
                            </button>
                        </ModalFooter>
                    </ModalCard>
                </Overlay>
            )}

            {modal.type === "delete" && (
                <Overlay onClose={close}>
                    <ModalCard title="Supprimer la catégorie" onClose={close}>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600">
                                Êtes-vous sûr de vouloir supprimer la catégorie <span className="font-semibold text-slate-900">{modal.categorie.type}</span> ?
                            </p>
                            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                                ⚠️ Cette action est irréversible et peut affecter les articles liés.
                            </p>
                        </div>
                        <ModalFooter>
                            <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Suppression…" : "Supprimer"}
                            </button>
                        </ModalFooter>
                    </ModalCard>
                </Overlay>
            )}
        </>
    );
}

/* ══════════════════════════════════════════════════════════════════════════
   ITEMS SECTION
   ══════════════════════════════════════════════════════════════════════════ */

function ItemsSection({
    items,
    categories,
    storeId,
}: {
    items: Item[];
    categories: Categorie[];
    storeId: number;
}) {
    const router = useRouter();
    const [modal, setModal] = useState<ItemModal>({ type: "closed" });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState<number | "all">("all");

    const [addName, setAddName] = useState("");
    const [addPrice, setAddPrice] = useState("");
    const [addTax, setAddTax] = useState("0.20");
    const [addCategoryId, setAddCategoryId] = useState<number | "">("");

    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editTax, setEditTax] = useState("");
    const [editCategoryId, setEditCategoryId] = useState<number>(0);

    const filtered = useMemo(() => {
        const rows = items || [];
        let result = rows;

        const q = search.trim().toLowerCase();
        if (q) result = result.filter((item) => item.name.toLowerCase().includes(q));

        if (filterCategory !== "all") {
            result = result.filter((item) => item.categorie_id === filterCategory);
        }

        return result;
    }, [items, search, filterCategory]);

    const getCategoryName = (categoryId: number) => {
        const cat = categories.find((c) => c.categorie_id === categoryId);
        return cat?.type || "Sans catégorie";
    };

    const openAdd = () => {
        setAddName("");
        setAddPrice("");
        setAddTax("0.20");
        setAddCategoryId(categories.length > 0 ? categories[0].categorie_id : "");
        setModal({ type: "add" });
    };

    const openEdit = (item: Item) => {
        setEditName(item.name);
        setEditPrice(item.price.toString());
        setEditTax(item.tax.toString());
        setEditCategoryId(item.categorie_id);
        setModal({ type: "edit", item });
    };

    const openDelete = (item: Item) => {
        setModal({ type: "delete", item });
    };

    const handleAdd = async () => {
        if (!addName.trim() || !addPrice || addCategoryId === "") return;
        setLoading(true);
        try {
            await createItem(storeId, {
                name: addName.trim(),
                price: parseFloat(addPrice),
                tax: parseFloat(addTax),
                categorie_id: addCategoryId as number,
            });
            toast.success("Article créé");
            setModal({ type: "closed" });
            router.refresh();
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        if (modal.type !== "edit") return;
        if (!editName.trim() || !editPrice) return;
        setLoading(true);
        try {
            await updateItem(modal.item.item_id, storeId, {
                name: editName.trim(),
                price: parseFloat(editPrice),
                tax: parseFloat(editTax),
                categorie_id: editCategoryId,
            });
            toast.success("Article mis à jour");
            setModal({ type: "closed" });
            router.refresh();
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur lors de la modification");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (modal.type !== "delete") return;
        setLoading(true);
        try {
            await deleteItem(modal.item.item_id, storeId);
            toast.success("Article supprimé");
            setModal({ type: "closed" });
            router.refresh();
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur lors de la suppression");
        } finally {
            setLoading(false);
        }
    };

    const close = () => setModal({ type: "closed" });

    return (
        <>
            <div className="space-y-4">
                {/* ── Toolbar ── */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un article…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value === "all" ? "all" : Number(e.target.value))}
                        className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
                    >
                        <option value="all">Toutes les catégories</option>
                        {categories.map((cat) => (
                            <option key={cat.categorie_id} value={cat.categorie_id}>
                                {cat.type}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={openAdd}
                        disabled={categories.length === 0}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={categories.length === 0 ? "Créez d'abord une catégorie" : ""}
                    >
                        <Plus size={16} /> Ajouter un article
                    </button>
                </div>

                {/* ── List ── */}
                {categories.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm p-10 text-center">
                        <Tag size={40} className="mx-auto mb-3 text-amber-600 opacity-60" />
                        <p className="text-sm text-amber-900 font-medium mb-1">Aucune catégorie disponible</p>
                        <p className="text-xs text-amber-700">Créez d'abord des catégories avant d'ajouter des articles</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-10 text-center text-slate-400">
                        <Package size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">
                            {items.length === 0 ? "Aucun article disponible." : "Aucun résultat pour cette recherche."}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wide">
                                    <th className="px-5 py-3 text-left font-medium">Article</th>
                                    <th className="px-5 py-3 text-left font-medium">Catégorie</th>
                                    <th className="px-5 py-3 text-right font-medium">Prix HT</th>
                                    <th className="px-5 py-3 text-right font-medium">TVA</th>
                                    <th className="px-5 py-3 text-right font-medium">Prix TTC</th>
                                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map((item) => {
                                    const priceHT = Number(item.price);
                                    const tax = Number(item.tax);
                                    const priceTTC = priceHT * (1 + tax);

                                    return (
                                        <tr key={item.item_id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                                                        <Package size={14} />
                                                    </div>
                                                    <span className="font-medium text-slate-900">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                    <Tag size={11} />
                                                    {getCategoryName(item.categorie_id)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-medium text-slate-700">
                                                {priceHT.toFixed(2)} €
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-slate-600">
                                                {(tax * 100).toFixed(0)}%
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-semibold text-slate-900">
                                                {priceTTC.toFixed(2)} €
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="inline-flex items-center gap-1">
                                                    <button
                                                        onClick={() => openEdit(item)}
                                                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                                    >
                                                        <Pencil size={12} /> Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => openDelete(item)}
                                                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 size={12} /> Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Add Modal ── */}
            {modal.type === "add" && (
                <Overlay onClose={close}>
                    <ModalCard title="Nouvel article" onClose={close}>
                        <div className="space-y-4">
                            <Field label="Nom de l'article">
                                <input
                                    autoFocus
                                    type="text"
                                    value={addName}
                                    onChange={(e) => setAddName(e.target.value)}
                                    placeholder="Ex : Laptop Pro 15"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </Field>

                            <Field label="Catégorie">
                                <select
                                    value={addCategoryId}
                                    onChange={(e) => setAddCategoryId(Number(e.target.value))}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.categorie_id} value={cat.categorie_id}>
                                            {cat.type}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Prix HT (€)">
                                    <div className="relative">
                                        <Euro size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={addPrice}
                                            onChange={(e) => setAddPrice(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                                        />
                                    </div>
                                </Field>

                                <Field label="TVA (décimal)">
                                    <div className="relative">
                                        <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="1"
                                            value={addTax}
                                            onChange={(e) => setAddTax(e.target.value)}
                                            placeholder="0.20"
                                            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                                        />
                                    </div>
                                </Field>
                            </div>

                            {addPrice && addTax && (
                                <div className="bg-slate-50 rounded-lg px-3 py-2 text-sm">
                                    <span className="text-slate-600">Prix TTC : </span>
                                    <span className="font-semibold text-slate-900">
                                        {(parseFloat(addPrice || "0") * (1 + parseFloat(addTax || "0"))).toFixed(2)} €
                                    </span>
                                    <span className="text-xs text-slate-500 ml-2">(TVA : {(parseFloat(addTax || "0") * 100).toFixed(0)}%)</span>
                                </div>
                            )}
                        </div>
                        <ModalFooter>
                            <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                                Annuler
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={loading || !addName.trim() || !addPrice || addCategoryId === ""}
                                className="px-4 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Création…" : "Créer l'article"}
                            </button>
                        </ModalFooter>
                    </ModalCard>
                </Overlay>
            )}

            {/* ── Edit Modal ── */}
            {modal.type === "edit" && (
                <Overlay onClose={close}>
                    <ModalCard title="Modifier l'article" onClose={close}>
                        <div className="space-y-4">
                            <Field label="Nom de l'article">
                                <input
                                    autoFocus
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </Field>

                            <Field label="Catégorie">
                                <select
                                    value={editCategoryId}
                                    onChange={(e) => setEditCategoryId(Number(e.target.value))}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.categorie_id} value={cat.categorie_id}>
                                            {cat.type}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Prix HT (€)">
                                    <div className="relative">
                                        <Euro size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={editPrice}
                                            onChange={(e) => setEditPrice(e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                                        />
                                    </div>
                                </Field>

                                <Field label="TVA (décimal)">
                                    <div className="relative">
                                        <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="1"
                                            value={editTax}
                                            onChange={(e) => setEditTax(e.target.value)}
                                            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                                        />
                                    </div>
                                </Field>
                            </div>

                            {editPrice && editTax && (
                                <div className="bg-slate-50 rounded-lg px-3 py-2 text-sm">
                                    <span className="text-slate-600">Prix TTC : </span>
                                    <span className="font-semibold text-slate-900">
                                        {(parseFloat(editPrice || "0") * (1 + parseFloat(editTax || "0"))).toFixed(2)} €
                                    </span>
                                    <span className="text-xs text-slate-500 ml-2">(TVA : {(parseFloat(editTax || "0") * 100).toFixed(0)}%)</span>
                                </div>
                            )}
                        </div>
                        <ModalFooter>
                            <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                                Annuler
                            </button>
                            <button
                                onClick={handleEdit}
                                disabled={loading || !editName.trim() || !editPrice}
                                className="px-4 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Enregistrement…" : "Enregistrer"}
                            </button>
                        </ModalFooter>
                    </ModalCard>
                </Overlay>
            )}

            {/* ── Delete Modal ── */}
            {modal.type === "delete" && (
                <Overlay onClose={close}>
                    <ModalCard title="Supprimer l'article" onClose={close}>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600">
                                Êtes-vous sûr de vouloir supprimer l'article <span className="font-semibold text-slate-900">{modal.item.name}</span> ?
                            </p>
                            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                                ⚠️ Cette action est irréversible.
                            </p>
                        </div>
                        <ModalFooter>
                            <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                                Annuler
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="px-4 py-2 text-sm rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Suppression…" : "Supprimer"}
                            </button>
                        </ModalFooter>
                    </ModalCard>
                </Overlay>
            )}
        </>
    );
}

/* ══════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════ */

function TabButton({
    active,
    onClick,
    icon: Icon,
    label,
    count,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    count: number;
}) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                active
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
        >
            <Icon size={16} />
            {label}
            <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                }`}
            >
                {count}
            </span>
        </button>
    );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
    );
}

function ModalCard({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">{title}</h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
                    <X size={18} />
                </button>
            </div>
            {children}
        </div>
    );
}

function ModalFooter({ children }: { children: React.ReactNode }) {
    return <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}
