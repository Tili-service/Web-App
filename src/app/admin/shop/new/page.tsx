"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import { Store, Building2, Hash, ShieldCheck, Loader2 } from "lucide-react";

function NewShopContent() {
    const params = useSearchParams();
    const router = useRouter();
    const licenseID = params.get("licenceId");
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!licenseID) {
            router.push("/admin/licenses");
        } else {
            setIsChecking(false);
        }
    }, [licenseID, router]);

    if (isChecking) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10 opacity-50" />

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">Créer votre boutique</h2>
                    <p className="text-gray-500 text-sm">
                        Configurez les informations de votre entreprise pour lier votre licence.
                    </p>
                </div>

                <form action="/api/createShop" method="POST" className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="shopName" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Store size={16} className="text-orange-500" />
                            Nom de la boutique
                        </label>
                        <input
                            type="text"
                            id="shopName"
                            name="shopName"
                            required
                            placeholder="Ex: Tili Shop Paris"
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="vatNumber" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Building2 size={16} className="text-orange-500" />
                                Numéro de TVA
                            </label>
                            <input
                                type="text"
                                id="vatNumber"
                                name="vatNumber"
                                required
                                placeholder="FR 12 345678901"
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="siret" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Hash size={16} className="text-orange-500" />
                                SIRET
                            </label>
                            <input
                                type="text"
                                id="siret"
                                name="siret"
                                required
                                placeholder="123 456 789 00012"
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <input type="hidden" name="licenseID" value={licenseID as string} />

                    <div className="pt-6 space-y-4 border-t border-gray-100">
                        <Button 
                            variant="default" 
                            size="lg" 
                            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-bold shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.98]" 
                            type="submit"
                        >
                            Finaliser ma boutique
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-gray-400">
                            <ShieldCheck size={16} />
                            <p className="text-xs">
                                Informations sécurisées et modifiables ultérieurement
                            </p>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function NewShopPage() {
    return (
        //TODO(Marin): Check Suspence modification
        <Suspense fallback={<div className="max-w-2xl mx-auto py-8">Chargement...</div>}>
            <NewShopContent />
        </Suspense>
    );
}