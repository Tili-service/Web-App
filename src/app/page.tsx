"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { plans } from "@/data/plans";
import {
    ArrowRight, CheckCircle2, Puzzle, Clock3, MonitorSmartphone, FileCheck,
    Zap, ShieldCheck, BarChart3, Users, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

function Hero() {
    const { isLoggedIn } = useAuth();
    return (
        <section className="relative overflow-hidden bg-white pt-24 pb-0">
            <div className="pointer-events-none absolute -top-40 right-0 w-[600px] h-[600px] rounded-full bg-orange-50 opacity-70 blur-3xl" />

            <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center pb-0">
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-7">
                        <Zap size={13} className="text-orange-500" />
                        <span className="text-orange-600 text-xs font-semibold uppercase tracking-widest">Logiciel de caisse nouvelle génération</span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6 text-[hsl(355,16%,20%)]">
                        Gérez vos commerces{" "}
                        <span className="text-orange-500">simplement.</span>
                    </h1>

                    <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
                        Tili est la solution tout-en-un pour vos points de vente. Inventaire, caisse, profils — tout en un seul endroit, accessible en quelques minutes.
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={isLoggedIn ? "/admin" : "/register"}
                            className="inline-flex items-center gap-2 bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
                        >
                            {isLoggedIn ? "Accéder à mon espace" : "Essayer"}<ArrowRight size={16} />
                        </Link>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
                        >
                            En savoir plus
                        </a>
                    </div>

                    <div className="flex items-center gap-5 mt-8 pt-6 border-t border-gray-100">
                        {[
                            { value: "500+", label: "commerces actifs" },
                            { value: "99.9%", label: "disponibilité" },
                            { value: "NF525", label: "certifié" },
                        ].map((s) => (
                            <div key={s.label}>
                                <p className="text-xl font-bold font-display text-[hsl(355,16%,20%)]">{s.value}</p>
                                <p className="text-xs text-gray-400">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="relative hidden lg:block"
                >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/8">
                        <Image
                            src="/tili-mockup.png"
                            alt="Tili — Interface"
                            width={680}
                            height={440}
                            priority
                            className="w-full object-cover"
                        />
                    </div>

                </motion.div>
                <br></br>
            </div>
        </section>

    );
}

const FEATURES = [
    { Icon: Puzzle,           title: "Solution adaptable",     desc: "Pensée pour tous les commerces, de la petite boutique aux points de vente multi-caisses." },
    { Icon: Clock3,           title: "Déploiement rapide",     desc: "Installation en quelques minutes avec prise en main immédiate pour toute votre équipe." },
    { Icon: MonitorSmartphone,title: "Multi-devices",          desc: "Fonctionne sur tablette, smartphone et terminal pour encaisser partout, tout le temps." },
    { Icon: FileCheck,        title: "Compatibilité TPE",      desc: "Connexion simple avec vos terminaux de paiement existants (SumUp, myPOS, Ingenico)." },
    { Icon: ShieldCheck,      title: "Certifié NF525",         desc: "Conforme à la réglementation fiscale française. Vos transactions sont sécurisées et auditables." },
    { Icon: BarChart3,        title: "Rapports & analytics",   desc: "Suivez vos ventes, vos meilleures ventes et vos horaires de pointe en temps réel." },
    { Icon: Users,            title: "Gestion des profils",    desc: "Créez des profils employé avec PIN individuels et gérez les accès par rôle." },
    { Icon: Zap,              title: "Caisse ultra-rapide",    desc: "Interface tactile fluide, conçue pour encaisser vite — même en heure de pointe." },
];

function Features() {
    return (
        <section id="features" className="bg-[hsl(355,16%,20%)] py-24">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/20 mb-5">
                        <Zap size={13} className="text-orange-400" />
                        <span className="text-orange-300 text-xs font-semibold uppercase tracking-widest">Fonctionnalités</span>
                    </div>
                    <h2 className="text-4xl font-display font-bold text-white mb-4">
                        Des outils concrets pour votre commerce
                    </h2>
                    <p className="text-white/50 max-w-xl mx-auto text-base">
                        Tout ce dont vous avez besoin pour encaisser, gérer et piloter votre activité.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {FEATURES.map(({ Icon, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                            className="bg-white/6 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
                        >
                            <div className="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center mb-4">
                                <Icon size={20} className="text-orange-400" />
                            </div>
                            <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                            <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    const { isLoggedIn } = useAuth();
    return (
        <section id="pricing" className="bg-gray-50 py-24">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[hsl(355,16%,20%)]/8 border border-[hsl(355,16%,20%)]/10 mb-5">
                        <span className="text-[hsl(355,16%,20%)] text-xs font-semibold uppercase tracking-widest">Tarifs</span>
                    </div>
                    <h2 className="text-4xl font-display font-bold text-[hsl(355,16%,20%)] mb-4">
                        Simples et transparents
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-base">
                        Choisissez la formule qui correspond à votre activité. Sans frais cachés.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 }}
                            className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                                plan.popular
                                    ? "bg-[hsl(355,16%,20%)] text-white shadow-2xl scale-[1.03]"
                                    : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
                            }`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                                    {plan.badge}
                                </span>
                            )}

                            <div className="mb-6">
                                <h3 className={`font-display text-xl font-bold mb-1.5 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm ${plan.popular ? "text-white/60" : "text-gray-400"}`}>{plan.desc}</p>
                            </div>

                            <div className="mb-8">
                                <span className={`text-5xl font-display font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                                    {plan.price}€
                                </span>
                                <span className={`text-sm ml-1 ${plan.popular ? "text-white/60" : "text-gray-400"}`}>{plan.period}</span>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2.5 text-sm">
                                        <CheckCircle2 size={15} className={plan.popular ? "text-orange-300 flex-shrink-0" : "text-emerald-500 flex-shrink-0"} />
                                        <span className={plan.popular ? "text-white/80" : "text-gray-600"}>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={isLoggedIn ? `/admin/licenses/new?plan=${plan.param}` : "/register"}
                                className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                                    plan.popular
                                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                                        : "bg-[hsl(355,16%,20%)] hover:bg-[hsl(355,16%,16%)] text-white"
                                }`}
                            >
                                {isLoggedIn ? "Acheter" : `Choisir ${plan.name}`} <ChevronRight size={15} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTA() {
    const { isLoggedIn } = useAuth();
    return (
        <section className="bg-white py-20">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[hsl(355,16%,20%)] rounded-3xl px-8 py-16 text-center relative overflow-hidden"
                >
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />
                    <div className="relative z-10">
                        <h2 className="text-4xl font-display font-bold text-white mb-4">
                            Prêt à moderniser votre caisse ?
                        </h2>
                        <p className="text-white/60 max-w-lg mx-auto mb-8 text-base">
                            Rejoignez les centaines de commerçants qui font confiance à Tili pour gérer leur activité au quotidien.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link
                                href={isLoggedIn ? "/admin" : "/register"}
                                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
                            >
                                {isLoggedIn ? "Accéder à mon espace" : "Essayer"} <ArrowRight size={16} />
                            </Link>
                            {!isLoggedIn && (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 border border-white/20 text-white/80 hover:bg-white/10 font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
                                >
                                    Se connecter
                                </Link>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bg-[hsl(355,16%,20%)] py-10">
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                    <Image src="/tiliLogo.png" alt="Tili" width={32} height={32} className="h-8 w-auto brightness-0 invert opacity-80" />
                    <span className="text-white font-bold font-display">Tili</span>
                </div>
                <p className="text-white/40 text-sm">© 2026 Tili. Le logiciel de caisse pour les petits commerces.</p>
                <div className="flex items-center gap-5 text-sm text-white/40">
                    <a href="#features" className="hover:text-white/70 transition-colors">Fonctionnalités</a>
                    <a href="#pricing" className="hover:text-white/70 transition-colors">Tarifs</a>
                    <Link href="/login" className="hover:text-white/70 transition-colors">Connexion</Link>
                </div>
            </div>
        </footer>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen">
            <Hero />
            <Features />
            <Pricing />
            <CTA />
            <Footer />
        </div>
    );
}
