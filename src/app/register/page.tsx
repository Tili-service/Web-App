"use client";

import Image from 'next/image';
import { User, Mail, Lock, EyeOff, Eye, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import createAccount from '@/lib/createAccount';
import loginAccount from '@/lib/loginAccount';
import { useAuth } from '@/context/auth-context';
import { hashPassword } from '@/lib/utils';

export default function RegisterPage() {
    const [hidePassword, sethidePassword] = useState(true);
    const [hideConfirmPassword, sethideConfirmPassword] = useState(true);
    const [showCGU, setShowCGU] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const submitForm = async (formData: FormData) => {
        try {
            const data = Object.fromEntries(formData.entries());
            if (data.password !== data.confirmPassword) {
                throw Error("Les mots de passe ne correspondent pas");
            }
            const hashedPassword = await hashPassword(data.password as string);
            await createAccount({
                email: data.email as string,
                name: data.name as string,
                password: hashedPassword,
            });
            const res = await loginAccount({
                email: data.email as string,
                password: hashedPassword,
            });
            login(res);
            toast.success("Inscription réussie", {
                description: "Votre compte a été créé avec succès.",
            });
            router.push("/admin");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Une erreur inconnue s'est produite";
            toast("Erreur lors de l'inscription", {
                description: message,
            });
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gray-100">

            <Image
                src="/logPicture.png"
                alt="Arrière-plan Tili"
                fill
                className="object-cover blur-md scale-105"
                priority
            />



            <div className="absolute inset-0 flex items-center justify-center z-10 p-4">

                <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl w-full max-w-[420px]">
                    <div className="text-center mb-8 flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Inscription</h1>
                    <p className="text-sm text-gray-500 leading-relaxed px-4">
                        Rejoignez Tili et révolutionnez votre gestion de caisse dès aujourd'hui !
                    </p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        submitForm(formData);
                    }}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <User size={18} />
                            </div>
                            <input
                                type="text"
                                name='name'
                                placeholder="Nom complet"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-sm text-gray-800" 
                                required
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name='email'
                                placeholder="Email"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-sm text-gray-800" 
                                required
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Lock size={18} />
                            </div>
                            <input
                                type={hidePassword ? "password" : "text"}
                                name='password'
                                placeholder="Mot de passe"
                                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-sm text-gray-800" 
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors">
                            <button type="button" onClick={() => sethidePassword(!hidePassword)} className="">
                                {hidePassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <Lock size={18} />
                            </div>
                            <input
                                type={hideConfirmPassword ? "password" : "text"}
                                name='confirmPassword'
                                placeholder="Confirmer le mot de passe"
                                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-sm text-gray-800" 
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors">
                            <button type="button" onClick={() => sethideConfirmPassword(!hideConfirmPassword)} className="p-1">
                                {hideConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            </div>
                        </div>

                        <label htmlFor="terms" className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input type="checkbox" id="terms" className="w-4 h-4 text-[#1e1e24] border-gray-300 rounded focus:ring-[#1e1e24] focus:ring-2" required />
                            J'accepte les{" "}
                            <button type="button" onClick={() => setShowCGU(true)} className="text-[#1e1e24] hover:underline">
                                conditions d'utilisation
                            </button>
                        </label>

                        {showCGU && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCGU(false)}>
                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center justify-between px-6 py-4 border-b">
                                        <h2 className="text-lg font-bold text-gray-900">Conditions Générales d'Utilisation</h2>
                                        <button type="button" onClick={() => setShowCGU(false)} className="text-gray-400 hover:text-gray-600">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="overflow-y-auto px-6 py-4 text-sm text-gray-700 space-y-4">
                                        {/* tmp to change with real CGU, for now just to have something in place */}
                                        <p> Condition d'utilisation de Tili </p>
                                    </div>
                                    <div className="px-6 py-4 border-t">
                                        <button type="button" onClick={() => setShowCGU(false)} className="w-full bg-[#1e1e24] text-white py-2 rounded-xl text-sm font-medium hover:bg-black transition-colors">
                                            Fermer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#1e1e24] text-white py-3 px-4 rounded-xl hover:bg-black transition-colors font-medium text-sm mt-4 shadow-md"
                        >
                            S'inscrire
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Vous avez déjà un compte ? <Link href="/login" className="text-[#1e1e24] hover:underline">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}