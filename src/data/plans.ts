
export const plans = [
    {
        name: "Mensuel",
        price: "15",
        period: "/mois",
        desc: "Flexibilité maximale, sans engagement.",
        features: ["Toutes les fonctionnalités", "Support par email", "Mises à jour incluses", "1 point de vente"],
        popular: false,
        param: "mensuel",
    },
    {
        name: "Semestriel",
        price: "85",
        period: "/sem",
        desc: "6 mois d'engagement. Économisez 6%.",
        features: ["Toutes les fonctionnalités", "Support prioritaire", "Mises à jour incluses", "Jusqu'à 3 points de vente", "Formation offerte"],
        popular: true,
        badge: "Populaire",
        param: "semestriel",
    },
    {
        name: "Annuel",
        price: "160",
        period: "/an",
        desc: "Le meilleur tarif. Économisez 11%.",
        features: ["Toutes les fonctionnalités", "Support prioritaire", "Mises à jour incluses", "Points de vente illimités", "Formation offerte", "Personnalisation incluse"],
        popular: false,
        param: "annuel",
    },
];