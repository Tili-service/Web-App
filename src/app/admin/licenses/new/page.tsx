"use client";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NewLicensePage() {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan");
    const [selectedPlan, setSelectedPlan] = useState(plan || "mensuel");

    return (
        <>
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-background rounded-2xl p-8 shadow-card space-y-6"
                method="POST"
                action={"/api/createPayment"}>
                    <div>
                        <label className="block font-display text-sm font-medium mb-2">Nom de la boutique</label>
                        <input
                        type="text"
                        name="shopName"
                        required
                        className="w-full h-11 px-4 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none transition-shadow"
                        placeholder="Ma Boutique"
                        />
                    </div>
                    <div>
                        <label className="block font-display text-sm font-medium mb-3">Formule</label>
                        <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: "mensuel", label: "Mensuel", price: "15€/mois" },
                            { id: "semestriel", label: "Semestriel", price: "85€/sem" },
                            { id: "annuel", label: "Annuel", price: "160€/an" },
                        ].map((p) => (
                            <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedPlan(p.id)}
                            className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                                selectedPlan === p.id
                                ? "border-primary bg-primary/5 shadow-warm"
                                : "border-border hover:border-accent"
                            }`}
                            >
                            <span className="block font-display font-semibold text-sm">{p.label}</span>
                            <span className="block text-xs text-muted-foreground mt-1">{p.price}</span>
                            </button>
                        ))}
                        </div>
                    </div>
                <input type="hidden" name="offer" value={selectedPlan} />
                <Button variant="hero" size="xl" className="w-full" type="submit">
                    Valider ma commande
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                En validant, vous acceptez nos conditions générales de vente.
                </p>
            </motion.form>
        </>
    );
}