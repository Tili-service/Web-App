'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function SuccessPage() {
    const params = useSearchParams();
    const [shopDetails, setShopDetails] = useState<{customerEmail : string, shopName: string} | null>(null)

    useEffect(() => {
        const sessionId = params.get("session_id");

        if (!sessionId) {
            return;
        }

        fetch(`/api/infoCustomer?session_id=${encodeURIComponent(sessionId)}`)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erreur lors de la recuperation client');
                }

                setShopDetails(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [params]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Paiement réussi !</h1>
                <p className="text-muted-foreground">Votre commande a été traitée avec succès.</p>
                <form method="POST" action="/api/completeLicense">
                    <input type="hidden" name="session_id" value={params.get("session_id") || ""} />
                    <input type="text" name="email" placeholder="Entrez votre email" className="mt-4 px-4 py-2 border rounded w-full" required disabled value={shopDetails?.customerEmail || ''} />
                    <input type="text" name="shopName" placeholder="Entrez le nom de votre boutique" className="mt-4 px-4 py-2 border rounded w-full" disabled required value={shopDetails?.shopName || ''} />
                    <input type="password" name="password" placeholder="Entrez votre mot de passe" className="mt-4 px-4 py-2 border rounded w-full" required />
                    <input type="password" name="confirmPassword" placeholder="Confirmez votre mot de passe" className="mt-4 px-4 py-2 border rounded w-full" required />
                    <input type="submit" value="Completer ma commande" className="mt-4 px-4 py-2 bg-primary text-white rounded" />
                </form>
            </div>
        </div>
    );
}