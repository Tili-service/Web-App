"use server";
import { cookies } from "next/headers";

export type Shop = {
    name: string,
    date_creation: string,
    numero_tva: string,
    siret: string,
};

export default async function getShops(): Promise<Shop[]> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        throw new Error("Unauthorized: missing auth token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/store/me`, {
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Failed to fetch shops";

        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
            console.log("Erreur JSON du backend:", errorData);
        } catch (e) {
            console.log("Erreur texte du backend:", errorText);
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    try {
        const jsonData = await res.json();
        return jsonData;
    } catch (e) {
        console.error("error", await res.text());
        throw new Error("Invalid format received from server");
    }
}