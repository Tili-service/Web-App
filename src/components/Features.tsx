import Image from "next/image";
import { motion } from "framer-motion";
import { Puzzle, Clock3, MonitorSmartphone, FileCheck } from "lucide-react";

const simpleFeatures = [
  {
    icon: Puzzle,
    title: "Solution adaptable",
    desc: "Pensée pour tous les commerces, de la petite boutique aux points de vente multi-caisses.",
  },
  {
    icon: Clock3,
    title: "Déploiement rapide",
    desc: "Installation en quelques minutes avec prise en main immédiate de l’équipe.",
  },
  {
    icon: MonitorSmartphone,
    title: "Multi-devices",
    desc: "Fonctionne sur tablette, smartphone et terminal pour encaisser partout.",
  },
  {
    icon: FileCheck,
    title: "Compatibilité TPE",
    desc: "Connexion simple avec vos terminaux de paiement existants (SumUp, myPOS, Ingenico).",
  },
];

const Features = () => (
  <section id="features" className="">
    <div className="bg-foreground text-background py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold font-display mb-4">
            Des outils concrets pour encaisser et piloter votre activité
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {simpleFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="max-w-sm mx-auto"
            >
              <div className="w-14 h-14 mx-auto mb-5 rounded-xl border border-background/30 flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-display font-semibold mb-3">{feature.title}</h3>
              <p className="text-background/80 text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-muted py-16">
      <div className="container grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-display font-semibold mb-4">
            <FileCheck className="w-4 h-4" />
            Certifié NF525
          </span>
          <h3 className="text-3xl font-display font-bold mb-4">
            Conformité fiscale et sécurité des transactions
          </h3>
          <p className="text-muted-foreground text-lg mb-5">
            Tili est conçu pour respecter la réglementation française et sécuriser vos transactions au quotidien.
          </p>
          <div className="flex items-center gap-4">
            <Image src="/logo-sumup.png" alt="SumUp" width={2516} height={731} className="h-7 w-auto object-contain" />
            <Image src="/logo-mypos.png" alt="myPOS Go" width={164} height={208} className="h-7 w-auto object-contain" />
            <Image src="/logo-ingenico.png" alt="Ingenico" width={1024} height={354} className="h-7 w-auto object-contain" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Image
            src="/tili-mockup-NF.png"
            alt="Interface Tili"
            width={1024}
            height={1024}
            className="w-full max-w-xl mx-auto rounded-2xl shadow-warm"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default Features;
