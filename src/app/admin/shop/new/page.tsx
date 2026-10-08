"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Suspense, useEffect } from "react";
import { Store, Building2, Hash, ShieldCheck, Loader2 } from "lucide-react";
import { createShop } from "@/services/store.service";
import { createShopSchema, type CreateShopInput, type CreateShopOutput } from "@/lib/validation";

const inputClass =
    "w-full h-12 px-4 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all placeholder:text-gray-400";
const inputState = (hasError: boolean) =>
    hasError
        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
        : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500";

function NewShopContent() {
    const params = useSearchParams();
    const router = useRouter();
    const licenseID = params.get("licenceId");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateShopInput, unknown, CreateShopOutput>({
        resolver: zodResolver(createShopSchema),
        defaultValues: { name: "", siret: "", numero_tva: "", licence_id: licenseID ?? "" },
    });

    const onSubmit = async (data: CreateShopOutput) => {
        try {
            await createShop(data);
            window.dispatchEvent(new CustomEvent("shop-updated"));
            router.push("/admin/licenses?shop_created=true");
        } catch (error) {
            if (error instanceof Error && error.message.includes("Session expirée")) {
                window.location.assign("/login");
                return;
            }
            toast.error(error instanceof Error ? error.message : "Impossible de créer la boutique.");
        }
    };

    useEffect(() => {
        if (!licenseID) {
            router.push("/admin/licenses");
        }
    }, [licenseID, router]);

    if (!licenseID) {
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

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="shopName" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Store size={16} className="text-orange-500" />
                            Nom de la boutique
                        </label>
                        <input
                            type="text"
                            id="shopName"
                            {...register("name")}
                            placeholder="Ex: Tili Shop Paris"
                            className={`${inputClass} ${inputState(!!errors.name)}`}
                        />
                        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="vatNumber" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Building2 size={16} className="text-orange-500" />
                                Numéro de TVA
                                <span className="font-normal text-gray-400">(facultatif)</span>
                            </label>
                            <input
                                type="text"
                                id="vatNumber"
                                {...register("numero_tva")}
                                placeholder="FR 12 345678901"
                                className={`${inputClass} ${inputState(!!errors.numero_tva)}`}
                            />
                            {errors.numero_tva ? (
                                <p className="text-xs text-red-600">{errors.numero_tva.message}</p>
                            ) : (
                                <p className="text-xs text-gray-400">Laissez vide si vous êtes en franchise de TVA</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="siret" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Hash size={16} className="text-orange-500" />
                                SIRET
                            </label>
                            <input
                                type="text"
                                id="siret"
                                {...register("siret")}
                                inputMode="numeric"
                                placeholder="123 456 789 00012"
                                className={`${inputClass} ${inputState(!!errors.siret)}`}
                            />
                            {errors.siret ? (
                                <p className="text-xs text-red-600">{errors.siret.message}</p>
                            ) : (
                                <p className="text-xs text-gray-400">14 chiffres</p>
                            )}
                        </div>
                    </div>

                    {errors.licence_id && <p className="text-sm text-red-600">{errors.licence_id.message}</p>}

                    <div className="pt-6 space-y-4 border-t border-gray-100">
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-bold shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.98]" 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="animate-spin" />}
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
        <Suspense fallback={
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
        }>
            <NewShopContent />
        </Suspense>
    );
}