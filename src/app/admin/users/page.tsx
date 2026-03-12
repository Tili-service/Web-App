"use client";
import { useEffect } from "react";
import { useLoading } from "../layout";

export default function UsersPage() {
    const { setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000); // Simule un chargement de 5 secondes

        return () => clearTimeout(timer);
    }, []);
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Aperçu de mes utilisateurs</h2>
            <p className="text-gray-500">Ici tu pourras mettre tes graphiques, tes tables, tes formulaires...</p>
        </div>
    );
}