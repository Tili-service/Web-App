"use client";

import Image from 'next/image';
import { Mail, ArrowLeft, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    const submitForm = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            const data = Object.fromEntries(formData.entries());
            setEmail(data.email as string);
            // TODO: call backend reset-password endpoint when available
            setSubmitted(true);
        } catch {
            toast.error("Une erreur s'est produite", {
                description: "Impossible d'envoyer le lien de réinitialisation. Réessayez plus tard.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden">
            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-[hsl(355,16%,20%)] flex-col justify-between p-12 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-white/5" />
                <div className="absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-white/5" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Image src="/tiliLogo.png" alt="Tili" width={28} height={28} className="w-7 h-7 object-contain" />
                    </div>
                    <span className="text-white font-bold text-xl font-display">Tili</span>
                </div>

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
                        Pas de<br />panique,<br />on vous aide.
                    </h1>
                    <p className="text-white/50 text-base max-w-sm leading-relaxed">
                        Renseignez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>
                </motion.div>

                <p className="relative z-10 text-white/30 text-xs">
                    © 2026 Tili — Logiciel de caisse
                </p>
            </div>

            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
                <div className="lg:hidden relative bg-[hsl(355,16%,20%)] px-5 pt-2.5 pb-4 overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-orange-500/15" />
                    <div className="absolute top-1/2 right-8 w-16 h-16 rounded-full bg-white/5" />
                    <Link href="/login" className="relative z-10 inline-flex text-white/50 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="relative z-10 flex justify-center mt-2">
                        <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                            <Image src="/tiliLogo.png" alt="Tili" width={28} height={28} className="w-7 h-7 object-contain" />
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block px-6 sm:px-12 lg:px-14 xl:px-20 pt-6">
                    <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
                        <ArrowLeft size={15} /> Retour à la connexion
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-14 xl:px-20">
                    <motion.div
                        className="w-full max-w-md mx-auto"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <AnimatePresence mode="wait">
                            {!submitted ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold font-display text-gray-900">Mot de passe oublié</h2>
                                        <p className="text-gray-500 mt-2 text-sm">
                                            Entrez votre adresse email pour recevoir un lien de réinitialisation.
                                        </p>
                                    </div>

                                    <form
                                        className="space-y-5"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            submitForm(new FormData(e.currentTarget));
                                        }}
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                                    <Mail size={16} />
                                                </div>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="vous@exemple.com"
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm text-gray-800"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] disabled:opacity-60 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Envoyer le lien
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    <p className="mt-6 text-center text-sm text-gray-500">
                                        Vous vous souvenez de votre mot de passe ?{' '}
                                        <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                                            Se connecter
                                        </Link>
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="text-center"
                                >
                                    <div className="flex justify-center mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
                                            <CheckCircle2 size={32} className="text-green-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold font-display text-gray-900 mb-3">Email envoyé !</h2>
                                    <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
                                        Si un compte est associé à{' '}
                                        <span className="font-medium text-gray-700">{email}</span>,
                                        vous recevrez un lien de réinitialisation dans quelques instants.
                                    </p>
                                    <p className="text-gray-400 text-xs mt-4">
                                        Pensez à vérifier vos spams si vous ne le voyez pas.
                                    </p>

                                    <div className="mt-8 space-y-3">
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-sm cursor-pointer"
                                        >
                                            Renvoyer un lien
                                        </button>
                                        <Link
                                            href="/login"
                                            className="w-full bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                                        >
                                            Retour à la connexion
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
