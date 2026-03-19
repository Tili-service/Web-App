"use client";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Suspense, useState } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";
import { plans } from "@/data/plans";

function NewLicenseContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const [selectedPlan, setSelectedPlan] = useState(plan || "mensuel");

  return (
    <div className="max-w-2xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Nouvelle Licence</h2>
          <p className="text-gray-500">Propulsez votre boutique grâce à Tili</p>
        </div>

        <form action="/api/createPayment" method="POST" className="space-y-8">
          <div className="space-y-4">
            <label className="flex items-center gap-2 font-semibold text-sm text-gray-700">
              <CreditCard size={18} className="text-orange-500" />
              Choisissez votre formule
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((p) => {
                const isSelected = selectedPlan === p.param;
                return (
                  <button
                    key={p.param}
                    type="button"
                    onClick={() => setSelectedPlan(p.param)}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/30 ring-4 ring-orange-500/5"
                        : "border-gray-100 hover:border-orange-200 bg-white"
                    }`}
                  >
                    {p.name && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                        {p.name}
                      </span>
                    )}

                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className={`font-bold text-sm ${isSelected ? "text-orange-700" : "text-gray-600"}`}>
                            {p.name}
                          </span>
                          {isSelected && <CheckCircle2 size={18} className="text-orange-500" />}
                        </div>
                        <div className="mt-2">
                          <span className="text-2xl font-black text-gray-900">{p.price}</span>
                          <span className="text-xs text-gray-400 font-medium">{p.period}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] text-gray-500 leading-tight">
                        {p.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

                <input type="hidden" name="offer" value={selectedPlan} />

          <div className="pt-4 space-y-4">
            <Button 
              variant="default" 
              size="lg" 
              className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-bold shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.98]" 
              type="submit"
            >
              Passer au paiement sécurisé
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs">Paiement 100% sécurisé via Stripe</p>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function NewLicensePage() {
    return (
        //TODO(Marin): Check Suspence modification
        <Suspense fallback={<div className="max-w-2xl mx-auto py-8">Chargement...</div>}>
            <NewLicenseContent />
        </Suspense>
    );
}