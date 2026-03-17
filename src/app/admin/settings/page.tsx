"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAccount } from "@/lib/getAccount";
import { updateAccount } from "@/lib/updateAccount";
import { deleteAccount } from "@/lib/deleteAccount";
import { useLoading } from "../layout";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the shape of the form data
type AccountData = {
    name: string;
};

export default function SettingsPage() {
    const { setIsLoading } = useLoading();
    const router = useRouter();
    const { refreshUser, logout } = useAuth();
    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<AccountData>();

    // Initial loading state
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Charge les données du compte au montage
    useEffect(() => {
        setIsLoading(true);
        getAccount()
            .then((data) => {
                reset({
                    name: data.name,
                });
            })
            .catch(() => {
                toast.error("Impossible de charger les informations du compte.");
            })
            .finally(() => {
                setIsLoading(false);
                setIsInitialLoading(false);
            });
    }, [setIsLoading, reset]);

    const onSubmit = async (data: AccountData) => {
        try {
            await updateAccount(data);
            await refreshUser();
            toast.success("Compte mis à jour avec succès.");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Une erreur est survenue lors de la mise à jour.");
        }
    };

    const handleDelete = async () => {
        if (
            confirm(
                "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera toutes vos données (boutiques, licences, etc.)."
            )
        ) {
            try {
                await deleteAccount();
                logout(); // Déconnexion via le context pour mettre à jour l'UI immédiatement
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || "Impossible de supprimer le compte.");
            }
        }
    };

    if (isInitialLoading) {
        return null; // The global loader from layout takes over visually, or just empty
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
                        Paramètres de mon compte
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Gérez vos informations personnelles et vos préférences.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Nom complet
                        </label>
                        <Input
                            {...register("name", { required: "Le nom est requis" })}
                            placeholder="Votre nom"
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="pt-4">
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enregistrer les modifications
                        </Button>
                    </div>
                </form>
            </div>

            <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
                <h3 className="text-lg font-bold text-red-700 mb-2">Zone de danger</h3>
                <p className="text-sm text-red-600/80 mb-6">
                    Une fois votre compte supprimé, il n'y a pas de retour en arrière. S'il vous plaît, soyez certain.
                </p>
                <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                    Supprimer mon compte définitivement
                </Button>
            </div>
        </div>
    );
}