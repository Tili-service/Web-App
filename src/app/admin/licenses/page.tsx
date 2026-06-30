
"use client";
import { useLoading } from "../layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { plans } from "@/data/plans";
import { getLicenses, handleRefundLicense } from "@/services/license.service";
import type { License } from "@/lib/types";
import Link from "next/link";
import { CreditCard, CheckCircle2, XCircle, Store, Calendar, Plus, Sparkles, Check, X } from "lucide-react";

function formatDate(d: string) {
    return new Date(d).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

function isExpired(d: string) {
    return new Date(d) < new Date();
}

export default function LicensesPage() {
    const { setIsLoading } = useLoading();
    const [licences, setLicenses] = useState<License[]>([]);
    const [refundTarget, setRefundTarget] = useState<string | null>(null);
    const [refunding, setRefunding] = useState(false);

    const loadLicenses = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getLicenses();
            setLicenses(data ?? []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading]);

    useEffect(() => {
        loadLicenses();
    }, [loadLicenses]);

    const activeCount = licences.filter((l) => l.is_active).length;
    const linkedCount = licences.filter((l) => l.store).length;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mes licences</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {licences.length} licence{licences.length !== 1 ? "s" : ""} enregistrée{licences.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button asChild className="bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white rounded-xl h-9 px-4 text-sm flex items-center gap-2">
                    <Link href="/admin/licenses/new" className="flex items-center gap-2">
                        <Plus size={15} /> Acheter une licence
                    </Link>
                </Button>
            </div>

            {licences.length > 0 && (
                <>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Total", value: licences.length, icon: CreditCard, color: "bg-gray-50 text-gray-500" },
                            { label: "Actives", value: activeCount, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
                            { label: "Associées", value: linkedCount, icon: Store, color: "bg-orange-50 text-orange-500" },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                                    <p className="text-xs text-gray-400">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {licences.map((licence, i) => {
                            const expired = isExpired(licence.expiration);
                            const status = !licence.is_active ? "inactive" : expired ? "expired" : "active";

                            return (
                                <motion.div
                                    key={licence.licence_id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                        status === "active" ? "bg-green-50" : "bg-gray-50"
                                    }`}>
                                        <CreditCard size={18} className={status === "active" ? "text-green-600" : "text-gray-400"} />
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-gray-900 text-sm font-mono">
                                                {licence.licence_id.slice(0, 8).toUpperCase()}…
                                            </span>
                                            {status === "active" && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    <CheckCircle2 size={11} /> Active
                                                </span>
                                            )}
                                            {status === "expired" && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                                    <XCircle size={11} /> Expirée
                                                </span>
                                            )}
                                            {status === "inactive" && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                                    <XCircle size={11} /> Inactive
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 flex-wrap text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                Expire le {formatDate(licence.expiration)}
                                            </span>
                                            {licence.store ? (
                                                <span className="flex items-center gap-1 text-orange-500 font-medium">
                                                    <Store size={12} />
                                                    {licence.store.name}
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-gray-400">
                                                    <Store size={12} />
                                                    Aucune boutique associée
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {!licence.store && licence.is_active && (
                                            <Link
                                                href={`/admin/shop/new?licenceId=${licence.licence_id}`}
                                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                                            >
                                                <Plus size={13} />
                                                Créer ma boutique
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => setRefundTarget(licence.licence_id)}
                                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 text-xs font-semibold rounded-xl transition-colors"
                                        >
                                            Rembourser
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )}

            <div>
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-orange-400" />
                        <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
                            {licences.length === 0 ? "Choisir un plan" : "Ajouter une licence"}
                        </span>
                    </div>
                    {licences.length === 0 && (
                        <p className="text-gray-400 text-sm">Vous n'avez pas encore de licence. Choisissez un plan pour commencer.</p>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative flex flex-col rounded-2xl border p-6 ${
                                plan.popular
                                    ? "bg-[hsl(355,16%,20%)] border-[hsl(355,16%,28%)] text-white"
                                    : "bg-white border-gray-100 text-gray-900"
                            }`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold">
                                    {plan.badge}
                                </span>
                            )}
                            <h3 className={`font-bold text-lg mb-1 font-display ${plan.popular ? "text-white" : "text-gray-900"}`}>
                                {plan.name}
                            </h3>
                            <p className={`text-xs mb-5 ${plan.popular ? "text-white/50" : "text-gray-400"}`}>{plan.desc}</p>
                            <div className="mb-6">
                                <span className={`text-4xl font-bold font-display ${plan.popular ? "text-white" : "text-gray-900"}`}>
                                    {plan.price}€
                                </span>
                                <span className={`text-sm ml-1 ${plan.popular ? "text-white/50" : "text-gray-400"}`}>{plan.period}</span>
                            </div>
                            <ul className="space-y-2.5 mb-6 flex-1">
                                {plan.features.map((f) => (
                                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.popular ? "text-white/80" : "text-gray-500"}`}>
                                        <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                            plan.popular ? "bg-[hsl(27,97%,69%)]/20" : "bg-orange-50"
                                        }`}>
                                            <Check size={10} className={plan.popular ? "text-[hsl(27,97%,69%)]" : "text-orange-500"} />
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => (window.location.href = `/admin/licenses/new?plan=${plan.param}`)}
                                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    plan.popular
                                        ? "bg-[hsl(27,97%,69%)] hover:bg-[hsl(27,90%,62%)] text-[hsl(355,16%,20%)]"
                                        : "bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white"
                                }`}
                            >
                                Choisir {plan.name}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
            {refundTarget && (
                <Overlay onClose={() => setRefundTarget(null)}>
                    <ConfirmCard
                        title="Rembourser la licence"
                        description={<>Rembourser la licence <span className="font-semibold text-gray-900 font-mono">{refundTarget.slice(0, 8).toUpperCase()}…</span> ?</>}
                        warning="Cette action est irréversible. La licence sera désactivée et le paiement remboursé."
                        onClose={() => setRefundTarget(null)}
                        onConfirm={async () => {
                            setRefunding(true);
                            try {
                                await handleRefundLicense(refundTarget);
                                setRefundTarget(null);
                                await loadLicenses();
                            } catch (error) {
                                console.error("Erreur lors du remboursement:", error);
                            } finally {
                                setRefunding(false);
                            }
                        }}
                        loading={refunding}
                        confirmLabel="Rembourser"
                        confirmCls="bg-red-600 hover:bg-red-700"
                    />
                </Overlay>
            )}
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
                <button onClick={onConfirm} disabled={loading} className={`px-4 py-2 text-sm rounded-xl text-white transition-colors disabled:opacity-50 ${confirmCls}`}>{loading ? "Remboursement…" : confirmLabel}</button>
            </div>
        </div>
    );
}
