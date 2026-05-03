"use client";

import Image from 'next/image';
import { User, Mail, Lock, EyeOff, Eye, ArrowRight, ArrowLeft, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import createAccount from '@/lib/createAccount';
import loginAccount from '@/lib/loginAccount';
import { useAuth } from '@/context/auth-context';
import { hashPassword } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [hidePassword, setHidePassword] = useState(true);
    const [hideConfirm, setHideConfirm] = useState(true);
    const [showCGU, setShowCGU] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const submitForm = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            const data = Object.fromEntries(formData.entries());
            if (data.password !== data.confirmPassword) {
                throw new Error("Les mots de passe ne correspondent pas");
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
            toast.success("Inscription réussie", { description: "Votre compte a été créé avec succès." });
            router.push("/admin");
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Une erreur inconnue s'est produite";
            toast.error("Erreur lors de l'inscription", { description: message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {/* ── Left brand panel ── */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-[hsl(355,16%,20%)] flex-col justify-between p-12 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-white/5" />
                <div className="absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-white/5" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Image src="/tiliLogo.png" alt="Tili" width={28} height={28} className="w-7 h-7 object-contain" />
                    </div>
                    <span className="text-white font-bold text-xl font-display">Tili</span>
                </div>

                {/* Main content */}
                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles size={14} className="text-orange-300" />
                        <span className="text-orange-300 text-xs font-semibold uppercase tracking-widest">Logiciel de caisse</span>
                    </div>
                    <h1 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-5">
                        Démarrez<br />en quelques<br />minutes.
                    </h1>
                    <p className="text-white/50 text-base max-w-sm leading-relaxed">
                        Créez votre compte Tili et accédez à tous les outils pour gérer vos points de vente efficacement.
                    </p>

                </motion.div>

                {/* Bottom tagline */}
                <p className="relative z-10 text-white/30 text-xs">
                    © 2026 Tili — Logiciel de caisse
                </p>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
                {/* Mobile header */}
                <div className="lg:hidden relative bg-[hsl(355,16%,20%)] px-5 pt-2.5 pb-4 overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-orange-500/15" />
                    <div className="absolute top-1/2 right-8 w-16 h-16 rounded-full bg-white/5" />
                    {/* Back arrow */}
                    <Link href="/" className="relative z-10 inline-flex text-white/50 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    {/* Logo centered */}
                    <div className="relative z-10 flex justify-center mt-2">
                        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                            <Image src="/tiliLogo.png" alt="Tili" width={28} height={28} className="w-7 h-7 object-contain" />
                        </div>
                    </div>
                </div>

                {/* Desktop back arrow */}
                <div className="hidden lg:block px-6 sm:px-12 lg:px-14 xl:px-20 pt-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
                        <ArrowLeft size={15} /> Retour
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-14 xl:px-20">
                <motion.div
                    className="w-full max-w-md mx-auto"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold font-display text-gray-900">Inscription</h2>
                        <p className="text-gray-500 mt-2 text-sm">Créez votre compte pour accéder à votre espace Tili.</p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); submitForm(new FormData(e.currentTarget)); }}>
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Nom complet</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Jean Dupont"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="vous@exemple.com"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Mot de passe</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type={hidePassword ? "password" : "text"}
                                    name="password"
                                    placeholder="Minimum 8 caractères"
                                    required
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                                />
                                <button type="button" onClick={() => setHidePassword(!hidePassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    {hidePassword ? <Eye size={15} /> : <EyeOff size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Confirmer le mot de passe</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <input
                                    type={hideConfirm ? "password" : "text"}
                                    name="confirmPassword"
                                    placeholder="Répétez le mot de passe"
                                    required
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                                />
                                <button type="button" onClick={() => setHideConfirm(!hideConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    {hideConfirm ? <Eye size={15} /> : <EyeOff size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* CGU */}
                        <div className="flex items-center gap-2.5 pt-1">
                            <input type="checkbox" id="terms" required className="w-4 h-4 rounded accent-orange-500 flex-shrink-0 cursor-pointer" />
                            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                                J'accepte les{" "}
                                <button type="button" onClick={() => setShowCGU(true)} className="text-[hsl(355,16%,20%)] font-medium hover:underline">
                                    conditions d'utilisation
                                </button>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-2 bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {isSubmitting ? "Création du compte…" : (
                                <> Créer mon compte <ArrowRight size={16} /> </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Vous avez déjà un compte ?{" "}
                        <Link href="/login" className="text-[hsl(355,16%,20%)] font-semibold hover:underline">Se connecter</Link>
                    </p>
                </motion.div>
                </div>
            </div>

            {/* ── CGU modal ── */}
            {showCGU && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCGU(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-base font-bold text-gray-900">Conditions Générales d'Utilisation</h2>
                            <button type="button" onClick={() => setShowCGU(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="overflow-y-auto px-6 py-5 text-sm text-gray-700 space-y-4 flex-1">
                            <p>Conditions d'utilisation de Tili — à compléter.</p>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100">
                            <button type="button" onClick={() => setShowCGU(false)} className="w-full bg-[hsl(355,16%,20%)] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[hsl(355,16%,16%)] transition-colors">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
