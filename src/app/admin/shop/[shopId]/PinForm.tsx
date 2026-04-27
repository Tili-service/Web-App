"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { loginWithPin } from "@/lib/profileAuth";
import { Lock, Loader2 } from "lucide-react";

export default function PinForm() {
    const params = useParams();
    const router = useRouter();
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await loginWithPin(parseInt(params.shopId as string, 10), pin);
            router.refresh(); 
        } catch (err: any) {
            setError(err.message);
            setPin("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center">
                <div className="mx-auto h-16 w-16 bg-slate-50 flex items-center justify-center rounded-full mb-6 relative overflow-hidden text-slate-400">
                    <Lock className="h-8 w-8 z-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Accès Sécurisé</h2>
                <p className="text-slate-500 mb-8">Veuillez entrer votre code PIN pour accéder à l&apos;administration de ce magasin.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full text-center text-3xl tracking-[0.5em] font-mono border-b-2 border-slate-200 focus:border-slate-800 focus:outline-none bg-transparent py-2 transition-colors"
                            autoFocus
                            placeholder="••••••"
                            maxLength={6}
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm font-medium bg-red-50 py-2 px-3 rounded-lg">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading || pin.length < 6}
                        className="w-full bg-slate-900 text-white rounded-xl py-3 font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Déverrouiller"}
                    </button>
                </form>
            </div>
        </div>
    );
}
