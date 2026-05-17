"use client";
import { useLoading } from "../layout";
import { useEffect, useState } from "react";
import getShops, { Shop } from "@/lib/getShop";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Store, Calendar, Hash, Receipt, ArrowRight, Plus, CreditCard } from "lucide-react";

export default function ShopPage() {
    const { setIsLoading } = useLoading();
    const [shops, setShops] = useState<Shop[]>([]);

    useEffect(() => {
        setIsLoading(true);
        const fetchShops = async () => {
            try {
                const data = await getShops();
                setShops(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchShops();
    }, [setIsLoading]);

    if (!shops || shops.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-6">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-5">
                    <Store size={30} className="text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Aucun commerce</h2>
                <p className="text-gray-400 mb-8 text-center max-w-xs text-sm leading-relaxed">
                    Vous n'avez pas encore de boutiques associées à votre compte.
                </p>
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5 h-10 text-sm">
                    <Link href="/admin/licenses" className="flex items-center gap-2">
                        <Plus size={15} />
                        Associer une boutique à une licence
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Vos boutiques</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {shops.length} commerce{shops.length > 1 ? 's' : ''} enregistré{shops.length > 1 ? 's' : ''}
                    </p>
                </div>
                <Button
                    asChild
                    variant="outline"
                    className="text-sm border-gray-200 hover:bg-gray-50 rounded-xl h-9 px-4"
                >
                    <Link href="/admin/licenses" className="flex items-center gap-2">
                        <CreditCard size={15} />
                        Gérer les licences
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {shops.map((shop, index) => (
                    <motion.div
                        key={shop.store_id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.07 }}
                    >
                        <Link
                            href={`/admin/shop/${shop.store_id}/dashboard`}
                            className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-orange-100 transition-all duration-200 cursor-pointer h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-11 h-11 bg-gray-50 group-hover:bg-orange-50 rounded-xl flex items-center justify-center transition-colors">
                                    <Store size={20} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                                <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-orange-500 transition-colors font-medium pt-1">
                                    Accéder
                                    <ArrowRight size={12} />
                                </span>
                            </div>

                            <h3 className="text-base font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                                {shop.name}
                            </h3>

                            <div className="mt-auto pt-4 border-t border-gray-50 space-y-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <Hash size={12} className="text-gray-300 shrink-0" />
                                    <span className="text-gray-400">SIRET</span>
                                    <span className="text-gray-600 font-medium ml-auto truncate">{shop.siret || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Receipt size={12} className="text-gray-300 shrink-0" />
                                    <span className="text-gray-400">N° TVA</span>
                                    <span className="text-gray-600 font-medium ml-auto truncate">{shop.numero_tva || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <Calendar size={12} className="text-gray-300 shrink-0" />
                                    <span className="text-gray-400">Créée le</span>
                                    <span className="text-gray-600 font-medium ml-auto">
                                        {new Date(shop.date_creation).toLocaleDateString('fr-FR', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}