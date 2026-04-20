"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, X, Users, UserCog, User, CircleOff, CheckCircle2, Copy, Eye, EyeOff, RefreshCw, ChevronsUpDown, ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Profile } from "@/lib/getProfiles";
import createProfile, { ProfileWithPin } from "@/lib/createProfile";
import updateProfile from "@/lib/updateProfile";

const PAGE_SIZE = 10;

type SortKey = "name" | "level_access" | "is_active";
type SortDir = "asc" | "desc";

const LEVEL_OPTIONS = [
    { value: 2, label: "Admin",   Icon: UserCog, color: "text-blue-700"  },
    { value: 3, label: "Manager", Icon: User,    color: "text-green-700" },
    { value: 4, label: "Employé", Icon: User,    color: "text-gray-600"  },
];

const LEVEL_BADGE: Record<number, { label: string; cls: string; Icon: React.ElementType }> = {
    2: { label: "Admin",  cls: "bg-blue-100 text-blue-700",     Icon: UserCog     },
    3: { label: "Manager", cls: "bg-green-100 text-green-700",   Icon: User        },
    4: { label: "Employé",  cls: "bg-gray-100 text-gray-600",     Icon: User        },
};

function Badge({ level }: { level: number }) {
    const info = LEVEL_BADGE[level] ?? { label: `Niveau ${level}`, cls: "bg-gray-100 text-gray-600", Icon: User };
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${info.cls}`}>
            {info.label}
        </span>
    );
}

type ModalState =
    | { type: "closed" }
    | { type: "add" }
    | { type: "edit"; profile: Profile }
    | { type: "pin_reveal"; profile: ProfileWithPin; context: "created" | "regenerated" };

export default function ProfilesClient({ profiles, storeId }: { profiles: Profile[]; storeId: number }) {
    const router = useRouter();
    const [modal, setModal] = useState<ModalState>({ type: "closed" });
    const [loading, setLoading] = useState(false);
    const [showPin, setShowPin] = useState(false);

    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState<number | "all">("all");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
    const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "name", dir: "asc" });
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        let rows = profiles;
        const q = search.trim().toLowerCase();
        if (q) rows = rows.filter((p) => p.name.toLowerCase().includes(q));
        if (filterRole !== "all") rows = rows.filter((p) => p.level_access === filterRole);
        if (filterStatus === "active") rows = rows.filter((p) => p.is_active);
        if (filterStatus === "inactive") rows = rows.filter((p) => !p.is_active);
        rows = [...rows].sort((a, b) => {
            let cmp = 0;
            if (sort.key === "name") cmp = a.name.localeCompare(b.name);
            else if (sort.key === "level_access") cmp = a.level_access - b.level_access;
            else if (sort.key === "is_active") cmp = Number(b.is_active) - Number(a.is_active);
            return sort.dir === "asc" ? cmp : -cmp;
        });
        return rows;
    }, [profiles, search, filterRole, filterStatus, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const toggleSort = (key: SortKey) => {
        setSort((prev) => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
        setPage(1);
    };

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
        setModal({ type: "add" });
    };

    const openEdit = (p: Profile) => {
        setEditName(p.name);
        setEditLevel(p.level_access);
        setEditActive(p.is_active);
        setGeneratedPin(null);
        setShowGenPin(false);
        setModal({ type: "edit", profile: p });
    };

    const generatePin = () => {
        const pin = String(Math.floor(100000 + Math.random() * 900000));
        setGeneratedPin(pin);
        setShowGenPin(false);
    };

    const handleAdd = async () => {
        if (!addName.trim()) return;
        setLoading(true);
        try {
            const created = await createProfile(storeId, { name: addName.trim(), level_access: addLevel });
            setModal({ type: "pin_reveal", profile: created, context: "created" });
            setShowPin(false);
            router.refresh();
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur lors de la création");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        if (modal.type !== "edit") return;
        if (!editName.trim()) return;
        setLoading(true);
        try {
            const payload: { name: string; level_access: number; is_active: boolean; pin?: string } = {
                name: editName.trim(),
                level_access: editLevel,
                is_active: editActive,
            };
            if (generatedPin) payload.pin = generatedPin;
            await updateProfile(modal.profile.profile_id, storeId, payload);
            router.refresh();
            if (generatedPin) {
                const fake: ProfileWithPin = {
                    profile_id: modal.profile.profile_id,
                    store_id: modal.profile.store_id,
                    name: editName.trim(),
                    pin: generatedPin,
                    level_access: editLevel,
                    is_active: editActive,
                };
                setModal({ type: "pin_reveal", profile: fake, context: "regenerated" });
                setShowPin(false);
            } else {
                toast.success("Profil mis à jour");
                setModal({ type: "closed" });
            }
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Erreur lors de la modification");
        } finally {
            setLoading(false);
        }
    };

    const close = () => setModal({ type: "closed" });

    return (
        <>
            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        <Users size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Profils</h1>
                        <p className="text-sm text-slate-500">
                            {profiles.length} profil{profiles.length !== 1 ? "s" : ""} enregistré{profiles.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                >
                    <Plus size={16} /> Ajouter un profil
                </button>
            </div>

            {/* ── Filters bar ── */}
            <div className="flex flex-wrap gap-2 mt-4">
                <div className="relative flex-1 min-w-[160px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un nom…"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => { setFilterRole(e.target.value === "all" ? "all" : Number(e.target.value)); resetPage(); }}
                    className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
                >
                    <option value="all">Tous les rôles</option>
                    {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value as "all" | "active" | "inactive"); resetPage(); }}
                    className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
                >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                </select>
            </div>

            {/* ── Table ── */}
            {profiles.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-10 text-center text-slate-400">
                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucun profil pour ce magasin.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mt-2">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wide">
                                <SortTh label="Nom" sortKey="name" current={sort} onSort={toggleSort} />
                                <SortTh label="Rôle" sortKey="level_access" current={sort} onSort={toggleSort} />
                                <SortTh label="Statut" sortKey="is_active" current={sort} onSort={toggleSort} />
                                <th className="px-5 py-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {pageRows.length === 0 ? (
                                <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400 text-sm">Aucun résultat pour ces filtres.</td></tr>
                            ) : pageRows.map((p) => (
                                <tr key={p.profile_id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-slate-800">{p.name}</td>
                                    <td className="px-5 py-3.5"><Badge level={p.level_access} /></td>
                                    <td className="px-5 py-3.5">
                                        {p.is_active ? (
                                            <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                                                <CheckCircle2 size={14} /> Actif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-medium">
                                                <CircleOff size={14} /> Inactif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button
                                            onClick={() => openEdit(p)}
                                            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                        >
                                            <Pencil size={13} /> Modifier
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ── Pagination ── */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
                            <span>{filtered.length} résultat{filtered.length !== 1 ? "s" : ""} — page {safePage}/{totalPages}</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={safePage === 1}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setPage(n)}
                                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                                            n === safePage ? "bg-slate-900 text-white" : "hover:bg-slate-100"
                                        }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={safePage === totalPages}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
                                >
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {modal.type === "add" && (
                <Overlay onClose={close}>
                    <ModalCard title="Nouveau profil" onClose={close}>
                        <div className="space-y-4">
                            <Field label="Nom">
                                <input
                                    autoFocus
                                    type="text"
                                    value={addName}
                                    onChange={(e) => setAddName(e.target.value)}
                                    placeholder="Ex : Jean Dupont"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </Field>
                            <Field label="Rôle">
                                <LevelSelect value={addLevel} onChange={setAddLevel} />
                            </Field>
                        </div>
                        <ModalFooter>
                            <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                                Annuler
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={loading || !addName.trim()}
                                className="px-4 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Création…" : "Créer le profil"}
                            </button>
                        </ModalFooter>
                    </ModalCard>
                </Overlay>
            )}

            {modal.type === "edit" && (
                <Overlay onClose={close}>
                    <ModalCard title="Modifier le profil" onClose={close}>
                        <div className="space-y-4">
                            <Field label="Nom">
                                <input
                                    autoFocus
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </Field>
                            <Field label="Rôle">
                                <LevelSelect value={editLevel} onChange={setEditLevel} />
                            </Field>
                            <Field label="PIN">
                                {generatedPin ? (
                                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                                        <span className="flex-1 font-mono tracking-widest text-slate-900 text-sm select-all">
                                            {showGenPin ? generatedPin : "••••••"}
                                        </span>
                                        <button type="button" onClick={() => setShowGenPin((v) => !v)} className="text-slate-400 hover:text-slate-700">
                                            {showGenPin ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                        <button type="button" onClick={() => { navigator.clipboard.writeText(generatedPin); toast.success("PIN copié"); }} className="text-slate-400 hover:text-slate-700">
                                            <Copy size={15} />
                                        </button>
                                        <button type="button" onClick={() => setGeneratedPin(null)} className="text-slate-400 hover:text-red-500">
                                            <X size={15} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={generatePin}
                                        className="inline-flex items-center gap-2 text-sm text-slate-600 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors w-full justify-center"
                                    >
                                        <RefreshCw size={14} /> Régénérer le PIN
                                    </button>
                                )}
                            </Field>
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={editActive}
                                    onChange={(e) => setEditActive(e.target.checked)}
                                    className="w-4 h-4 rounded focus:ring-slate-400"
                                />
                                Profil actif
                            </label>
                        </div>
                        <ModalFooter>
                            <button onClick={close} className="px-4 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                                Annuler
                            </button>
                            <button
                                onClick={handleEdit}
                                disabled={loading || !editName.trim()}
                                className="px-4 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Enregistrement…" : "Enregistrer"}
                            </button>
                        </ModalFooter>
                    </ModalCard>
                </Overlay>
            )}

            {modal.type === "pin_reveal" && (
                <Overlay onClose={close}>
                    <ModalCard title={modal.context === "created" ? "Profil créé ✓" : "PIN régénéré ✓"} onClose={close}>
                        <div className="space-y-4 text-center">
                            <p className="text-sm text-slate-600">
                                {modal.context === "created"
                                    ? <>Le profil <span className="font-semibold text-slate-900">{modal.profile.name}</span> a été créé avec succès.</>
                                    : <>Le PIN du profil <span className="font-semibold text-slate-900">{modal.profile.name}</span> a été réinitialisé.</>}
                            </p>
                            <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                                Notez ce PIN maintenant — il ne sera plus affiché.
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl font-mono tracking-widest text-slate-900 select-all">
                                    {showPin ? modal.profile.pin : "••••••"}
                                </span>
                                <button onClick={() => setShowPin((v) => !v)} className="text-slate-400 hover:text-slate-700 transition-colors">
                                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {showPin && (
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(modal.profile.pin); toast.success("PIN copié"); }}
                                        className="text-slate-400 hover:text-slate-700 transition-colors"
                                    >
                                        <Copy size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <ModalFooter>
                            <button
                                onClick={close}
                                className="w-full px-4 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition-colors"
                            >
                                J'ai noté le PIN, fermer
                            </button>
                        </ModalFooter>
                    </ModalCard>
                </Overlay>
            )}
        </>
    );
}

/* ── Helpers ── */

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
            onClick={onClose}
        >
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

function SortTh({ label, sortKey, current, onSort }: {
    label: string;
    sortKey: SortKey;
    current: { key: SortKey; dir: SortDir };
    onSort: (k: SortKey) => void;
}) {
    const active = current.key === sortKey;
    return (
        <th className="px-5 py-3 text-left font-medium">
            <button
                type="button"
                onClick={() => onSort(sortKey)}
                className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors"
            >
                {label}
                {active ? (
                    current.dir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                ) : (
                    <ChevronsUpDown size={13} className="opacity-40" />
                )}
            </button>
        </th>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
            {children}
        </div>
    );
}

function LevelSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {LEVEL_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${
                        value === opt.value
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                >
                    <opt.Icon size={14} className={value === opt.value ? "" : opt.color} />
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
