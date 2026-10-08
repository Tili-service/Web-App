"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Building2, CalendarDays, Hash, Loader2, Receipt, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateShop } from "@/services/store.service";
import type { Shop } from "@/lib/types";
import { shopSchema, type ShopFormInput, type ShopFormOutput } from "@/lib/validation";

export default function ShopSettingsClient({ shop }: { shop: Shop }) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<ShopFormInput, unknown, ShopFormOutput>({
        resolver: zodResolver(shopSchema),
        defaultValues: {
            name: shop.name,
            siret: shop.siret ?? "",
            numero_tva: shop.numero_tva ?? "",
        },
    });

    const onSubmit = async (data: ShopFormOutput) => {
        try {
            const updated = await updateShop(shop.store_id, data);
            reset({
                name: updated.name,
                siret: updated.siret ?? "",
                numero_tva: updated.numero_tva ?? "",
            });
            window.dispatchEvent(new CustomEvent("shop-updated", { detail: { shopId: shop.store_id } }));
            router.refresh();
            toast.success("Boutique mise à jour.");
        } catch (error) {
            if (error instanceof Error && error.message.includes("Session expirée")) {
                window.location.assign("/login");
                return;
            }
            toast.error(error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour.");
        }
    };

    const createdAt = new Date(shop.date_creation).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres de la boutique</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Informations légales et générales de votre commerce.
                </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Store size={18} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Informations</h2>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                            <CalendarDays size={12} />
                            Créée le {createdAt}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <FormField label="Nom de la boutique" icon={Building2} error={errors.name?.message}>
                        <Input {...register("name")} placeholder="Ma boutique" className="pl-9" />
                    </FormField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField label="SIRET" icon={Hash} error={errors.siret?.message} hint="14 chiffres">
                            <Input
                                {...register("siret")}
                                placeholder="123 456 789 00012"
                                inputMode="numeric"
                                className="pl-9"
                            />
                        </FormField>

                        <FormField
                            label="Numéro de TVA intracommunautaire"
                            icon={Receipt}
                            error={errors.numero_tva?.message}
                            hint="ex : FR12345678901"
                        >
                            <Input {...register("numero_tva")} placeholder="FR12345678901" className="pl-9" />
                        </FormField>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={!isDirty || isSubmitting}
                            onClick={() => reset()}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={!isDirty || isSubmitting}>
                            {isSubmitting && <Loader2 className="animate-spin" />}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FormField({
    label,
    icon: Icon,
    error,
    hint,
    children,
}: {
    label: string;
    icon: React.ElementType;
    error?: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                {children}
            </div>
            {error ? (
                <p className="text-xs text-red-600">{error}</p>
            ) : hint ? (
                <p className="text-xs text-gray-400">{hint}</p>
            ) : null}
        </div>
    );
}
