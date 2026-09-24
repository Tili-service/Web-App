import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CreditCard, ShieldCheck, ShieldX, Store } from "lucide-react";
import { getShops } from "@/services/store.service";
import { Button } from "@/components/ui/button";

export default async function ServicesExternesPage({
	params,
}: {
	params: { shopId: string } | Promise<{ shopId: string }>;
}) {
	const { shopId } = await Promise.resolve(params);
	const storeId = String(shopId);

	const shops = await getShops();
	const shop = shops.find((item) => item.store_id === storeId);

	if (!shop) {
		notFound();
	}

	const isConnected = shop.sumup_status === "connected";

	return (
		<div className="space-y-6 max-w-5xl">
			<div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-6 md:p-8 shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.15),_transparent_35%),linear-gradient(135deg,_rgba(255,247,237,0.95),_rgba(255,255,255,1))]" />
                
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-white/80 px-3 py-1.5 text-xs font-semibold text-orange-700 shadow-sm backdrop-blur-sm">
                            <CreditCard size={14} className="text-orange-500" />
                            Services externes
                        </div>
                        <div>
                            {/* H2 est plus sémantique qu'un H1 dans une carte */}
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Connexion SumUp</h2>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
                                Activez SumUp pour ce commerce afin de synchroniser automatiquement le terminal de paiement.
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-col sm:flex-row items-center gap-4">
                        <div className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                            isConnected 
                                ? "border-emerald-100 bg-emerald-50 text-emerald-700" 
                                : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}>
                            {isConnected ? <ShieldCheck size={18} className="text-emerald-500" /> : <ShieldX size={18} className="text-slate-400" />}
                            {isConnected ? "Connecté" : "Déconnecté"}
                        </div>
                        
                        <Button 
                            asChild 
                            className="h-11 w-full sm:w-auto rounded-2xl bg-orange-500 px-6 text-white shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
                        >
                            <Link href={`/api/protected/oauth/sumup/${shop.store_id}`} className="flex items-center justify-center gap-2">
                                <CreditCard size={16} />
                                {isConnected ? "Reconnecter" : "Connecter SumUp"}
                                <ArrowRight size={16} className="opacity-80" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
		</div>
	);
}
