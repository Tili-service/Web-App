import { z } from "zod";

const stripSpaces = (v: string) => v.replace(/[\s.-]/g, "");

// La Poste établissements share SIREN 356000000 and use a digit-sum rule instead of Luhn.
const LA_POSTE_SIREN = "356000000";

function luhn(digits: string): boolean {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        let d = Number(digits[digits.length - 1 - i]);
        if (i % 2 === 1) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
    }
    return sum % 10 === 0;
}

export function isValidSiret(siret: string): boolean {
    if (!/^\d{14}$/.test(siret)) return false;
    if (siret.startsWith(LA_POSTE_SIREN)) {
        return [...siret].reduce((s, d) => s + Number(d), 0) % 5 === 0;
    }
    return luhn(siret);
}

export function isValidFrenchVat(vat: string): boolean {
    const match = /^FR(\d{2})(\d{9})$/.exec(vat);
    if (!match) return false;
    const [, key, siren] = match;
    return Number(key) === (12 + 3 * (Number(siren) % 97)) % 97;
}

const siretField = z
    .string()
    .transform(stripSpaces)
    .refine((v) => v === "" || /^\d{14}$/.test(v), "Le SIRET doit contenir 14 chiffres")
    .refine((v) => v === "" || isValidSiret(v), "SIRET invalide (vérifiez les chiffres)");

const vatField = z
    .string()
    .transform((v) => stripSpaces(v).toUpperCase())
    .refine((v) => v === "" || /^[A-Z]{2}[A-Z0-9]{2,13}$/.test(v), "Format invalide (ex : FR12345678901)")
    .refine((v) => !v.startsWith("FR") || isValidFrenchVat(v), "Numéro de TVA français invalide");

const shopBase = z.object({
    name: z.string().trim().min(1, "Le nom est requis").max(100, "100 caractères maximum"),
    siret: siretField,
    numero_tva: vatField,
});

const vatMatchesSiret = (d: { siret: string; numero_tva: string }) =>
    !d.siret || !d.numero_tva.startsWith("FR") || d.numero_tva.slice(4) === d.siret.slice(0, 9);

const vatMismatch = {
    message: "Le numéro de TVA ne correspond pas au SIREN du SIRET",
    path: ["numero_tva"],
};

export const shopSchema = shopBase.refine(vatMatchesSiret, vatMismatch);

export const createShopSchema = shopBase
    .extend({
        siret: siretField.refine((v) => v !== "", "Le SIRET est requis"),
        licence_id: z.string().uuid("Licence invalide"),
    })
    .refine(vatMatchesSiret, vatMismatch);

export type ShopFormInput = z.input<typeof shopSchema>;
export type ShopFormOutput = z.output<typeof shopSchema>;
export type CreateShopInput = z.input<typeof createShopSchema>;
export type CreateShopOutput = z.output<typeof createShopSchema>;
