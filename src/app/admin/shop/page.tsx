"use client";
import { useLoading } from "../layout";
import { useEffect, useState } from "react";
import getShops, { Shop } from "@/lib/getShop";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

    return (
        <div className="space-y-4">
            {!shops || shops.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center py-12">
                    <p className="text-gray-500 mb-4">Vous n'avez pas de boutiques pour le moment.</p>
                    <Button asChild variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Link href="/admin/licenses">
                            Associer une boutique à une licence
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Vos boutiques</h2>
                        <Button
                            asChild
                            variant="default"
                            className="bg-[#548687] hover:bg-[#426a6b] text-white"
                        >
                            <Link href="/admin/licenses">
                                Gérer mes licences
                            </Link>
                        </Button>
                    </div>

                    <ul className="space-y-4">
                        {shops.map((shop, index) => (
                            <li
                                key={index}
                                className="p-5 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between bg-white gap-4"
                            >
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">{shop.name}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
                                        <p className="text-sm">
                                            <span className="font-semibold text-gray-700">SIRET :</span>
                                            <span className="text-gray-600 ml-2">{shop.siret}</span>
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-semibold text-gray-700">N° TVA :</span>
                                            <span className="text-gray-600 ml-2">{shop.numero_tva}</span>
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Créée le {new Date(shop.date_creation).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <Button variant="outline" size="sm" className="w-full md:w-auto text-gray-600 hover:text-white hover:border-orange-200">
                                        Voir les détails
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}