
"use client";
import { useLoading } from "../layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { plans } from "@/data/plans";
import getLicenses, { License } from "@/lib/getLicenses";
import Link from "next/link";

export default function LicensesPage() {
    const { setIsLoading } = useLoading();
    const [licences, setLicenses] = useState<License[]>([]);

    useEffect(() => {
        setIsLoading(true);
        const fetchLicenses = async () => {
            try {
                const data = await getLicenses();
                console.log("Licenses fetched:", data);
                setLicenses(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLicenses();

    }, [setLicenses]);

    return (
        <>
            {licences.length === 0 ? (
                <>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    Vous n'avez pas de licences pour le moment.
                    </div>
                    <section id="pricing" className="py-24">
                        <div className="container">
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {plans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className={`relative p-8 rounded-2xl transition-shadow duration-300 ${
                                plan.popular
                                    ? "bg-foreground text-background shadow-warm scale-105"
                                    : "bg-card shadow-card hover:shadow-warm"
                                }`}
                            >
                                {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-warm text-primary-foreground text-xs font-display font-semibold">
                                    {plan.badge}
                                </span>
                                )}
                                <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
                                <p className={`text-sm mb-6 ${plan.popular ? "text-background/70" : "text-muted-foreground"}`}>
                                {plan.desc}
                                </p>
                                <div className="mb-6">
                                <span className="text-5xl font-display font-bold">{plan.price}€</span>
                                <span className={`text-sm ${plan.popular ? "text-background/70" : "text-muted-foreground"}`}>
                                    {plan.period}
                                </span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                {plan.features.map((f) => (
                                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.popular ? "text-background/90" : "text-muted-foreground"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${plan.popular ? "bg-accent" : "bg-secondary"}`} />
                                    {f}
                                    </li>
                                ))}
                                </ul>
                                <Button
                                    variant={plan.popular ? "accent" : "hero"}
                                    size="lg"
                                    className="w-full "
                                    onClick={() => (window.location.href = `/admin/licenses/new?plan=${plan.param}`)}
                                    >
                                    Choisir {plan.name}
                                </Button>
                            </motion.div>
                            ))}
                        </div>
                        </div>
                    </section>
                </>
            ) :
            (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    {/* En-tête avec le titre et le bouton */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Vos licences</h2>
                        <Button
                            asChild 
                            variant="default"
                            className="bg-[#548687] hover:bg-[#426a6b] text-white"
                        >
                            <Link href="/admin/licenses/new">
                                Acheter une licence
                            </Link>
                        </Button>
                    </div>

                    {/* Liste des licences */}
                    <ul className="space-y-4">
                        {licences.map((licence) => (
                            <li key={licence.licence_id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                                <p className="mb-1"><strong>Licence ID:</strong> <span className="text-gray-600">{licence.licence_id}</span></p>
                                <p className="mb-1"><strong>Expiration:</strong> <span className="text-gray-600">{new Date(licence.expiration).toLocaleDateString()}</span></p>
                                <p className="mb-1"><strong>Transaction:</strong> <span className="text-gray-600">{licence.transaction}</span></p>
                                <p>
                                    <strong>Status:</strong> 
                                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${licence.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {licence.is_active ? "Active" : "Inactive"}
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )
            }
        </>
    );
}