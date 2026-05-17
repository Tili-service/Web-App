"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Plus, Pencil, X, Users, UserCog, User,
    CircleOff, CheckCircle2, Copy, Eye, EyeOff,
    RefreshCw, Search, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Profile } from "@/lib/getProfiles";
import createProfile, { ProfileWithPin } from "@/lib/createProfile";
import updateProfile from "@/lib/updateProfile";

const PAGE_SIZE = 12;

const LEVEL_OPTIONS = [
    { value: 2, label: "Admin",   Icon: UserCog },
    { value: 3, label: "Manager", Icon: User    },
    { value: 4, label: "Employé", Icon: User    },
];

const LEVEL_META: Record<number, {
    label: string;
    badgeCls: string;
    avatarCls: string;
    Icon: React.ElementType;
}> = {
    2: { label: "Admin",   badgeCls: "bg-blue-100 text-blue-700",      avatarCls: "bg-blue-100 text-blue-700",      Icon: UserCog },
    3: { label: "Manager", badgeCls: "bg-emerald-100 text-emerald-700", avatarCls: "bg-emerald-100 text-emerald-700", Icon: User    },
    4: { label: "Employé", badgeCls: "bg-gray-100 text-gray-500",       avatarCls: "bg-gray-100 text-gray-500",       Icon: User    },
};

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
}

type PanelState =
    | { type: "closed" }
    | { type: "add" }
    | { type: "add_pin"; profile: ProfileWithPin }
    | { type: "edit"; profile: Profile }
    | { type: "edit_pin"; profile: ProfileWithPin };

export default function ProfilesClient({
    profiles,
    storeId,
}: {
    profiles: Profile[];
    storeId: number;
}) {
    const router = useRouter();
    const [panel, setPanel] = useState<PanelState>({ type: "closed" });
    const [loading, setLoading] = useState(false);
    const [showPin, setShowPin] = useState(false);

    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<number | "all">("all");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        let rows = profiles;
        const q = search.trim().toLowerCase();
        if (q) rows = rows.filter((p) => p.name.toLowerCase().includes(q));
        if (filterRole !== "all") rows = rows.filter((p) => p.level_access === filterRole);
        if (filterStatus === "active") rows = rows.filter((p) => p.is_active);
        if (filterStatus === "inactive") rows = rows.filter((p) => !p.is_active);
        return [...rows].sort((a, b) => a.name.localeCompare(b.name));
    }, [profiles, search, filterRole, filterStatus]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const activeCount = profiles.filter((p) => p.is_active).length;
    const inactiveCount = profiles.filter((p) => !p.is_active).length;

    const resetPage = () => setPage(1);

    const [addName, setAddName] = useState("");
    const [addLevel, setAddLevel] = useState(4);
    const [editName, setEditName] = useState("");
    const [editLevel, setEditLevel] = useState(4);
    const [editActive, setEditActive] = useState(true);
    const [generatedPin, setGeneratedPin] = useState<string | null>(null);
    const [showGenPin, setShowGenPin] = useState(false);

    const openAdd = () => {
        setAddName("");
        setAddLevel(4);
        setPanel({ type: "add" });
    };

    const openEdit = (p: Profile) => {
        setEditName(p.name);
        setEditLevel(p.level_access);
        setEditActive(p.is_active);
        setGeneratedPin(null);
        setShowGenPin(false);
        setPanel({ type: "edit", profile: p });
    };

    const generatePin = () => {
        setGeneratedPin(String(Math.floor(100000 + Math.random() * 900000)));
        setShowGenPin(false);
    };

    const handleAdd = async () => {
        if (!addName.trim()) return;
        setLoading(true);
        try {
            const created = await createProfile(storeId, { name: addName.trim(), level_access: addLevel });
            setShowPin(false);
            setPanel({ type: "add_pin", profile: created });
            router.refresh();
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        if (panel.type !== "edit") return;
        if (!editName.trim()) return;
        setLoading(true);
        try {
            const payload: { name: string; level_access: number; is_active: boolean; pin?: string } = {
                name: editName.trim(),
                level_access: editLevel,
                is_active: editActive,
            };
            if (generatedPin) payload.pin = generatedPin;
            await updateProfile(panel.profile.profile_id, storeId, payload);
            router.refresh();
            if (generatedPin) {
                const fake: ProfileWithPin = {
                    profile_id: panel.type === "edit" ? panel.profile.profile_id : 0,
                    store_id: panel.type === "edit" ? panel.profile.store_id : storeId,
                    name: editName.trim(),
                    pin: generatedPin,
                    level_access: editLevel,
                    is_active: editActive,
                };
                setPanel({ type: "edit_pin", profile: fake });
                setShowPin(false);
            } else {
                toast.success("Profil mis à jour");
                setPanel({ type: "closed" });
            }
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur lors de la modification");
        } finally {
            setLoading(false);
        }
    };

    const close = () => setPanel({ type: "closed" });

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profils</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {profiles.length} profil{profiles.length !== 1 ? "s" : ""} enregistré{profiles.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                    <Plus size={15} /> Ajouter un profil
                </button>
            </div>

            {profiles.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                        { label: "Total",    value: profiles.length, cls: "text-gray-900"    },
                        { label: "Actifs",   value: activeCount,     cls: "text-emerald-600" },
                        { label: "Inactifs", value: inactiveCount,   cls: "text-gray-400"    },
                    ].map((s) => (
                        <div key={s.label} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm">
                            <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
                <div className="relative flex-1 min-w-[160px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Rechercher un profil…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => { setFilterRole(e.target.value === "all" ? "all" : Number(e.target.value)); resetPage(); }}
                    className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                >
                    <option value="all">Tous les rôles</option>
                    {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value as "all" | "active" | "inactive"); resetPage(); }}
                    className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                </select>
            </div>

            {profiles.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center mt-2">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                        <Users size={24} className="text-gray-300" />
                    </div>
                    <p className="font-semibold text-gray-700 mb-1">Aucun profil</p>
                    <p className="text-sm text-gray-400 mb-5">Créez des profils pour chacun de vos employés.</p>
                    <button
                        onClick={openAdd}
                        className="inline-flex items-center gap-2 bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                    >
                        <Plus size={15} /> Créer le premier profil
                    </button>
                </div>
            ) : pageRows.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center mt-2">
                    <p className="text-sm text-gray-400">Aucun résultat pour ces filtres.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                    {pageRows.map((p) => {
                        const meta = LEVEL_META[p.level_access] ?? LEVEL_META[4];
                        return (
                            <div
                                key={p.profile_id}
                                className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${meta.avatarCls}`}>
                                        {getInitials(p.name)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium mt-0.5 px-2 py-0.5 rounded-full ${meta.badgeCls}`}>
                                            <meta.Icon size={11} />
                                            {meta.label}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    {p.is_active ? (
                                        <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                                            <CheckCircle2 size={13} /> Actif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                                            <CircleOff size={13} /> Inactif
                                        </span>
                                    )}
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-900 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <Pencil size={12} /> Modifier
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-1 py-2 text-xs text-gray-400">
                    <span>{filtered.length} résultat{filtered.length !== 1 ? "s" : ""} — page {safePage}/{totalPages}</span>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors">
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${n === safePage ? "bg-[hsl(355,16%,20%)] text-white" : "hover:bg-gray-100"}`}
                            >{n}</button>
                        ))}
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            <SidePanel
                open={panel.type === "add" || panel.type === "add_pin"}
                onClose={close}
                title={panel.type === "add_pin" ? "Profil créé ✓" : "Nouveau profil"}
                footer={
                    panel.type === "add_pin" ? (
                        <button onClick={close} className="w-full px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] text-white hover:bg-[hsl(355,16%,16%)] transition-colors">
                            J&apos;ai noté le PIN, fermer
                        </button>
                    ) : (
                        <>
                            <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">Annuler</button>
                            <button onClick={handleAdd} disabled={loading || !addName.trim()} className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white transition-colors disabled:opacity-50">
                                {loading ? "Création…" : "Créer le profil"}
                            </button>
                        </>
                    )
                }
            >
                {panel.type === "add_pin" ? (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Le profil <span className="font-semibold text-gray-900">{panel.profile.name}</span> a été créé avec succès.
                        </p>
                        <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                            ⚠️ Notez ce PIN maintenant — il ne sera plus affiché.
                        </p>
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-4">
                            <span className="text-2xl font-mono tracking-widest text-gray-900 select-all">
                                {showPin ? panel.profile.pin : "••••••"}
                            </span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setShowPin((v) => !v)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                    {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                {showPin && (
                                    <button onClick={() => { navigator.clipboard.writeText(panel.profile.pin); toast.success("PIN copié"); }} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        <Copy size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <Field label="Nom du profil">
                            <input type="text" value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="Ex : Jean Dupont" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
                        </Field>
                        <Field label="Rôle">
                            <LevelSelect value={addLevel} onChange={setAddLevel} />
                        </Field>
                    </div>
                )}
            </SidePanel>

            <SidePanel
                open={panel.type === "edit" || panel.type === "edit_pin"}
                onClose={close}
                title={panel.type === "edit_pin" ? "PIN régénéré ✓" : "Modifier le profil"}
                footer={
                    <>
                        <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            Annuler
                        </button>
                        <button
                            onClick={() => handleEdit()}
                            disabled={loading || !editName.trim()}
                            className="px-4 py-2 text-sm rounded-xl bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white transition-colors disabled:opacity-50"
                        >
                            {loading ? "Enregistrement…" : "Enregistrer"}
                        </button>
                    </>
                }
            >
                <div className="space-y-5">
                    <Field label="Nom du profil">
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                        />
                    </Field>
                    <Field label="Rôle">
                        <LevelSelect value={editLevel} onChange={setEditLevel} />
                    </Field>
                    <Field label="PIN">
                        {generatedPin ? (
                            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                                <span className="flex-1 font-mono tracking-widest text-gray-900 text-sm select-all">
                                    {showGenPin ? generatedPin : "••••••"}
                                </span>
                                <button type="button" onClick={() => setShowGenPin((v) => !v)} className="text-gray-400 hover:text-gray-700">
                                    {showGenPin ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                                <button type="button" onClick={() => { navigator.clipboard.writeText(generatedPin); toast.success("PIN copié"); }} className="text-gray-400 hover:text-gray-700">
                                    <Copy size={15} />
                                </button>
                                <button type="button" onClick={() => setGeneratedPin(null)} className="text-gray-400 hover:text-red-500">
                                    <X size={15} />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={generatePin}
                                className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 hover:border-orange-300 hover:bg-orange-50 px-3 py-2 rounded-xl transition-colors w-full justify-center"
                            >
                                <RefreshCw size={14} /> Régénérer le PIN
                            </button>
                        )}
                    </Field>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={editActive}
                            onChange={(e) => setEditActive(e.target.checked)}
                            className="w-4 h-4 rounded accent-orange-500"
                        />
                        Profil actif
                    </label>
                </div>
            </SidePanel>

        </>
    );
}

/* ── Helpers ── */

function SidePanel({ open, onClose, title, footer, children }: {
    open: boolean;
    onClose: () => void;
    title: string;
    footer: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
            <div
                className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />
            <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
                    {footer}
                </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}

function LevelSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {LEVEL_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-xs font-medium transition-colors ${
                        value === opt.value
                            ? "border-[hsl(355,16%,20%)] bg-[hsl(355,16%,20%)] text-white"
                            : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <opt.Icon size={15} />
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
