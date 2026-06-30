"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Plus, Pencil, Trash2, Tag, Package, Search, X, Euro, Percent,
    ArrowLeft, FolderOpen, MoveRight, Coffee, BookOpen, Shirt, Laptop,
    Utensils, Music, Gift, Zap, Star, Dumbbell,
    Pizza, ShoppingBag, ChevronUp, ChevronDown,
} from "lucide-react";
import { createCategorie, updateCategorie, deleteCategorie } from "@/services/category.service";
import { createItem, updateItem, deleteItem } from "@/services/item.service";
import type { Categorie, Item } from "@/lib/types";

const ICON_OPTIONS: { id: string; Icon: React.ElementType; label: string }[] = [
    { id: "tag",      Icon: Tag,         label: "Tag"         },
    { id: "package",  Icon: Package,     label: "Package"     },
    { id: "coffee",   Icon: Coffee,      label: "Café"        },
    { id: "utensils", Icon: Utensils,    label: "Restauration" },
    { id: "pizza",    Icon: Pizza,       label: "Pizza"       },
    { id: "shirt",    Icon: Shirt,       label: "Vêtements"   },
    { id: "laptop",   Icon: Laptop,      label: "Électronique" },
    { id: "book",     Icon: BookOpen,    label: "Livre"       },
    { id: "music",    Icon: Music,       label: "Musique"     },
    { id: "gift",     Icon: Gift,        label: "Cadeau"      },
    { id: "zap",      Icon: Zap,         label: "Sport"       },
    { id: "dumbbell", Icon: Dumbbell,    label: "Fitness"     },
    { id: "star",     Icon: Star,        label: "Favori"      },
    { id: "bag",      Icon: ShoppingBag, label: "Boutique"    },
];

const COLOR_OPTIONS = [
    { id: "orange",  bg: "bg-orange-100",  text: "text-orange-500",  active: "bg-orange-500" },
    { id: "blue",    bg: "bg-blue-100",    text: "text-blue-500",    active: "bg-blue-500"   },
    { id: "emerald", bg: "bg-emerald-100", text: "text-emerald-500", active: "bg-emerald-500"},
    { id: "violet",  bg: "bg-violet-100",  text: "text-violet-500",  active: "bg-violet-500" },
    { id: "rose",    bg: "bg-rose-100",    text: "text-rose-500",    active: "bg-rose-500"   },
    { id: "amber",   bg: "bg-amber-100",   text: "text-amber-500",   active: "bg-amber-500"  },
    { id: "sky",     bg: "bg-sky-100",     text: "text-sky-500",     active: "bg-sky-500"    },
    { id: "gray",    bg: "bg-gray-100",    text: "text-gray-500",    active: "bg-gray-500"   },
];

function getIconById(id: string): React.ElementType {
    return ICON_OPTIONS.find((o) => o.id === id)?.Icon ?? Tag;
}

function getColorById(id: string) {
    return COLOR_OPTIONS.find((c) => c.id === id) ?? COLOR_OPTIONS[0];
}

type Tab = "categories" | "articles";

type CatWithMeta = Categorie & { icon?: string; color?: string };

type CategoryPanel =
    | { type: "closed" }
    | { type: "add" }
    | { type: "edit"; categorie: CatWithMeta }
    | { type: "delete"; categorie: Categorie };

type ItemPanel =
    | { type: "closed" }
    | { type: "add"; categoryId?: number }
    | { type: "edit"; item: Item }
    | { type: "delete"; item: Item }
    | { type: "move"; item: Item };


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
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const selectedCategory = categories.find((c) => c.categorie_id === selectedCategoryId) as CatWithMeta | undefined;

    return (
        <>
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Catalogue</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {categories.length} catégorie{categories.length !== 1 ? "s" : ""} · {items.length} article{items.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                    { label: "Catégories", value: categories.length, Icon: Tag,     cls: "text-orange-500" },
                    { label: "Articles",   value: items.length,      Icon: Package, cls: "text-gray-900"   },
                ].map(({ label, value, Icon, cls }) => (
                    <div key={label} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                            <Icon size={18} className={cls} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{value}</p>
                            <p className="text-xs text-gray-400">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-b border-gray-100 mt-4">
                <div className="flex gap-1">
                    <TabButton active={activeTab === "categories"} onClick={() => { setActiveTab("categories"); setSelectedCategoryId(null); }} icon={Tag}     label="Catégories" count={categories.length} />
                    <TabButton active={activeTab === "articles"}   onClick={() => setActiveTab("articles")}   icon={Package} label="Tous les articles" count={items.length} />
                </div>
            </div>

            <div className="pb-8">
                {activeTab === "categories" && (
                    selectedCategoryId !== null ? (
                        <CategoryDrillDown
                            category={selectedCategory as CatWithMeta}
                            items={items.filter((i) => i.categorie_id === selectedCategoryId)}
                            categories={categories}
                            storeId={storeId}
                            onBack={() => setSelectedCategoryId(null)}
                        />
                    ) : (
                        <CategoriesSection
                            categories={categories}
                            items={items}
                            storeId={storeId}
                            onDrillDown={setSelectedCategoryId}
                        />
                    )
                )}
                {activeTab === "articles" && (
                    <AllItemsSection items={items} categories={categories} storeId={storeId} />
                )}
            </div>
        </>
    );
}


function CategoriesSection({
    categories,
    items,
    storeId,
    onDrillDown,
}: {
    categories: Categorie[];
    items: Item[];
    storeId: number;
    onDrillDown: (id: number) => void;
}) {
    const router = useRouter();
    const [panel, setPanel] = useState<CategoryPanel>({ type: "closed" });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    // Add form state
    const [addType, setAddType] = useState("");
    const [addIcon, setAddIcon] = useState("tag");
    const [addColor, setAddColor] = useState("orange");

    // Edit form state
    const [editType, setEditType] = useState("");
    const [editIcon, setEditIcon] = useState("tag");
    const [editColor, setEditColor] = useState("orange");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter((c) => c.type.toLowerCase().includes(q));
    }, [categories, search]);

    const openAdd = () => { setAddType(""); setAddIcon("tag"); setAddColor("orange"); setPanel({ type: "add" }); };
    const openEdit = (c: CatWithMeta) => {
        setEditType(c.type);
        setEditIcon(c.icon ?? "tag");
        setEditColor(c.color ?? "orange");
        setPanel({ type: "edit", categorie: c });
    };
    const openDelete = (c: Categorie) => setPanel({ type: "delete", categorie: c });
    const close = () => setPanel({ type: "closed" });

    const handleAdd = async () => {
        if (!addType.trim()) return;
        setLoading(true);
        try {
            await createCategorie(storeId, { type: addType.trim() });
            toast.success("Catégorie créée");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    const handleEdit = async () => {
        if (panel.type !== "edit") return;
        if (!editType.trim()) return;
        setLoading(true);
        try {
            await updateCategorie(panel.categorie.categorie_id, storeId, { type: editType.trim() });
            toast.success("Catégorie mise à jour");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if (panel.type !== "delete") return;
        const itemCount = items.filter((i) => i.categorie_id === panel.categorie.categorie_id).length;
        if (itemCount > 0) {
            toast.error("Impossible de supprimer cette catégorie", {
                description: `Elle contient ${itemCount} article${itemCount > 1 ? "s" : ""}. Déplacez ou supprimez-les d'abord.`,
            });
            return;
        }
        setLoading(true);
        try {
            await deleteCategorie(panel.categorie.categorie_id, storeId);
            toast.success("Catégorie supprimée");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    return (
        <>
            <div className="space-y-4 pt-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="Rechercher une catégorie…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
                    </div>
                    <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        <Plus size={16} /> Nouvelle catégorie
                    </button>
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center text-gray-400">
                        <Tag size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">{categories.length === 0 ? "Aucune catégorie. Créez-en une !" : "Aucun résultat."}</p>
                        {categories.length === 0 && (
                            <button onClick={openAdd} className="mt-4 inline-flex items-center gap-2 bg-[hsl(355,16%,20%)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors hover:bg-[hsl(355,16%,16%)]">
                                <Plus size={15} /> Créer la première catégorie
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((c) => {
                            const cat = c as CatWithMeta;
                            const color = getColorById(cat.color ?? "orange");
                            const CatIcon = getIconById(cat.icon ?? "tag");
                            const itemCount = items.filter((i) => i.categorie_id === c.categorie_id).length;
                            return (
                                <div key={c.categorie_id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col">
                                    <button
                                        onClick={() => onDrillDown(c.categorie_id)}
                                        className="flex items-center gap-4 p-5 text-left flex-1 hover:bg-gray-50/60 rounded-t-xl transition-colors"
                                    >
                                        <div className={`h-12 w-12 rounded-xl ${color.bg} flex items-center justify-center flex-shrink-0`}>
                                            <CatIcon size={22} className={color.text} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{c.type}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{itemCount} article{itemCount !== 1 ? "s" : ""}</p>
                                        </div>
                                        <div className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors">
                                            <FolderOpen size={18} />
                                        </div>
                                    </button>
                                    <div className="flex items-center gap-1 px-4 py-3 border-t border-gray-50">
                                        <button onClick={() => openEdit(cat)} className="flex-1 inline-flex items-center justify-center gap-1.5 text-gray-500 hover:text-gray-900 text-xs font-medium py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Pencil size={12} /> Modifier
                                        </button>
                                        <button
                                            onClick={() => openDelete(c)}
                                            disabled={itemCount > 0}
                                            title={itemCount > 0 ? `Contient ${itemCount} article${itemCount > 1 ? "s" : ""} — déplacez-les d'abord` : undefined}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-red-400 hover:text-red-600 hover:bg-red-50 disabled:hover:bg-transparent disabled:hover:text-red-400"
                                        >
                                            <Trash2 size={12} /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <SidePanel
                open={panel.type === "add"}
                onClose={close}
                title="Nouvelle catégorie"
                footer={
                    <>
                        <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                        <button onClick={handleAdd} disabled={loading || !addType.trim()} className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] text-white hover:bg-[hsl(355,16%,16%)] transition-colors disabled:opacity-50">
                            {loading ? "Création…" : "Créer"}
                        </button>
                    </>
                }
            >
                <div className="space-y-5">
                    <Field label="Nom de la catégorie">
                        <input type="text" value={addType} onChange={(e) => setAddType(e.target.value)} placeholder="Ex : Boissons, Snacks…" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
                    </Field>
                    <Field label="Icône">
                        <div className="grid grid-cols-7 gap-1.5">
                            {ICON_OPTIONS.map((opt) => (
                                <button key={opt.id} type="button" onClick={() => setAddIcon(opt.id)} title={opt.label} className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${addIcon === opt.id ? "bg-[hsl(355,16%,20%)] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                                    <opt.Icon size={15} />
                                </button>
                            ))}
                        </div>
                    </Field>
                    <Field label="Couleur">
                        <div className="flex gap-2 flex-wrap">
                            {COLOR_OPTIONS.map((c) => (
                                <button key={c.id} type="button" onClick={() => setAddColor(c.id)} className={`w-8 h-8 rounded-full ${c.active} transition-all ${addColor === c.id ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "opacity-70 hover:opacity-100"}`} />
                            ))}
                        </div>
                    </Field>
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl ${getColorById(addColor).bg} flex items-center justify-center`}>
                            {(() => { const I = getIconById(addIcon); return <I size={22} className={getColorById(addColor).text} />; })()}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{addType || "Nom de la catégorie"}</p>
                            <p className="text-xs text-gray-400">0 article</p>
                        </div>
                    </div>
                </div>
            </SidePanel>

            <SidePanel
                open={panel.type === "edit"}
                onClose={close}
                title="Modifier la catégorie"
                footer={
                    <>
                        <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                        <button onClick={handleEdit} disabled={loading || !editType.trim()} className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] text-white hover:bg-[hsl(355,16%,16%)] transition-colors disabled:opacity-50">
                            {loading ? "Enregistrement…" : "Enregistrer"}
                        </button>
                    </>
                }
            >
                <div className="space-y-5">
                    <Field label="Nom de la catégorie">
                        <input type="text" value={editType} onChange={(e) => setEditType(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
                    </Field>
                    <Field label="Icône">
                        <div className="grid grid-cols-7 gap-1.5">
                            {ICON_OPTIONS.map((opt) => (
                                <button key={opt.id} type="button" onClick={() => setEditIcon(opt.id)} title={opt.label} className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${editIcon === opt.id ? "bg-[hsl(355,16%,20%)] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                                    <opt.Icon size={15} />
                                </button>
                            ))}
                        </div>
                    </Field>
                    <Field label="Couleur">
                        <div className="flex gap-2 flex-wrap">
                            {COLOR_OPTIONS.map((c) => (
                                <button key={c.id} type="button" onClick={() => setEditColor(c.id)} className={`w-8 h-8 rounded-full ${c.active} transition-all ${editColor === c.id ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "opacity-70 hover:opacity-100"}`} />
                            ))}
                        </div>
                    </Field>
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl ${getColorById(editColor).bg} flex items-center justify-center`}>
                            {(() => { const I = getIconById(editIcon); return <I size={22} className={getColorById(editColor).text} />; })()}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{editType || "Nom"}</p>
                        </div>
                    </div>
                </div>
            </SidePanel>

            {panel.type === "delete" && (
                <Overlay onClose={close}>
                    <ConfirmCard title="Supprimer la catégorie" description={<>Supprimer <span className="font-semibold text-gray-900">{panel.categorie.type}</span> ?</>} warning="⚠️ Cette action est irréversible et peut affecter les articles liés." onClose={close} onConfirm={handleDelete} loading={loading} confirmLabel="Supprimer" confirmCls="bg-red-600 hover:bg-red-700" />
                </Overlay>
            )}
        </>
    );
}

function CategoryDrillDown({
    category,
    items,
    categories,
    storeId,
    onBack,
}: {
    category: CatWithMeta;
    items: Item[];
    categories: Categorie[];
    storeId: number;
    onBack: () => void;
}) {
    const router = useRouter();
    const [panel, setPanel] = useState<ItemPanel>({ type: "closed" });
    const [loading, setLoading] = useState(false);

    const [addName, setAddName] = useState("");
    const [addPrice, setAddPrice] = useState("");
    const [addTax, setAddTax] = useState("20");

    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editTax, setEditTax] = useState("");
    const [editCategoryId, setEditCategoryId] = useState<number>(0);

    const color = getColorById(category?.color ?? "orange");
    const CatIcon = getIconById(category?.icon ?? "tag");

    const openAdd = () => { setAddName(""); setAddPrice(""); setAddTax("20"); setPanel({ type: "add", categoryId: category?.categorie_id }); };
    const openEdit = (item: Item) => {
        const taxPercent = Number(item.tax) * 100;
        const priceTTC = Number(item.price) * (1 + Number(item.tax));
        setEditName(item.name);
        setEditPrice(priceTTC.toFixed(2));
        setEditTax(taxPercent.toFixed(0));
        setEditCategoryId(item.categorie_id);
        setPanel({ type: "edit", item });
    };
    const openDelete = (item: Item) => setPanel({ type: "delete", item });
    const openMove = (item: Item) => { setEditCategoryId(item.categorie_id); setPanel({ type: "move", item }); };
    const close = () => setPanel({ type: "closed" });

    const handleAdd = async () => {
        if (!addName.trim() || !addPrice) return;
        setLoading(true);
        try {
            const taxDecimal = parseFloat(addTax) / 100;
            const priceHT = parseFloat(addPrice) / (1 + taxDecimal);
            await createItem(storeId, { name: addName.trim(), price: priceHT, tax: taxDecimal, categorie_id: category.categorie_id });
            toast.success("Article créé");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    const handleEdit = async () => {
        if (panel.type !== "edit") return;
        setLoading(true);
        try {
            const taxDecimal = parseFloat(editTax) / 100;
            const priceHT = parseFloat(editPrice) / (1 + taxDecimal);
            await updateItem(panel.item.item_id, storeId, { name: editName.trim(), price: priceHT, tax: taxDecimal, categorie_id: editCategoryId });
            toast.success("Article mis à jour");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    const handleMove = async () => {
        if (panel.type !== "move") return;
        setLoading(true);
        try {
            await updateItem(panel.item.item_id, storeId, { categorie_id: editCategoryId });
            toast.success("Article déplacé");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if (panel.type !== "delete") return;
        setLoading(true);
        try {
            await deleteItem(panel.item.item_id, storeId);
            toast.success("Article supprimé");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    return (
        <>
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft size={15} /> Toutes les catégories
                    </button>
                    <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        <Plus size={16} /> Ajouter un article
                    </button>
                </div>

                <div className={`flex items-center gap-4 p-5 rounded-2xl ${color.bg}`}>
                    <div className={`h-12 w-12 rounded-xl bg-white/50 flex items-center justify-center`}>
                        <CatIcon size={24} className={color.text} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{category?.type}</h3>
                        <p className="text-sm text-gray-500">{items.length} article{items.length !== 1 ? "s" : ""}</p>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center text-gray-400">
                        <Package size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm mb-4">Aucun article dans cette catégorie.</p>
                        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-[hsl(355,16%,20%)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors hover:bg-[hsl(355,16%,16%)]">
                            <Plus size={15} /> Ajouter le premier article
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => {
                            const priceHT = Number(item.price);
                            const tax = Number(item.tax);
                            const priceTTC = priceHT * (1 + tax);
                            return (
                                <div key={item.item_id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-3">
                                        <div className={`h-9 w-9 rounded-lg ${color.bg} flex items-center justify-center flex-shrink-0`}>
                                            <Package size={16} className={color.text} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1 text-center bg-gray-50 rounded-xl py-3">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">HT</p>
                                            <p className="text-sm font-semibold text-gray-700">{priceHT.toFixed(2)} €</p>
                                        </div>
                                        <div className="border-x border-gray-100">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">TVA</p>
                                            <p className="text-sm font-semibold text-gray-700">{(tax * 100).toFixed(0)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">TTC</p>
                                            <p className="text-sm font-bold text-gray-900">{priceTTC.toFixed(2)} €</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1 pt-1 border-t border-gray-50">
                                        <button onClick={() => openEdit(item)} className="inline-flex items-center justify-center gap-1 text-gray-500 hover:text-gray-900 text-xs font-medium py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                            <Pencil size={11} /> Modifier
                                        </button>
                                        <button onClick={() => openMove(item)} className="inline-flex items-center justify-center gap-1 text-blue-400 hover:text-blue-600 text-xs font-medium py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                                            <MoveRight size={11} /> Déplacer
                                        </button>
                                        <button onClick={() => openDelete(item)} className="inline-flex items-center justify-center gap-1 text-red-400 hover:text-red-600 text-xs font-medium py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                                            <Trash2 size={11} /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <SidePanel open={panel.type === "add"} onClose={close} title="Nouvel article" footer={
                <>
                    <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                    <button onClick={handleAdd} disabled={loading || !addName.trim() || !addPrice} className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] text-white hover:bg-[hsl(355,16%,16%)] transition-colors disabled:opacity-50">
                        {loading ? "Création…" : "Créer"}
                    </button>
                </>
            }>
                <ItemForm name={addName} onNameChange={setAddName} price={addPrice} onPriceChange={setAddPrice} tax={addTax} onTaxChange={setAddTax} />
            </SidePanel>

            <SidePanel open={panel.type === "edit"} onClose={close} title="Modifier l'article" footer={
                <>
                    <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                    <button onClick={handleEdit} disabled={loading || !editName.trim() || !editPrice} className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] text-white hover:bg-[hsl(355,16%,16%)] transition-colors disabled:opacity-50">
                        {loading ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </>
            }>
                <ItemForm name={editName} onNameChange={setEditName} price={editPrice} onPriceChange={setEditPrice} tax={editTax} onTaxChange={setEditTax} />
            </SidePanel>

            <SidePanel open={panel.type === "move"} onClose={close} title="Déplacer l'article" footer={
                <>
                    <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                    <button onClick={handleMove} disabled={loading} className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] text-white hover:bg-[hsl(355,16%,16%)] transition-colors disabled:opacity-50">
                        {loading ? "Déplacement…" : "Déplacer"}
                    </button>
                </>
            }>
                <div className="space-y-4">
                    {panel.type === "move" && <p className="text-sm text-gray-500">Déplacer <span className="font-semibold text-gray-900">{panel.item.name}</span> vers :</p>}
                    <Field label="Catégorie de destination">
                        <div className="space-y-2">
                            {categories.map((cat) => {
                                const c = cat as CatWithMeta;
                                const col = getColorById(c.color ?? "orange");
                                const CI = getIconById(c.icon ?? "tag");
                                const isCurrent = c.categorie_id === (panel.type === "move" ? panel.item.categorie_id : 0);
                                return (
                                    <button key={c.categorie_id} type="button" onClick={() => setEditCategoryId(c.categorie_id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-colors ${editCategoryId === c.categorie_id ? "border-[hsl(355,16%,20%)] bg-[hsl(355,16%,20%)]/5" : "border-gray-200 hover:border-gray-300"} ${isCurrent ? "opacity-50 cursor-default" : ""}`} disabled={isCurrent}>
                                        <div className={`h-7 w-7 rounded-lg ${col.bg} flex items-center justify-center flex-shrink-0`}>
                                            <CI size={13} className={col.text} />
                                        </div>
                                        <span className="font-medium text-gray-700">{c.type}</span>
                                        {isCurrent && <span className="ml-auto text-xs text-gray-400">actuelle</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </Field>
                </div>
            </SidePanel>

            {panel.type === "delete" && (
                <Overlay onClose={close}>
                    <ConfirmCard title="Supprimer l'article" description={<>Supprimer <span className="font-semibold text-gray-900">{panel.item.name}</span> ?</>} warning="⚠️ Cette action est irréversible." onClose={close} onConfirm={handleDelete} loading={loading} confirmLabel="Supprimer" confirmCls="bg-red-600 hover:bg-red-700" />
                </Overlay>
            )}
        </>
    );
}


function AllItemsSection({
    items,
    categories,
    storeId,
}: {
    items: Item[];
    categories: Categorie[];
    storeId: number;
}) {
    const router = useRouter();
    const [panel, setPanel] = useState<ItemPanel>({ type: "closed" });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState<number | "all">("all");
    const [sortKey, setSortKey] = useState<"name" | "price" | "category">("name");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const [addName, setAddName] = useState("");
    const [addPrice, setAddPrice] = useState("");
    const [addTax, setAddTax] = useState("20");
    const [addCategoryId, setAddCategoryId] = useState<number>(categories[0]?.categorie_id ?? 0);

    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editTax, setEditTax] = useState("");
    const [editCategoryId, setEditCategoryId] = useState<number>(0);

    const filtered = useMemo(() => {
        let result = items;
        const q = search.trim().toLowerCase();
        if (q) result = result.filter((i) => i.name.toLowerCase().includes(q));
        if (filterCategory !== "all") result = result.filter((i) => i.categorie_id === filterCategory);
        return [...result].sort((a, b) => {
            let cmp = 0;
            if (sortKey === "name") cmp = a.name.localeCompare(b.name);
            else if (sortKey === "price") cmp = Number(a.price) - Number(b.price);
            else if (sortKey === "category") cmp = a.categorie_id - b.categorie_id;
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [items, search, filterCategory, sortKey, sortDir]);

    const toggleSort = (k: typeof sortKey) => {
        if (sortKey === k) setSortDir((d) => d === "asc" ? "desc" : "asc");
        else { setSortKey(k); setSortDir("asc"); }
    };

    const getCategoryName = (id: number) => categories.find((c) => c.categorie_id === id)?.type ?? "—";
    const getCat = (id: number) => categories.find((c) => c.categorie_id === id) as CatWithMeta | undefined;

    const openAdd = () => { setAddName(""); setAddPrice(""); setAddTax("20"); setAddCategoryId(categories[0]?.categorie_id ?? 0); setPanel({ type: "add" }); };
    const openEdit = (item: Item) => {
        const taxPercent = Number(item.tax) * 100;
        const priceTTC = Number(item.price) * (1 + Number(item.tax));
        setEditName(item.name);
        setEditPrice(priceTTC.toFixed(2));
        setEditTax(taxPercent.toFixed(0));
        setEditCategoryId(item.categorie_id);
        setPanel({ type: "edit", item });
    };
    const openDelete = (item: Item) => setPanel({ type: "delete", item });
    const openMove = (item: Item) => { setEditCategoryId(item.categorie_id); setPanel({ type: "move", item }); };
    const close = () => setPanel({ type: "closed" });

    const handleAdd = async () => {
        if (!addName.trim() || !addPrice || !addCategoryId) return;
        setLoading(true);
        try {
            const taxDecimal = parseFloat(addTax) / 100;
            const priceHT = parseFloat(addPrice) / (1 + taxDecimal);
            await createItem(storeId, { name: addName.trim(), price: priceHT, tax: taxDecimal, categorie_id: addCategoryId });
            toast.success("Article créé");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    const handleEdit = async () => {
        if (panel.type !== "edit") return;
        setLoading(true);
        try {
            const taxDecimal = parseFloat(editTax) / 100;
            const priceHT = parseFloat(editPrice) / (1 + taxDecimal);
            await updateItem(panel.item.item_id, storeId, { name: editName.trim(), price: priceHT, tax: taxDecimal, categorie_id: editCategoryId });
            toast.success("Article mis à jour");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    const handleMove = async () => {
        if (panel.type !== "move") return;
        setLoading(true);
        try {
            await updateItem(panel.item.item_id, storeId, { categorie_id: editCategoryId });
            toast.success("Article déplacé");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if (panel.type !== "delete") return;
        setLoading(true);
        try {
            await deleteItem(panel.item.item_id, storeId);
            toast.success("Article supprimé");
            close();
            router.refresh();
        } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Erreur"); }
        finally { setLoading(false); }
    };

    const SortBtn = ({ k, label }: { k: typeof sortKey; label: string }) => (
        <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 group hover:text-gray-900 transition-colors">
            {label}
            <span className="text-gray-300 group-hover:text-gray-500">
                {sortKey === k ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronUp size={12} className="opacity-30" />}
            </span>
        </button>
    );

    return (
        <>
            <div className="space-y-4 pt-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="text" placeholder="Rechercher un article…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
                    </div>
                    <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value === "all" ? "all" : Number(e.target.value))} className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white">
                        <option value="all">Toutes les catégories</option>
                        {categories.map((c) => <option key={c.categorie_id} value={c.categorie_id}>{c.type}</option>)}
                    </select>
                    <button onClick={openAdd} disabled={categories.length === 0} className="inline-flex items-center gap-2 bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Plus size={16} /> Nouvel article
                    </button>
                </div>

                <p className="text-xs text-gray-400">{filtered.length} article{filtered.length !== 1 ? "s" : ""}{filterCategory !== "all" ? ` dans "${getCategoryName(filterCategory as number)}"` : ""}</p>

                {filtered.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center text-gray-400">
                        <Package size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">{items.length === 0 ? "Aucun article." : "Aucun résultat."}</p>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400 text-xs bg-gray-50/60">
                                    <th className="px-4 py-3 text-left font-medium"><SortBtn k="name" label="Article" /></th>
                                    <th className="px-4 py-3 text-left font-medium"><SortBtn k="category" label="Catégorie" /></th>
                                    <th className="px-4 py-3 text-right font-medium"><SortBtn k="price" label="HT" /></th>
                                    <th className="px-4 py-3 text-right font-medium">TVA</th>
                                    <th className="px-4 py-3 text-right font-medium">TTC</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((item) => {
                                    const priceHT = Number(item.price);
                                    const tax = Number(item.tax);
                                    const cat = getCat(item.categorie_id);
                                    const col = getColorById(cat?.color ?? "orange");
                                    const CI = getIconById(cat?.icon ?? "tag");
                                    return (
                                        <tr key={item.item_id} className="hover:bg-gray-50/40 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`h-7 w-7 rounded-lg ${col.bg} flex items-center justify-center flex-shrink-0`}>
                                                        <Package size={13} className={col.text} />
                                                    </div>
                                                    <span className="font-medium text-gray-900">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${col.bg} ${col.text}`}>
                                                    <CI size={10} />
                                                    {getCategoryName(item.categorie_id)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-600 font-medium">{priceHT.toFixed(2)} €</td>
                                            <td className="px-4 py-3 text-right text-gray-400">{(tax * 100).toFixed(0)}%</td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-900">{(priceHT * (1 + tax)).toFixed(2)} €</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="inline-flex items-center gap-0.5">
                                                    <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors" title="Modifier">
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button onClick={() => openMove(item)} className="p-1.5 text-blue-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Déplacer">
                                                        <MoveRight size={13} />
                                                    </button>
                                                    <button onClick={() => openDelete(item)} className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Supprimer">
                                                        <Trash2 size={13} />
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

            <SidePanel open={panel.type === "add"} onClose={close} title="Nouvel article" footer={
                <>
                    <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                    <button onClick={handleAdd} disabled={loading || !addName.trim() || !addPrice} className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] text-white hover:bg-[hsl(355,16%,16%)] transition-colors disabled:opacity-50">
                        {loading ? "Création…" : "Créer"}
                    </button>
                </>
            }>
                <div className="space-y-5">
                    <ItemForm name={addName} onNameChange={setAddName} price={addPrice} onPriceChange={setAddPrice} tax={addTax} onTaxChange={setAddTax} />
                    <Field label="Catégorie">
                        <select value={addCategoryId} onChange={(e) => setAddCategoryId(Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-white">
                            {categories.map((c) => <option key={c.categorie_id} value={c.categorie_id}>{c.type}</option>)}
                        </select>
                    </Field>
                </div>
            </SidePanel>

            <SidePanel open={panel.type === "edit"} onClose={close} title="Modifier l'article" footer={
                <>
                    <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                    <button onClick={handleEdit} disabled={loading || !editName.trim() || !editPrice} className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] text-white hover:bg-[hsl(355,16%,16%)] transition-colors disabled:opacity-50">
                        {loading ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </>
            }>
                <div className="space-y-5">
                    <ItemForm name={editName} onNameChange={setEditName} price={editPrice} onPriceChange={setEditPrice} tax={editTax} onTaxChange={setEditTax} />
                    <Field label="Catégorie">
                        <select value={editCategoryId} onChange={(e) => setEditCategoryId(Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-white">
                            {categories.map((c) => <option key={c.categorie_id} value={c.categorie_id}>{c.type}</option>)}
                        </select>
                    </Field>
                </div>
            </SidePanel>

            <SidePanel open={panel.type === "move"} onClose={close} title="Déplacer l'article" footer={
                <>
                    <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                    <button onClick={handleMove} disabled={loading} className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] text-white hover:bg-[hsl(355,16%,16%)] transition-colors disabled:opacity-50">
                        {loading ? "Déplacement…" : "Déplacer"}
                    </button>
                </>
            }>
                <div className="space-y-4">
                    {panel.type === "move" && <p className="text-sm text-gray-500">Déplacer <span className="font-semibold text-gray-900">{panel.item.name}</span> vers :</p>}
                    <Field label="Catégorie de destination">
                        <div className="space-y-2">
                            {categories.map((cat) => {
                                const c = cat as CatWithMeta;
                                const col = getColorById(c.color ?? "orange");
                                const CI = getIconById(c.icon ?? "tag");
                                const isCurrent = c.categorie_id === (panel.type === "move" ? panel.item.categorie_id : 0);
                                return (
                                    <button key={c.categorie_id} type="button" onClick={() => setEditCategoryId(c.categorie_id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-colors ${editCategoryId === c.categorie_id ? "border-[hsl(355,16%,20%)] bg-[hsl(355,16%,20%)]/5" : "border-gray-200 hover:border-gray-300"} ${isCurrent ? "opacity-50 cursor-default" : ""}`} disabled={isCurrent}>
                                        <div className={`h-7 w-7 rounded-lg ${col.bg} flex items-center justify-center flex-shrink-0`}>
                                            <CI size={13} className={col.text} />
                                        </div>
                                        <span className="font-medium text-gray-700">{c.type}</span>
                                        {isCurrent && <span className="ml-auto text-xs text-gray-400">actuelle</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </Field>
                </div>
            </SidePanel>

            {panel.type === "delete" && (
                <Overlay onClose={close}>
                    <ConfirmCard title="Supprimer l'article" description={<>Supprimer <span className="font-semibold text-gray-900">{panel.item.name}</span> ?</>} warning="⚠️ Cette action est irréversible." onClose={close} onConfirm={handleDelete} loading={loading} confirmLabel="Supprimer" confirmCls="bg-red-600 hover:bg-red-700" />
                </Overlay>
            )}
        </>
    );
}

function TabButton({ active, onClick, icon: Icon, label, count }: {
    active: boolean; onClick: () => void; icon: React.ElementType; label: string; count: number;
}) {
    return (
        <button onClick={onClick} className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${active ? "border-orange-500 text-orange-600" : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200"}`}>
            <Icon size={16} />{label}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${active ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>{count}</span>
        </button>
    );
}

function SidePanel({ open, onClose, title, footer, children }: {
    open: boolean; onClose: () => void; title: string; footer: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
            <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
            <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X size={18} /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">{footer}</div>
            </div>
        </div>
    );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>{children}</div>
        </div>
    );
}

function ConfirmCard({ title, description, warning, onClose, onConfirm, loading, confirmLabel, confirmCls }: {
    title: string; description: React.ReactNode; warning: string; onClose: () => void; onConfirm: () => void; loading: boolean; confirmLabel: string; confirmCls: string;
}) {
    return (
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-3">
                <p className="text-sm text-gray-600">{description}</p>
                <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">{warning}</p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                <button onClick={onConfirm} disabled={loading} className={`px-4 py-2 text-sm rounded-xl text-white transition-colors disabled:opacity-50 ${confirmCls}`}>{loading ? "Suppression…" : confirmLabel}</button>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}

function ItemForm({ name, onNameChange, price, onPriceChange, tax, onTaxChange }: {
    name: string; onNameChange: (v: string) => void;
    price: string; onPriceChange: (v: string) => void;
    tax: string; onTaxChange: (v: string) => void;
}) {
    const priceTTC = parseFloat(price || "0");
    const taxPercent = parseFloat(tax || "0");
    const priceHT = taxPercent > 0 ? priceTTC / (1 + taxPercent / 100) : priceTTC;

    return (
        <div className="space-y-4">
            <Field label="Nom de l'article">
                <input type="text" value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="Ex : Café Espresso" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Prix TTC (€)">
                    <div className="relative">
                        <Euro size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="number" step="0.01" min="0" value={price} onChange={(e) => onPriceChange(e.target.value)} placeholder="0.00" className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
                    </div>
                </Field>
                <Field label="TVA (%)">
                    <div className="relative">
                        <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="number" step="0.1" min="0" max="100" value={tax} onChange={(e) => onTaxChange(e.target.value)} placeholder="20" className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
                    </div>
                </Field>
            </div>
            {price && tax && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Prix HT</span>
                    <span className="font-bold text-gray-900">
                        {priceHT.toFixed(2)} €
                        <span className="text-xs text-gray-400 font-normal ml-1">(TVA {taxPercent.toFixed(0)}%)</span>
                    </span>
                </div>
            )}
        </div>
    );
}
