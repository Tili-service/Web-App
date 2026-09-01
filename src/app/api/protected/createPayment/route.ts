import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/cookies";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const offerEntry = formData.get("offer");
        const token = await getAuthToken();

        const VALID_OFFERS = ["mensuel", "semestriel", "annuel"];
        if (!offerEntry || typeof offerEntry !== "string" || !VALID_OFFERS.includes(offerEntry)) {
            throw new Error("Missing or invalid offer parameter");
        }

        if (!token) {
            throw new Error("Unauthorized: missing auth token");
        }

        const offer = offerEntry as string;
        const response = await fetch(`${process.env.BACKEND_GO}/licences/payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ offer}),
        });
        if (!response.ok) {
            throw new Error("Failed to create payment session");
        }
        const session = await response.json();
        if (!session || !session.url) {
            throw new Error(session?.error || "Invalid session data received from server");
        }
        return NextResponse.redirect(session.url, 303);
    } catch (error) {
        console.error("Erreur Stripe :", error);
        const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
        return NextResponse.redirect(`${appUrl}/?error=stripe_error`, 303);
    }
}