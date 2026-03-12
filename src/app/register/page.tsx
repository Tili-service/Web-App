"use client";

import Image from 'next/image';
import { User, Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner"
import Link from 'next/link';
import createAccount from '@/lib/createAccount';

export default function RegisterPage() {
    const [hidePassword, sethidePassword] = useState(true);
    const [hideConfirmPassword, sethideConfirmPassword] = useState(true);

    const submitForm = (formData: FormData) => {
        try {
            const data = Object.fromEntries(formData.entries());
            if (data.password !== data.confirmPassword) {
                throw Error("Les mots de passe ne correspondent pas");
            }
            createAccount({
                email: data.email as string,
                name: data.name as string,
                password: data.password as string,
            }).then(async () => {
                toast("Inscription réussie", {
                    description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
                });
                setTimeout(() => {window.location.href = "/login";}, 2000);
            });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Une erreur inconnue s'est produite";
            toast("Erreur lors de l'inscription", {
                description: message,
            });
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-gray-100">

            {/* 1. Image de fond floutée (scale-105 évite les bords blancs dus au flou) */}
            <Image
                src="/logPicture.png"
                alt="Arrière-plan Tili"
                fill
                className="object-cover blur-md scale-105"
                priority
            />

        {/* 2. Logo en haut à gauche (style étiquette) */}
            <Link
                href="/" 
                className="absolute top-0 left-8 bg-white p-5 rounded-b-[2rem] shadow-lg z-50 hover:bg-gray-50 hover:scale-[1.02] transition-all cursor-pointer"
            >
                <Image
                    src="/tiliLogo.png"
                    alt="Tili Logo"
                    width={100}
                    height={100}
                    priority
                    className="object-contain"
                />
            </Link>

        {/* 3. Conteneur central pour le formulaire */}
            <div className="absolute inset-0 flex items-center justify-center z-10 p-4">

            {/* Carte du formulaire */}
                <div className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl w-full max-w-[420px]">
                    {/* En-tête de la carte */}
                    <div className="text-center mb-8 flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Inscription</h1>
                    <p className="text-sm text-gray-500 leading-relaxed px-4">
                        Rejoignez Tili et révolutionnez votre gestion de caisse dès aujourd'hui !
                    </p>
                    </div>

                    {/* Formulaire */}
                    <form className="space-y-4" onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        submitForm(formData);
                    }}>
                        {/* Nom */}
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

                        {/* Email */}
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

                        {/* Mot de passe */}
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

                        {/* Confirmation mot de passe */}
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
                            J'accepte les <a href="#" className="text-[#1e1e24] hover:underline">conditions d'utilisation</a>
                        </label>

                        {/* Bouton S'inscrire */}
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