"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense, useState } from "react";
import { CheckCircle2, CreditCard, Loader2, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { plans } from "@/data/plans";
import Link from "next/link";

function NewLicenseContent() {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan");
    const [selectedPlan, setSelectedPlan] = useState(plan || "mensuel");

    const selected = plans.find((p) => p.param === selectedPlan) ?? plans[0];
    const priceHT = parseFloat(selected.price);
    const priceTTC = priceHT * 1.2;

    return (
        <div className="space-y-6 pb-10">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/licenses"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={15} /> Retour
                </Link>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900">Nouvelle licence</h2>
                <p className="text-sm text-gray-400 mt-0.5">Choisissez votre formule et procédez au paiement.</p>
            </div>

            <form action="/api/protected/createPayment" method="POST">
                <input type="hidden" name="offer" value={selectedPlan} />

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left — plan selector */}
                    <div className="lg:col-span-2 space-y-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Formule</p>
                        <div className="grid sm:grid-cols-3 gap-3">
                            {plans.map((p, i) => {
                                const isSelected = selectedPlan === p.param;
                                return (
                                    <motion.button
                                        key={p.param}
                                        type="button"
                                        onClick={() => setSelectedPlan(p.param)}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        className={`relative flex flex-col text-left rounded-2xl border-2 p-5 transition-all duration-200 ${
                                            isSelected
                                                ? "border-[hsl(355,16%,20%)] bg-[hsl(355,16%,20%)]"
                                                : "border-gray-100 bg-white hover:border-gray-200"
                                        }`}
                                    >
                                        {p.badge && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
                                                {p.badge}
                                            </span>
                                        )}
                                        <div className="flex items-start justify-between mb-3">
                                            <span className={`font-bold text-sm ${isSelected ? "text-white" : "text-gray-900"}`}>
                                                {p.name}
                                            </span>
                                            {isSelected && <CheckCircle2 size={16} className="text-orange-300 shrink-0" />}
                                        </div>
                                        <div className="mb-2">
                                            <span className={`text-2xl font-bold font-display ${isSelected ? "text-white" : "text-gray-900"}`}>
                                                {p.price}€
                                            </span>
                                            <span className={`text-xs ml-1 ${isSelected ? "text-white/50" : "text-gray-400"}`}>
                                                {p.period}
                                            </span>
                                        </div>
                                        <p className={`text-xs leading-relaxed ${isSelected ? "text-white/60" : "text-gray-400"}`}>
                                            {p.desc}
                                        </p>
                                    </motion.button>
                                );
                            })}
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Inclus dans la formule {selected.name}</p>
                            <div className="grid sm:grid-cols-2 gap-2.5">
                                {selected.features.map((f) => (
                                    <div key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                                        <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={11} className="text-orange-500" />
                                        </div>
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Récapitulatif</p>
                        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                    <CreditCard size={18} className="text-orange-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">Licence {selected.name}</p>
                                    <p className="text-xs text-gray-400">{selected.desc}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Prix HT</span>
                                    <span>{priceHT.toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>TVA (20%)</span>
                                    <span>{(priceTTC - priceHT).toFixed(2)} €</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                                    <span>Total TTC</span>
                                    <span>{priceTTC.toFixed(2)} €</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <Zap size={15} /> Passer au paiement
                            </button>

                            <div className="flex items-center justify-center gap-1.5 text-gray-400">
                                <ShieldCheck size={13} />
                                <p className="text-xs">Paiement 100% sécurisé via Stripe</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default function NewLicensePage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
        }>
            <NewLicenseContent />
        </Suspense>
    );
}
