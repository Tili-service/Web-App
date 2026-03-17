"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Features from "@/components/Features";
import { plans } from "@/data/plans";

const tiliMockup = "tili-mockup.png";
const tiliLogo = "tiliLogo.png";



const Hero = () => (
  <section className="pt-32 pb-20 gradient-hero overflow-hidden">
    <div className="container grid lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground font-display text-sm font-semibold mb-6">
          🛒 Logiciel de caisse nouvelle génération
        </span>
        <h1 className="text-5xl lg:text-6xl font-bold font-display leading-tight mb-6">
          Gérez votre boutique avec{" "}
          <span className="text-primary">simplicité</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-lg">
          Tili est le logiciel de caisse pensé pour les petits commerces. 
          Simple, rapide et fiable. Encaissez, gérez vos stocks et suivez vos ventes en un clin d'œil.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Button variant="hero" size="xl" onClick={() => (window.location.href = "/register")}>
            <ShoppingCart className="w-5 h-5" />
            Commander maintenant
          </Button>
          <Button variant="outline" size="xl" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            En savoir plus
          </Button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="animate-float">
          <img
            src={tiliMockup}
            alt="Tili - Interface"
            className="w-full rounded-2xl shadow-warm"
          />
        </div>
      </motion.div>
    </div>
  </section>
);

const Pricing = () => (
  <section id="pricing" className="py-24">
    {/* ... Le contenu de votre fonction Pricing reste inchangé ... */}
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold font-display mb-4">
          Tarifs simples et transparents
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Choisissez la formule qui correspond à votre activité.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`relative p-8 rounded-2xl transition-shadow duration-300 ${
              plan.popular
                ? "bg-foreground text-background shadow-warm scale-105"
                : "bg-card shadow-card hover:shadow-warm"
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-warm text-primary-foreground text-xs font-display font-semibold">
                {plan.badge}
              </span>
            )}
            <h3 className="font-display text-xl font-bold mb-2">{plan.name}</h3>
            <p className={`text-sm mb-6 ${plan.popular ? "text-background/70" : "text-muted-foreground"}`}>
              {plan.desc}
            </p>
            <div className="mb-6">
              <span className="text-5xl font-display font-bold">{plan.price}€</span>
              <span className={`text-sm ${plan.popular ? "text-background/70" : "text-muted-foreground"}`}>
                {plan.period}
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className={`flex items-center gap-2 text-sm ${plan.popular ? "text-background/90" : "text-muted-foreground"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${plan.popular ? "bg-accent" : "bg-secondary"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.popular ? "accent" : "hero"}
              size="lg"
              className="w-full"
              onClick={() => window.location.href="/login" }
            >
              Choisir {plan.name}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 bg-foreground text-background">
    <div className="container text-center">
      <img src={tiliLogo} alt="Tili" className="h-12 w-auto mx-auto mb-2 brightness-0 invert" />
      <p className="text-background/60 text-sm">
        © 2026 Tili. Le logiciel de caisse pour les petits commerces.
      </p>
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}