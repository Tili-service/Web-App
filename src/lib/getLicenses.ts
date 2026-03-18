"use server";
import { cookies } from "next/headers";

export type License = {
    licence_id: string,
    account_id: string,
    expiration: string,
    store: {
        name: string,
    } | null,
    is_active: boolean,
};

export default async function getLicenses(): Promise<License[]> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
        throw new Error("Unauthorized: missing auth token");
    }

    const res = await fetch(`${process.env.BACKEND_GO}/licences`, {
        headers: {
            "Authorization": `Bearer ${authToken}`
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Failed to fetch licenses";

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