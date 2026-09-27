"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Check, FolderPlus, Loader2, Pencil, Trash2, X } from "lucide-react";
import { createCatalog, updateCatalog, deleteCatalog } from "@/services/catalog.service";
import type { Catalog } from "@/lib/types";

type Mode = "idle" | "add" | "edit" | "delete";

export default function CatalogSwitcher({
    catalogs,
    storeId,
    currentId,
}: {
    catalogs: Catalog[];
    storeId: string;
    currentId: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [mode, setMode] = useState<Mode>("idle");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const current = catalogs.find((c) => c.catalog_id === currentId);

    const select = (id: string) => router.push(`${pathname}?catalog=${id}`);

    const open = (m: Mode) => {
        setName(m === "edit" ? current?.name ?? "" : "");
        setMode(m);
    };

    const run = async (action: () => Promise<void>, success: string) => {
        setLoading(true);
        try {
            await action();
            toast.success(success);
            setMode("idle");
            router.refresh();
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    const submit = () => {
        const value = name.trim();
        if (!value) return;
        if (mode === "add") {
            run(async () => {
                const created = await createCatalog(storeId, { name: value });
                router.push(`${pathname}?catalog=${created.catalog_id}`);
            }, "Catalogue créé");
        } else if (mode === "edit") {
            run(async () => { await updateCatalog(currentId, storeId, { name: value }); }, "Catalogue modifié");
        }
    };

    const confirmDelete = () =>
        run(async () => {
            await deleteCatalog(currentId, storeId);
            router.push(pathname);
        }, "Catalogue supprimé");

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-3 flex flex-wrap items-center gap-2">
            {mode === "idle" && (
                <>
                    <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
                        {catalogs.map((c) => (
                            <button
                                key={c.catalog_id}
                                onClick={() => select(c.catalog_id)}
                                className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition-colors ${
                                    c.catalog_id === currentId
                                        ? "bg-brand-ink text-white"
                                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-1">
                        <IconButton label="Nouveau catalogue" onClick={() => open("add")}><FolderPlus size={16} /></IconButton>
                        <IconButton label="Renommer" onClick={() => open("edit")}><Pencil size={16} /></IconButton>
                        <IconButton label="Supprimer" onClick={() => open("delete")} danger><Trash2 size={16} /></IconButton>
                    </div>
                </>
            )}

            {(mode === "add" || mode === "edit") && (
                <>
                    <input
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") setMode("idle"); }}
                        placeholder="Nom du catalogue"
                        className="flex-1 min-w-[12rem] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    />
                    <button
                        onClick={submit}
                        disabled={loading || !name.trim()}
                        className="inline-flex items-center gap-2 bg-brand-ink hover:bg-brand-ink-strong text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                        {mode === "add" ? "Créer" : "Enregistrer"}
                    </button>
                    <IconButton label="Annuler" onClick={() => setMode("idle")}><X size={16} /></IconButton>
                </>
            )}

            {mode === "delete" && (
                <>
                    <p className="flex-1 text-sm text-gray-600">
                        Supprimer <span className="font-semibold text-gray-900">{current?.name}</span> ? Ses catégories et articles seront perdus.
                    </p>
                    <button
                        onClick={confirmDelete}
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        Supprimer
                    </button>
                    <IconButton label="Annuler" onClick={() => setMode("idle")}><X size={16} /></IconButton>
                </>
            )}
        </div>
    );
}

function IconButton({
    children,
    label,
    onClick,
    danger,
}: {
    children: React.ReactNode;
    label: string;
    onClick: () => void;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            onClick={onClick}
            className={`h-9 w-9 inline-flex items-center justify-center rounded-xl text-gray-400 transition-colors ${
                danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-gray-100 hover:text-gray-700"
            }`}
        >
            {children}
        </button>
    );
}
